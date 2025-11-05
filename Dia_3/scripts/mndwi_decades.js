// ============================================================================
// SCRIPT: ANÁLISIS TEMPORAL DE AGUA CON MNDWI - SERIES TEMPORALES LANDSAT
// ============================================================================
// Este script combina datos de Landsat 5, 7, 8 y 9 para calcular el índice
// MNDWI (Modified Normalized Difference Water Index) en 4 períodos de 10 años

// ----------------------------------------------------------------------------
// 1. CONFIGURACIÓN INICIAL
// ----------------------------------------------------------------------------

// Definir el rango temporal completo del análisis
var fechaInicio = '1984-01-01';
var fechaFin = '2023-12-31';

// Sistema de coordenadas de referencia (UTM Zone 29N para el área de estudio)
var crs = 'EPSG:32629';

// Umbral de cobertura de nubes (solo imágenes con menos del 20% de nubes)
var umbralNubes = 20;

// Escala espacial de trabajo (resolución de Landsat)
var escala = 30;

// CONFIGURACIÓN DE ANÁLISIS ESTADÍSTICO
// Opciones: 'median', 'max', 'percentile98'
var metodoEstadistico = 'percentile98';

// Umbral de MNDWI para considerar agua (valores > 0 indican presencia de agua)
var umbralAgua = 0;

// ----------------------------------------------------------------------------
// 2. FUNCIONES DE PROCESAMIENTO
// ----------------------------------------------------------------------------

/**
 * Selecciona y renombra las bandas de las diferentes colecciones de Landsat
 * Landsat 5 y 7 tienen la misma nomenclatura de bandas
 * Landsat 8 y 9 tienen nomenclatura diferente (empiezan en B2 en vez de B1)
 */
function seleccionarBandasColeccion(imagen, satelite) {
  var bandasOriginales, bandasRenombradas;
  
  // Landsat 5 y 7 comparten la misma estructura de bandas
  if (satelite === 'L5' || satelite === 'L7') {
    bandasOriginales = ['SR_B1', 'SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B7'];
    bandasRenombradas = ['blue', 'green', 'red', 'nir', 'swir1', 'swir2'];
  } 
  // Landsat 8 y 9 tienen un desplazamiento en la numeración de bandas
  else {
    bandasOriginales = ['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'];
    bandasRenombradas = ['blue', 'green', 'red', 'nir', 'swir1', 'swir2'];
  }
  
  return imagen.select(bandasOriginales, bandasRenombradas);
}

/**
 * Aplica los coeficientes de calibración para convertir valores digitales
 * a reflectancia de superficie según documentación de Landsat Collection 2
 */
function aplicarCoeficientesReflectividad(imagen) {
  return imagen.multiply(0.0000275).add(-0.2)
    .copyProperties(imagen, imagen.propertyNames());
}

/**
 * Calcula el índice MNDWI (Modified Normalized Difference Water Index)
 * MNDWI = (Green - SWIR1) / (Green + SWIR1)
 * Valores positivos indican presencia de agua
 */
function calcularMNDWI(imagen) {
  var mndwi = imagen.normalizedDifference(['green', 'swir1'])
    .rename('MNDWI');
  
  // Recortar al área de estudio y reproyectar
  return mndwi.clip(extent)
    .select('MNDWI')
    .reproject({crs: crs, scale: escala});
}

/**
 * Aplica una máscara para mostrar solo valores de MNDWI que indican agua
 * Enmascara todos los valores menores o iguales al umbral definido
 */
function enmascararAgua(imagen) {
  var mascara = imagen.gt(umbralAgua);
  return imagen.updateMask(mascara);
}

/**
 * Aplica el método estadístico seleccionado a una colección de imágenes
 * @param {ee.ImageCollection} coleccion - Colección de imágenes MNDWI
 * @returns {ee.Image} - Imagen resultante según el método estadístico
 */
