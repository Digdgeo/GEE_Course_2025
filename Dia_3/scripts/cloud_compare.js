// ============================================================================
// SCRIPT: COMPARACIÓN DE MÉTODOS DE DETECCIÓN DE NUBES EN SENTINEL-2
// ============================================================================
// Este script compara 3 métodos diferentes para detectar nubes en Sentinel-2
// usando mapas linkeados (sincronizados) para facilitar la comparación visual

// ----------------------------------------------------------------------------
// 1. CONFIGURACIÓN INICIAL
// ----------------------------------------------------------------------------

// Período de análisis (ajustar según necesidad)
var fechaInicio = '2018-05-01';
var fechaFin = '2018-05-05';

// Área de interés (Islas Canarias - zona con nubes frecuentes)
var areaInteres = ee.Geometry.Point([-16.4695, 28.28]);

// Umbral de probabilidad de nubes (0-100%)
var umbralProbabilidad = 50;

// ----------------------------------------------------------------------------
// 2. CONCEPTOS: MÉTODOS DE DETECCIÓN DE NUBES EN SENTINEL-2
// ----------------------------------------------------------------------------

/**
 * MÉTODO 1: CLOUD PROBABILITY (Más preciso)
 * - Dataset: COPERNICUS/S2_CLOUD_PROBABILITY
 * - Machine learning específico para nubes
 * - Valores: 0-100 (probabilidad de nube en %)
 * - ✅ Más preciso
 * - ✅ Separa nubes de nieve/hielo
 * - ❌ Producto separado (no siempre disponible)
 * 
 * MÉTODO 2: SURFACE REFLECTANCE - MSK_CLDPRB
 * - Banda en COPERNICUS/S2_SR
 * - Incluida en el producto de reflectancia de superficie
 * - Valores: 0-100 (probabilidad de nube)
 * - ✅ Ya incluido en S2_SR
 * - 🔶 Precisión intermedia
 * 
 * MÉTODO 3: QA60 (Tradicional)
 * - Banda QA60 en COPERNICUS/S2 (TOA)
 * - Detección basada en bits (10=nubes, 11=cirros)
 * - Método más simple y antiguo
 * - ✅ Siempre disponible
 * - ❌ Menos preciso
 * - ❌ No distingue bien tipos de nubes
 */

// ----------------------------------------------------------------------------
// 3. CARGAR COLECCIONES DE IMÁGENES
// ----------------------------------------------------------------------------

print('============= CARGANDO DATOS SENTINEL-2 ==================');

// Imagen base (TOA - Top of Atmosphere)
var sentinel2TOA = ee.ImageCollection('COPERNICUS/S2')
  .filterBounds(areaInteres)
  .filterDate(fechaInicio, fechaFin)
  .sort('CLOUDY_PIXEL_PERCENTAGE')
  .first();  // Tomar la imagen con menos nubes

print('Imagen Sentinel-2 TOA:', sentinel2TOA);
print('Fecha:', ee.Date(sentinel2TOA.get('system:time_start')).format('YYYY-MM-dd'));
print('Nubosidad:', sentinel2TOA.get('CLOUDY_PIXEL_PERCENTAGE'), '%');

// Parámetros de visualización RGB
var visParamsRGB = {
  min: 0,
  max: 3000,
  bands: ['B4', 'B3', 'B2']
};

// ----------------------------------------------------------------------------
// 4. MÉTODO 1: CLOUD PROBABILITY
// ----------------------------------------------------------------------------

print('=============== MÉTODO 1: Cloud Probability ===============');

/**
 * Función para crear máscara usando Cloud Probability
 * Valores > umbral = nube (se marcan como nube)
 */
function crearMascaraCloudProbability(image) {
  var esNube = image.gte(umbralProbabilidad);
  return esNube.rename('cloud_mask');
}

// Cargar Cloud Probability
var cloudProbability = ee.ImageCollection("COPERNICUS/S2_CLOUD_PROBABILITY")
  .filterBounds(areaInteres)
  .filterDate(fechaInicio, fechaFin)
  .map(crearMascaraCloudProbability);

var mascaraCloudProb = cloudProbability.first();
print('Cloud Probability procesado');

// ----------------------------------------------------------------------------
// 5. MÉTODO 2: SURFACE REFLECTANCE - MSK_CLDPRB
// ----------------------------------------------------------------------------

print('============ MÉTODO 2: Surface Reflectance ===============');

/**
 * Función para crear máscara desde SR
 * La banda MSK_CLDPRB contiene probabilidad de nubes (0-100)
 */
function crearMascaraSR(image) {
  var cloudProb = image.select('MSK_CLDPRB');
  var esNube = cloudProb.gte(umbralProbabilidad);
  return esNube.rename('cloud_mask');
}

// Cargar Surface Reflectance
var sentinel2SR = ee.ImageCollection("COPERNICUS/S2_SR")
  .filterBounds(areaInteres)
  .filterDate(fechaInicio, fechaFin)
  .map(crearMascaraSR);

var mascaraSR = sentinel2SR.first();
print('Surface Reflectance procesado');

