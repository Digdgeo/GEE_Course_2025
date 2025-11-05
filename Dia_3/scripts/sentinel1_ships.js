// ============================================================================
// SCRIPT: DETECCIÓN DE TRÁFICO MARÍTIMO CON SENTINEL-1 Y SENTINEL-2
// ============================================================================
// Este script combina datos ópticos (Sentinel-2) y radar (Sentinel-1) para
// visualizar el tráfico marítimo. Sentinel-2 muestra la tierra en alta resolución
// mientras que Sentinel-1 SAR detecta barcos en el agua, incluso con nubes o de noche.

// ----------------------------------------------------------------------------
// 1. CONFIGURACIÓN INICIAL
// ----------------------------------------------------------------------------

// Períodos de análisis (usar el mismo año para coherencia)
var periodoAnalisis = {inicio: '2024-01-01', fin: '2024-12-31'};

// Parámetros de visualización
var escala = 10;  // Resolución en metros

// ----------------------------------------------------------------------------
// 2. CONCEPTOS: ¿POR QUÉ COMBINAR ÓPTICO Y RADAR?
// ----------------------------------------------------------------------------

/**
 * SENTINEL-2 (Óptico):
 * ✅ Excelente para visualizar tierra con color natural
 * ✅ Alta resolución espacial (10m)
 * ✅ Alta resolución espectral (13 bandas)
 * ✅ Revisita cada 5 días
 * ❌ No funciona con nubes
 * ❌ Solo funciona de día
 * 
 * SENTINEL-1 (Radar SAR):
 * ✅ Funciona con nubes (penetra nubes)
 * ✅ Funciona día y noche
 * ✅ Excelente para detectar barcos (reflectancia fuerte en agua)
 * ✅ Resolución 10m (compatible con S2)
 * ❌ Difícil interpretar visualmente
 * 
 * COMBINACIÓN: Lo mejor de ambos mundos del programa Copernicus
 */

// ----------------------------------------------------------------------------
// 3. PROCESAMIENTO DE SENTINEL-2 PARA CONTEXTO TERRESTRE
// ----------------------------------------------------------------------------

print('=============== PROCESANDO SENTINEL-2 =================');

/**
 * Función para enmascarar nubes en Sentinel-2
 * Usa la banda QA60 que contiene información de nubes y cirros
 */
function enmascararNubesSentinel2(imagen) {
  var qa = imagen.select('QA60');
  
  // Los bits 10 y 11 son nubes y cirros respectivamente
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;
  
  // Ambos deben ser cero, indicando condiciones claras
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));
  
  return imagen.updateMask(mask)
    .divide(10000)  // Convertir a reflectancia
    .copyProperties(imagen, ['system:time_start']);
}

// Cargar y procesar Sentinel-2
var sentinel2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(geometry)
  .filterDate(periodoAnalisis.inicio, periodoAnalisis.fin)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .map(enmascararNubesSentinel2);

print('Imágenes Sentinel-2 disponibles:', sentinel2.size());

// Crear composición mediana
var sentinel2Mediana = sentinel2.median();

print('Composición Sentinel-2 creada');

// Parámetros de visualización 
var visParamsSentinel2 = {
  bands: ['B8', 'B4', 'B3'],  // Nir, Rojo, Verde (10m)
  min: 0,
  max: 0.3,
  gamma: 1.2
};

// ALTERNATIVA: True color 
var visParamsFalsoColor = {
  bands: ['B4', 'B3', 'B2'],  // Rojo, Verde, Azul
  min: 0,
  max: 0.4,
  gamma: 1.2
};

// ----------------------------------------------------------------------------
// 4. MÁSCARA TIERRA/AGUA CON HANSEN GLOBAL FOREST CHANGE
// ----------------------------------------------------------------------------

print('=============== CREANDO MÁSCARA TIERRA/AGUA ============');

/**
 * Dataset Hansen Global Forest Change
 * Incluye una banda 'datamask' donde:
 * 0 = No data
 * 1 = Tierra mapeada
 * 2 = Agua permanente
 */