function aplicarMetodoEstadistico(coleccion) {
  var resultado;
  
  if (metodoEstadistico === 'max') {
    // Máximo: útil para identificar la máxima extensión de agua
    resultado = coleccion.max();
    print('Método aplicado: MÁXIMO');
  } 
  else if (metodoEstadistico === 'percentile95') {
    // Percentil 95: elimina outliers extremos pero mantiene valores altos
    resultado = coleccion.reduce(ee.Reducer.percentile([98]))
      .rename('MNDWI');
    print('Método aplicado: PERCENTIL 95');
  } 
  else {
    // Mediana (por defecto): valor central, robusto ante outliers
    resultado = coleccion.median();
    print('Método aplicado: MEDIANA');
  }
  
  return resultado;
}

// ----------------------------------------------------------------------------
// 3. CARGA Y PROCESAMIENTO DE COLECCIONES LANDSAT
// ----------------------------------------------------------------------------

// Cargar Landsat 5 (1984-2012)
var landsat5 = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2')
  .filterDate(fechaInicio, fechaFin)
  .filterBounds(region)
  .filter(ee.Filter.lt('CLOUD_COVER', umbralNubes))
  .map(function(img) { 
    return seleccionarBandasColeccion(img, 'L5').clip(extent); 
  });

// Cargar Landsat 7 (1999-presente)
var landsat7 = ee.ImageCollection('LANDSAT/LE07/C02/T1_L2')
  .filterDate(fechaInicio, fechaFin)
  .filterBounds(region)
  .filter(ee.Filter.lt('CLOUD_COVER', umbralNubes))
  .map(function(img) { 
    return seleccionarBandasColeccion(img, 'L7').clip(extent); 
  });

// Cargar Landsat 8 (2013-presente)
var landsat8 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .filterDate(fechaInicio, fechaFin)
  .filterBounds(region)
  .filter(ee.Filter.lt('CLOUD_COVER', umbralNubes))
  .map(function(img) { 
    return seleccionarBandasColeccion(img, 'L8').clip(extent); 
  });

// Cargar Landsat 9 (2021-presente)
var landsat9 = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')
  .filterDate(fechaInicio, fechaFin)
  .filterBounds(region)
  .filter(ee.Filter.lt('CLOUD_COVER', umbralNubes))
  .map(function(img) { 
    return seleccionarBandasColeccion(img, 'L9').clip(extent); 
  });

// Combinar todas las colecciones en una serie temporal unificada
var landsatCombinado = landsat5.merge(landsat7).merge(landsat8).merge(landsat9);

print("Colección combinada Landsat:", landsatCombinado);

// Aplicar conversión a reflectancia de superficie
var landsatCombinadoReflectividad = landsatCombinado.map(aplicarCoeficientesReflectividad);

// ----------------------------------------------------------------------------
// 4. DIVISIÓN EN PERÍODOS DECADALES (10 AÑOS)
// ----------------------------------------------------------------------------
// Períodos hidrológicos: del 1 de septiembre al 31 de agosto

var periodo_1984_1994 = landsatCombinadoReflectividad
  .filterDate('1984-09-01', '1994-08-31');
  
var periodo_1994_2004 = landsatCombinadoReflectividad
  .filterDate('1994-09-01', '2004-08-31');
  
var periodo_2004_2014 = landsatCombinadoReflectividad
  .filterDate('2004-09-01', '2014-08-31');
  
var periodo_2014_2024 = landsatCombinadoReflectividad
  .filterDate('2014-09-01', '2024-08-31');

// ----------------------------------------------------------------------------
// 5. CÁLCULO DE MNDWI PARA CADA PERÍODO
// ----------------------------------------------------------------------------
// Primero se calcula el MNDWI para cada imagen del período
// Luego se aplica el método estadístico seleccionado (median, max o percentile95)
// Finalmente se enmascara para mostrar solo valores que indican agua (> 0)

var mndwi_1984_1994 = aplicarMetodoEstadistico(periodo_1984_1994.map(calcularMNDWI));
var mndwi_1994_2004 = aplicarMetodoEstadistico(periodo_1994_2004.map(calcularMNDWI));
var mndwi_2004_2014 = aplicarMetodoEstadistico(periodo_2004_2014.map(calcularMNDWI));
var mndwi_2014_2024 = aplicarMetodoEstadistico(periodo_2014_2024.map(calcularMNDWI));