// ----------------------------------------------------------------------------
// 6. MÉTODO 3: QA60 (MÉTODO TRADICIONAL)
// ----------------------------------------------------------------------------

print('================= MÉTODO 3: QA60 Mask ====================');

/**
 * Función para crear máscara usando QA60
 * Bit 10: Nubes opacas
 * Bit 11: Cirros (nubes altas/transparentes)
 */
function crearMascaraQA60(image) {
  var qa = image.select('QA60');
  
  // Definir máscaras de bits
  var cloudBitMask = 1 << 10;  // Bit 10 = nubes
  var cirrusBitMask = 1 << 11; // Bit 11 = cirros
  
  // Detectar nubes (bit 10 = 1)
  var nubes = qa.bitwiseAnd(cloudBitMask).neq(0);
  
  // Detectar cirros (bit 11 = 1)
  var cirros = qa.bitwiseAnd(cirrusBitMask).neq(0);
  
  // Combinar: nube O cirro = considerar como nube
  var esNube = nubes.or(cirros);
  
  return esNube.rename('cloud_mask');
}

var mascaraQA60 = crearMascaraQA60(sentinel2TOA);
print('QA60 Mask procesado');

// ----------------------------------------------------------------------------
// 7. CREAR INTERFAZ DE MAPAS LINKEADOS
// ----------------------------------------------------------------------------

print('=============== CREANDO MAPAS LINKEADOS ==================');

// Array para almacenar los mapas
var mapas = [];

// MAPA 1: Cloud Probability
var mapa1 = ui.Map();
mapa1.add(ui.Label('🔵 MÉTODO 1: Cloud Probability', {
  fontWeight: 'bold',
  fontSize: '14px',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  padding: '5px'
}));
mapa1.addLayer(sentinel2TOA, visParamsRGB, 'Sentinel-2 RGB');
mapa1.addLayer(
  mascaraCloudProb.selfMask(), 
  {palette: ['yellow'], opacity: 0.6}, 
  'Nubes (amarillo)'
);
mapa1.setControlVisibility(false);
mapas.push(mapa1);

// MAPA 2: Surface Reflectance
var mapa2 = ui.Map();
mapa2.add(ui.Label('🔴 MÉTODO 2: Surface Reflectance (MSK_CLDPRB)', {
  fontWeight: 'bold',
  fontSize: '14px',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  padding: '5px'
}));
mapa2.addLayer(sentinel2TOA, visParamsRGB, 'Sentinel-2 RGB');
mapa2.addLayer(
  mascaraSR.selfMask(), 
  {palette: ['red'], opacity: 0.6}, 
  'Nubes (rojo)'
);
mapa2.setControlVisibility(false);
mapas.push(mapa2);

// MAPA 3: QA60 Mask
var mapa3 = ui.Map();
mapa3.add(ui.Label('🟢 MÉTODO 3: QA60 (Tradicional)', {
  fontWeight: 'bold',
  fontSize: '14px',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  padding: '5px'
}));
mapa3.addLayer(sentinel2TOA, visParamsRGB, 'Sentinel-2 RGB');
mapa3.addLayer(
  mascaraQA60.selfMask(), 
  {palette: ['cyan'], opacity: 0.6}, 
  'Nubes (cian)'
);
mapa3.setControlVisibility(false);
mapas.push(mapa3);

// MAPA 4: Imagen sin máscara (referencia)
var mapa4 = ui.Map();
mapa4.add(ui.Label('⚪ REFERENCIA: Sin Máscara', {
  fontWeight: 'bold',
  fontSize: '14px',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  padding: '5px'
}));
mapa4.addLayer(sentinel2TOA, visParamsRGB, 'Sentinel-2 RGB');
mapa4.setControlVisibility(false);
mapas.push(mapa4);

// ----------------------------------------------------------------------------
// 8. LINKEAR MAPAS (SINCRONIZAR)
// ----------------------------------------------------------------------------

// Crear linker para sincronizar zoom y posición
var linker = ui.Map.Linker(mapas);

print('Mapas linkeados - el movimiento se sincroniza entre todos');

// ----------------------------------------------------------------------------
// 9. CONFIGURAR LAYOUT
// ----------------------------------------------------------------------------

// Crear grid 2x2 con los mapas
var gridMapas = ui.Panel(
  [
    ui.Panel([mapas[0]], null, {stretch: 'both'}),
    ui.Panel([mapas[1]], null, {stretch: 'both'}),
    ui.Panel([mapas[2]], null, {stretch: 'both'}),
    ui.Panel([mapas[3]], null, {stretch: 'both'})
  ],
  ui.Panel.Layout.Flow('horizontal'), 
  {stretch: 'both'}
);

// Habilitar controles solo en el primer mapa
mapas[0].setControlVisibility({
  zoomControl: true,
  scaleControl: true,
  mapTypeControl: false,
  fullscreenControl: false
});

// Crear título principal
var tituloPrincipal = ui.Label(
  '☁️ COMPARACIÓN DE MÉTODOS DE DETECCIÓN DE NUBES - SENTINEL-2',
  {
    stretch: 'horizontal',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    backgroundColor: 'rgba(230, 230, 230, 0.9)',
    padding: '10px'
  }
);