var hansenImage = ee.Image('UMD/hansen/global_forest_change_2015');
var datamask = hansenImage.select('datamask');

// Crear máscara binaria para TIERRA (valor = 1)
var mascaraTierra = datamask.eq(1);

// Aplicar máscara a Sentinel-2 (solo mostrar tierra)
var sentinel2SoloTierra = sentinel2Mediana.updateMask(mascaraTierra);

// Crear máscara de AGUA (inverso de tierra)
var mascaraAgua = mascaraTierra.not();

// Enmascarar agua consigo misma para eliminar valores cero
mascaraAgua = mascaraAgua.mask(mascaraAgua);

print('Máscara tierra/agua creada');

// ----------------------------------------------------------------------------
// 5. PROCESAMIENTO DE SENTINEL-1 PARA DETECCIÓN MARÍTIMA
// ----------------------------------------------------------------------------

print('=============== PROCESANDO SENTINEL-1 SAR ==============');

/**
 * Sentinel-1 es un radar de apertura sintética (SAR)
 * - Bandas: VV (vertical-vertical) y VH (vertical-horizontal)
 * - VH es mejor para detectar barcos (menor ruido de oleaje)
 * - Modos: IW (Interferometric Wide swath) es el estándar
 * - Órbitas: ASCENDING (ascendente) y DESCENDING (descendente)
 */

// Cargar colección Sentinel-1
var sentinel1 = ee.ImageCollection('COPERNICUS/S1_GRD');

// Filtros base para Sentinel-1
var sentinel1Filtrado = sentinel1
  .filterBounds(geometry)
  .filterDate(periodoAnalisis.inicio, periodoAnalisis.fin)
  // Filtrar por polarización VH (mejor para detectar barcos)
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
  // Filtrar por modo IW (cobertura amplia)
  .filter(ee.Filter.eq('instrumentMode', 'IW'));

print('Imágenes Sentinel-1 disponibles:', sentinel1Filtrado.size());

// Separar por dirección de órbita
// Diferentes ángulos de visión ayudan a detectar más barcos
var vhAscendente = sentinel1Filtrado
  .filter(ee.Filter.eq('orbitProperties_pass', 'ASCENDING'))
  .select('VH');

var vhDescendente = sentinel1Filtrado
  .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
  .select('VH');

print('Órbitas ascendentes:', vhAscendente.size());
print('Órbitas descendentes:', vhDescendente.size());

// ----------------------------------------------------------------------------
// 6. CREAR COMPOSICIONES DE MÁXIMA REFLECTANCIA
// ----------------------------------------------------------------------------

/**
 * Usamos .max() en lugar de .median() porque:
 * - Los barcos tienen valores de retrodispersión MUY ALTOS en agua
 * - El máximo captura todos los barcos que pasaron por el área
 * - Crea un "mapa de calor" de rutas marítimas
 */

var vhMaxAscendente = vhAscendente.max();
var vhMaxDescendente = vhDescendente.max();

// Calcular máximo de cada órbita por separado
var vhMaxAscendente = vhAscendente.max();
var vhMaxDescendente = vhDescendente.max();

// Combinar ambas órbitas para máxima cobertura
// Esto toma el máximo entre TODAS las imágenes de ambas órbitas
var vhMaxCombinado = vhAscendente
  .merge(vhDescendente)
  .max();

print('Composiciones SAR creadas:');
print('  - Imágenes ascendentes:', vhAscendente.size());
print('  - Imágenes descendentes:', vhDescendente.size());
print('  - Total combinadas:', vhAscendente.merge(vhDescendente).size());

// ALTERNATIVA: Usar mediana + filtro focal para suavizar ruido
// var vhMedian = vhAscendente.merge(vhDescendente).median().focal_median(1);

// ALTERNATIVA: Usar mediana + filtro focal para suavizar ruido
// var vhMedianAscendente = vhAscendente.median().focal_median(1);

// ----------------------------------------------------------------------------
// 7. CREAR MOSAICO COMPUESTO TIERRA/AGUA
// ----------------------------------------------------------------------------