// Aplicar máscara de agua (solo valores > 0)
var mndwi_1984_1994_masked = enmascararAgua(mndwi_1984_1994);
var mndwi_1994_2004_masked = enmascararAgua(mndwi_1994_2004);
var mndwi_2004_2014_masked = enmascararAgua(mndwi_2004_2014);
var mndwi_2014_2024_masked = enmascararAgua(mndwi_2014_2024);

// ----------------------------------------------------------------------------
// 6. VISUALIZACIÓN EN EL MAPA
// ----------------------------------------------------------------------------

// Centrar el mapa en el área de estudio
Map.centerObject(extent, 10);

// Paleta de colores: azul claro a azul oscuro (solo para agua)
var paletaAgua = ['lightblue', 'blue', 'darkblue'];

// Añadir capas enmascaradas al mapa (solo se muestra agua)
Map.addLayer(mndwi_1984_1994_masked, {min: 0, max: 1, palette: paletaAgua}, 
  'MNDWI 1984-1994 (solo agua)');
Map.addLayer(mndwi_1994_2004_masked, {min: 0, max: 1, palette: paletaAgua}, 
  'MNDWI 1994-2004 (solo agua)', false);
Map.addLayer(mndwi_2004_2014_masked, {min: 0, max: 1, palette: paletaAgua}, 
  'MNDWI 2004-2014 (solo agua)', false);
Map.addLayer(mndwi_2014_2024_masked, {min: 0, max: 1, palette: paletaAgua}, 
  'MNDWI 2014-2024 (solo agua)', false);

// ----------------------------------------------------------------------------
// 7. EXPORTACIÓN DE RESULTADOS
// ----------------------------------------------------------------------------

// Definir parámetros comunes de exportación
var parametrosExportacion = {
  region: extent,
  scale: escala,
  crs: crs,
  maxPixels: 1e13
};

// Exportar cada período como un asset (versión enmascarada)
Export.image.toAsset({
  image: mndwi_1984_1994_masked,
  description: 'MNDWI_1984_1994_' + metodoEstadistico + '_masked',
  assetId: 'users/ee-digdgeografo/MNDWI_1984_1994_' + metodoEstadistico + '_masked',
  region: parametrosExportacion.region,
  scale: parametrosExportacion.scale,
  crs: parametrosExportacion.crs,
  maxPixels: parametrosExportacion.maxPixels
});

Export.image.toAsset({
  image: mndwi_1994_2004_masked,
  description: 'MNDWI_1994_2004_' + metodoEstadistico + '_masked',
  assetId: 'users/ee-digdgeografo/MNDWI_1994_2004_' + metodoEstadistico + '_masked',
  region: parametrosExportacion.region,
  scale: parametrosExportacion.scale,
  crs: parametrosExportacion.crs,
  maxPixels: parametrosExportacion.maxPixels
});

Export.image.toAsset({
  image: mndwi_2004_2014_masked,
  description: 'MNDWI_2004_2014_' + metodoEstadistico + '_masked',
  assetId: 'users/ee-digdgeografo/MNDWI_2004_2014_' + metodoEstadistico + '_masked',
  region: parametrosExportacion.region,
  scale: parametrosExportacion.scale,
  crs: parametrosExportacion.crs,
  maxPixels: parametrosExportacion.maxPixels
});

Export.image.toAsset({
  image: mndwi_2014_2024_masked,
  description: 'MNDWI_2014_2024_' + metodoEstadistico + '_masked',
  assetId: 'users/ee-digdgeografo/MNDWI_2014_2024_' + metodoEstadistico + '_masked',
  region: parametrosExportacion.region,
  scale: parametrosExportacion.scale,
  crs: parametrosExportacion.crs,
  maxPixels: parametrosExportacion.maxPixels
});