// Crear panel de instrucciones
var instrucciones = ui.Label(
  '📍 Mueve el mapa para comparar los 3 métodos | 🟡 Amarillo: Cloud Probability | 🔴 Rojo: SR | 🔵 Cian: QA60',
  {
    stretch: 'horizontal',
    textAlign: 'center',
    fontSize: '12px',
    backgroundColor: 'rgba(255, 255, 200, 0.8)',
    padding: '5px'
  }
);

// ----------------------------------------------------------------------------
// 10. RENDERIZAR INTERFAZ
// ----------------------------------------------------------------------------

// Centrar el primer mapa
mapas[0].setCenter(areaInteres.coordinates().get(0).getInfo(), 
                   areaInteres.coordinates().get(1).getInfo(), 
                   10);

// Cargar la interfaz
ui.root.clear();
ui.root.add(tituloPrincipal);
ui.root.add(instrucciones);
ui.root.add(gridMapas);
ui.root.setLayout(ui.Panel.Layout.Flow('vertical'));

// ----------------------------------------------------------------------------
// 11. ESTADÍSTICAS COMPARATIVAS
// ----------------------------------------------------------------------------

print('============== ESTADÍSTICAS COMPARATIVAS ==================');

// Calcular área cubierta por nubes con cada método
var areaEstudio = sentinel2TOA.geometry();

var statsCloudProb = mascaraCloudProb.multiply(ee.Image.pixelArea()).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: areaEstudio,
  scale: 100,
  maxPixels: 1e13
});

var statsSR = mascaraSR.multiply(ee.Image.pixelArea()).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: areaEstudio,
  scale: 100,
  maxPixels: 1e13
});

var statsQA60 = mascaraQA60.multiply(ee.Image.pixelArea()).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: areaEstudio,
  scale: 100,
  maxPixels: 1e13
});

print('Área detectada como nubes:');
print('  Cloud Probability (km²):', 
  ee.Number(statsCloudProb.get('cloud_mask')).divide(1e6).format('%.2f'));
print('  Surface Reflectance (km²):', 
  ee.Number(statsSR.get('cloud_mask')).divide(1e6).format('%.2f'));
print('  QA60 (km²):', 
  ee.Number(statsQA60.get('cloud_mask')).divide(1e6).format('%.2f'));

print('==========================================================');

// ----------------------------------------------------------------------------
// 12. RECOMENDACIONES
// ----------------------------------------------------------------------------

print('=================== RECOMENDACIONES =======================');
print('');
print('¿QUÉ MÉTODO USAR?');
print('');
print('🥇 MEJOR: Cloud Probability');
print('   ✅ Más preciso y actualizado');
print('   ✅ Mejor para análisis científicos');
print('   ✅ Distingue bien nubes de nieve/hielo');
print('   ⚠️  Producto separado (puede no estar siempre)');
print('');
print('🥈 BUENO: Surface Reflectance (MSK_CLDPRB)');
print('   ✅ Ya incluido en S2_SR');
print('   ✅ Buena precisión');
print('   ✅ Conveniente si usas S2_SR');
print('');
print('🥉 BÁSICO: QA60');
print('   ✅ Siempre disponible');
print('   ✅ Rápido y simple');
print('   ❌ Menos preciso');
print('   ⚠️  Puede confundir nieve con nubes');
print('');
print('UMBRAL USADO:', umbralProbabilidad, '%');
print('  - Más bajo (ej: 30%): Más conservador, elimina más píxeles');
print('  - Más alto (ej: 70%): Más permisivo, mantiene más píxeles');
print('==========================================================');


// NOTAS ADICIONALES:
//
// CÓMO USAR ESTE SCRIPT:
// 1. Ajusta fechaInicio y fechaFin para tu período de interés
// 2. Cambia areaInteres a tu zona de estudio
// 3. Ajusta umbralProbabilidad según necesites (30-70% típico)
// 4. Mueve cualquiera de los 4 mapas - todos se sincronizan
// 5. Compara visualmente cuál método detecta mejor las nubes
//
// INTERPRETACIÓN VISUAL:
// 🟡 Amarillo (Cloud Prob): Suele ser el más preciso
// 🔴 Rojo (SR): Similar a amarillo pero menos detallado
// 🔵 Cian (QA60): A veces detecta menos o más que los otros
// ⚪ Sin color (Referencia): La imagen real para comparar
//
// APLICACIONES PRÁCTICAS:
// - Evaluar calidad de máscaras de nubes
// - Decidir qué método usar en tu proyecto
// - Identificar falsos positivos/negativos
// - Entender limitaciones de cada método
// - Entrenar/validar algoritmos propios de detección
//
// MEJORAS POSIBLES:
// 1. Añadir slider para cambiar umbral interactivamente
// 2. Incluir método de sombras de nubes
// 3. Comparar en múltiples fechas/estaciones
// 4. Calcular métricas de precisión con ground truth
// 5. Combinar métodos (ensemble) para mejor resultado