/**
 * Estrategia de visualización:
 * 1. Sentinel-2 en color natural para tierra (alta resolución 10m)
 * 2. Capa azul semitransparente para agua
 * 3. Sentinel-1 sobre el agua mostrando tráfico marítimo
 */

// Visualizar Sentinel-2
var visualSentinel2 = sentinel2SoloTierra.visualize(visParamsSentinel2);

// Visualizar agua como capa azul oscuro semitransparente
var visualAgua = mascaraAgua.visualize({
  palette: ['000000'],  // Azul marino oscuro
  opacity: 0.2
});

// Crear mosaico combinando capas
var mosaicoBase = ee.ImageCollection([
  visualSentinel2,
  visualAgua
]).mosaic();

print('Mosaico base tierra/agua creado');

// ----------------------------------------------------------------------------
// 8. VISUALIZACIÓN EN EL MAPA
// ----------------------------------------------------------------------------

// Centrar mapa en el área de interés
Map.centerObject(geometry, 12);

// Parámetros para visualizar Sentinel-1
// Valores en decibelios (dB): más alto = más reflectancia
var visParamsSAR = {
  min: -25,  // Agua oscura/barcos pequeños
  max: 0,    // Barcos grandes/estructuras metálicas
  palette: ['000000', 'FFFFFF']  // Negro a blanco
};

// Parámetros SAR optimizados para tráfico marítimo
var visParamsTrafico = {
  min: -20,
  max: -5,
  palette: ['000000', 'FFFFFF']  // Negro a blanco
};

// CAPA BASE: Contexto Sentinel-2 con agua
Map.addLayer(
  mosaicoBase, 
  {}, 
  'Contexto Sentinel-2 (Tierra + Agua)', 
  true
);

// CAPA SAR 1: Órbita ascendente (desactivada por defecto)
Map.addLayer(
  vhMaxAscendente.updateMask(mascaraAgua), 
  visParamsSAR, 
  'S1 VH Ascendente (solo agua)', 
  false
);

// CAPA SAR 2: Órbita descendente
Map.addLayer(
  vhMaxDescendente.updateMask(mascaraAgua), 
  visParamsSAR, 
  'S1 VH Descendente (solo agua)', 
  false
);

// CAPA SAR 3: Ambas órbitas combinadas (MEJOR COBERTURA)
var sentinel1Trafico = vhMaxCombinado.updateMask(mascaraAgua);

Map.addLayer(
  sentinel1Trafico, 
  visParamsTrafico, 
  'Tráfico Marítimo - Ambas órbitas', 
  true
);

// CAPA EXTRA: Sentinel-2 en falso color (opcional)
Map.addLayer(
  sentinel2SoloTierra.visualize(visParamsFalsoColor),
  {},
  'Sentinel-2 Falso Color (NIR-R-G)',
  false
);

// Añadir geometría de referencia
Map.addLayer(
  geometry, 
  {color: 'yellow', opacity: 0.4}, 
  'Área de Estudio'
);

// ----------------------------------------------------------------------------
// 9. ANÁLISIS E INTERPRETACIÓN
// ----------------------------------------------------------------------------

print('================ INTERPRETACIÓN DE RESULTADOS ==============');
print('PERÍODO DE ANÁLISIS:', periodoAnalisis.inicio, 'a', periodoAnalisis.fin);
print('');
print('VENTAJAS DE USAR SENTINEL-2 PARA TIERRA:');
print('  ✅ Resolución 10m (vs 30m de Landsat)');
print('  ✅ Revisita cada 5 días (vs 16 días de Landsat)');
print('  ✅ Coherencia: ambos sensores Sentinel del programa Copernicus');
print('  ✅ Mejor detalle de zonas costeras y puertos');
print('');
print('VALORES DE SENTINEL-1 VH (en dB):');
print('  -25 a -20 dB: Agua tranquila (oscuro)');
print('  -20 a -15 dB: Agua con oleaje moderado');
print('  -15 a -10 dB: Embarcaciones pequeñas/oleaje fuerte');
print('  -10 a -5 dB: Embarcaciones medianas');
print('  -5 a 0 dB: Embarcaciones grandes/estructuras metálicas');
print('');
print('PUNTOS BRILLANTES EN EL AGUA (colores cálidos):');
print('  🚢 Rutas de navegación frecuentes');
print('  ⚓ Puertos y áreas de fondeo');
print('  🏗️ Plataformas offshore');
print('  ⚠️ Puede haber falsos positivos por oleaje fuerte');
print('============================================================');

// ----------------------------------------------------------------------------
// 10. ESTADÍSTICAS DEL ÁREA
// ----------------------------------------------------------------------------

// Calcular estadísticas de cobertura
var statsImagen = ee.Image.cat([
  mascaraTierra.rename('tierra'),
  mascaraAgua.rename('agua')
]);

var stats = statsImagen.multiply(ee.Image.pixelArea()).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: geometry,
  scale: 100,
  maxPixels: 1e13
});

print('=============== ESTADÍSTICAS DEL ÁREA ==================');
print('Área total de tierra (km²):', 
  ee.Number(stats.get('tierra')).divide(1e6).format('%.2f'));
print('Área total de agua (km²):', 
  ee.Number(stats.get('agua')).divide(1e6).format('%.2f'));
print('========================================================');

// ----------------------------------------------------------------------------
// 11. EXPORTACIÓN (OPCIONAL)
// ----------------------------------------------------------------------------

/**
 * Descomentar para exportar las capas
 */
/*
// Exportar composición Sentinel-2
Export.image.toDrive({
  image: sentinel2SoloTierra.select(['B4', 'B3', 'B2']),
  description: 'Sentinel2_Tierra_' + periodoAnalisis.inicio.replace(/-/g, ''),
  folder: 'GEE_Sentinel',
  region: geometry,
  scale: 10,
  maxPixels: 1e13
});

// Exportar detecciones de tráfico marítimo
Export.image.toDrive({
  image: sentinel1Trafico,
  description: 'Trafico_Maritimo_' + periodoAnalisis.inicio.replace(/-/g, ''),
  folder: 'GEE_Sentinel',
  region: geometry,
  scale: 10,
  maxPixels: 1e13
});
*/


// NOTAS ADICIONALES:
//
// VENTAJAS DE LA COMBINACIÓN SENTINEL-1 + SENTINEL-2:
// ✅ Ambos del programa Copernicus (ESA)
// ✅ Misma resolución espacial (10m)
// ✅ Datos gratuitos y abiertos
// ✅ Cobertura global cada 5-6 días
// ✅ Complementariedad perfecta (día/noche, nubes/sin nubes)
//
// APLICACIONES PRÁCTICAS:
// 🚢 Monitoreo de tráfico marítimo comercial
// 🎣 Control de pesca ilegal (IUU fishing)
// 🛢️ Detección temprana de derrames de petróleo
// ⚓ Planificación portuaria y de rutas
// 🏗️ Seguimiento de construcción offshore
// 🚨 Vigilancia de fronteras marítimas
// 📊 Estudios de densidad de tráfico
//
// LIMITACIONES:
// ⚠️ Oleaje fuerte puede crear falsos positivos
// ⚠️ Barcos de madera/fibra menos visibles que metálicos
// ⚠️ Resolución 10m limita detección de embarcaciones pequeñas
// ⚠️ Requiere conocimiento de interpretación SAR
//
// MEJORAS POSIBLES:
// 1. Filtros de speckle (Lee, Frost) para reducir ruido SAR
// 2. Algoritmos CFAR para detección automática de barcos
// 3. Combinar polarizaciones VV y VH para mejor detección
// 4. Series temporales para patrones de tráfico estacionales
// 5. Integración con datos AIS (Automatic Identification System)
// 6. Clasificación automática de tipos de embarcaciones
// 7. Detección de cambios (barcos que aparecen/desaparecen)
// 8. Análisis de velocidad usando imágenes secuenciales
