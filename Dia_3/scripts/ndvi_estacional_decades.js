// ============================================================================
// SCRIPT: ANÁLISIS FENOLÓGICO DECADAL CON NDVI MULTIESTACIONAL
// ============================================================================
// Este script crea imágenes RGB multiestacionales agrupadas por décadas
// para analizar cambios fenológicos a largo plazo

// ----------------------------------------------------------------------------
// 1. CONFIGURACIÓN INICIAL
// ----------------------------------------------------------------------------

// Colección de composites de NDVI de Landsat
var coleccionNDVI = 'LANDSAT/COMPOSITES/C02/T1_L2_32DAY_NDVI';

// Umbral de NDVI para enmascarar
var umbralNDVI = 0.20;

// Método estadístico: 'median', 'max', 'percentile95'
var metodoEstadistico = 'max';

// ----------------------------------------------------------------------------
// 2. DEFINICIÓN DE PERÍODOS DECADALES
// ----------------------------------------------------------------------------

// Períodos de 10 años alineados con el análisis de MNDWI
var periodos = {
  decada1: {inicio: '1984-09-01', fin: '1994-08-31', nombre: '1984_1994'},
  decada2: {inicio: '1994-09-01', fin: '2004-08-31', nombre: '1994_2004'},
  decada3: {inicio: '2004-09-01', fin: '2014-08-31', nombre: '2004_2014'},
  decada4: {inicio: '2014-09-01', fin: '2024-08-31', nombre: '2014_2024'}
};

// Estaciones del año (manteniendo los meses originales)
var mesesEstaciones = {
  invierno: [1, 2, 3],      // Enero, Febrero, Marzo
  primavera: [4, 5, 6],     // Abril, Mayo, Junio
  verano: [7, 8, 9],        // Julio, Agosto, Septiembre
  otono: [10, 11, 12]       // Octubre, Noviembre, Diciembre
};

// ----------------------------------------------------------------------------
// 3. FUNCIONES DE PROCESAMIENTO
// ----------------------------------------------------------------------------

/**
 * Filtra una colección por un rango de meses específico
 * @param {ee.ImageCollection} coleccion - Colección a filtrar
 * @param {Array} meses - Array de números de mes (1-12)
 * @returns {ee.ImageCollection} - Colección filtrada
 */
function filtrarPorMeses(coleccion, meses) {
  return coleccion.filter(ee.Filter.calendarRange(meses[0], meses[meses.length - 1], 'month'));
}

/**
 * Aplica el método estadístico seleccionado
 * @param {ee.ImageCollection} coleccion - Colección de imágenes NDVI
 * @returns {ee.Image} - Imagen resultante
 */
function aplicarMetodoEstadistico(coleccion) {
  if (metodoEstadistico === 'max') {
    return coleccion.max();
  } else if (metodoEstadistico === 'percentile95') {
    return coleccion.reduce(ee.Reducer.percentile([95])).rename('NDVI');
  } else {
    return coleccion.median();
  }
}

/**
 * Calcula NDVI estacional para un período específico
 * @param {Object} periodo - Objeto con inicio, fin y nombre del período
 * @param {Object} estaciones - Objeto con meses de cada estación
 * @returns {ee.Image} - Imagen multiestacional
 */
function calcularNDVIMultiestacionalPeriodo(periodo, estaciones) {
  // Filtrar colección por el período decadal
  var coleccionPeriodo = ee.ImageCollection(coleccionNDVI)
    .filterDate(periodo.inicio, periodo.fin)
    .select('NDVI');
  
  // Calcular NDVI para cada estación
  var ndvi_invierno = aplicarMetodoEstadistico(
    filtrarPorMeses(coleccionPeriodo, estaciones.invierno)
  ).rename('invierno');
  
  var ndvi_primavera = aplicarMetodoEstadistico(
    filtrarPorMeses(coleccionPeriodo, estaciones.primavera)
  ).rename('primavera');
  
  var ndvi_verano = aplicarMetodoEstadistico(
    filtrarPorMeses(coleccionPeriodo, estaciones.verano)
  ).rename('verano');
  
  var ndvi_otono = aplicarMetodoEstadistico(
    filtrarPorMeses(coleccionPeriodo, estaciones.otono)
  ).rename('otono');
  
  // Concatenar todas las estaciones
  return ee.Image.cat([
    ndvi_invierno,
    ndvi_primavera,
    ndvi_verano,
    ndvi_otono
  ])//.clip(geometry3);
}

/**
 * Aplica enmascaramiento basado en NDVI medio
 * @param {ee.Image} imagen - Imagen multiestacional
 * @param {number} umbral - Umbral de NDVI
 * @returns {ee.Image} - Imagen enmascarada
 */
function enmascararVegetacion(imagen, umbral) {
  var ndviMedio = imagen.reduce(ee.Reducer.mean());
  var mascara = ndviMedio.gt(umbral);
  return imagen.updateMask(mascara);
}

// ----------------------------------------------------------------------------
// 4. CALCULAR NDVI MULTIESTACIONAL PARA CADA DÉCADA
// ----------------------------------------------------------------------------

print('Método estadístico aplicado:', metodoEstadistico.toUpperCase());

// Procesar cada década
var ndvi_1984_1994 = calcularNDVIMultiestacionalPeriodo(periodos.decada1, mesesEstaciones);
var ndvi_1994_2004 = calcularNDVIMultiestacionalPeriodo(periodos.decada2, mesesEstaciones);
var ndvi_2004_2014 = calcularNDVIMultiestacionalPeriodo(periodos.decada3, mesesEstaciones);
var ndvi_2014_2024 = calcularNDVIMultiestacionalPeriodo(periodos.decada4, mesesEstaciones);

// Aplicar enmascaramiento
var ndvi_1984_1994_masked = enmascararVegetacion(ndvi_1984_1994, umbralNDVI);
var ndvi_1994_2004_masked = enmascararVegetacion(ndvi_1994_2004, umbralNDVI);
var ndvi_2004_2014_masked = enmascararVegetacion(ndvi_2004_2014, umbralNDVI);
var ndvi_2014_2024_masked = enmascararVegetacion(ndvi_2014_2024, umbralNDVI);

// ----------------------------------------------------------------------------
// 5. VISUALIZACIÓN EN EL MAPA
// ----------------------------------------------------------------------------

Map.centerObject(geometry3, 9);

var parametrosVis = {
  min: 0.1,
  max: 0.7,
  bands: ['invierno', 'primavera', 'verano']
};

var parametrosVisMasked = {
  min: 0.25,
  max: 0.7,
  bands: ['invierno', 'primavera', 'verano']
};

// Añadir capas al mapa (solo activa la última década por defecto)
Map.addLayer(ndvi_1984_1994, parametrosVis, 'NDVI 1984-1994', false);
Map.addLayer(ndvi_1984_1994_masked, parametrosVisMasked, 'NDVI 1984-1994 (enmascarado)', false);

Map.addLayer(ndvi_1994_2004, parametrosVis, 'NDVI 1994-2004', false);
Map.addLayer(ndvi_1994_2004_masked, parametrosVisMasked, 'NDVI 1994-2004 (enmascarado)', false);

Map.addLayer(ndvi_2004_2014, parametrosVis, 'NDVI 2004-2014', false);
Map.addLayer(ndvi_2004_2014_masked, parametrosVisMasked, 'NDVI 2004-2014 (enmascarado)', false);

Map.addLayer(ndvi_2014_2024, parametrosVis, 'NDVI 2014-2024');
Map.addLayer(ndvi_2014_2024_masked, parametrosVisMasked, 'NDVI 2014-2024 (enmascarado)');

Map.addLayer(geometry3, {color: 'red', opacity: 0.3}, 'Área de estudio');

// ----------------------------------------------------------------------------
// 6. EXPORTACIÓN (OPCIONAL)
// ----------------------------------------------------------------------------

// Descomentar para exportar las décadas
/*
Export.image.toAsset({
  image: ndvi_2014_2024_masked,
  description: 'NDVI_multiestacional_2014_2024_' + metodoEstadistico,
  assetId: 'users/ee-digdgeografo/NDVI_multiestacional_2014_2024_' + metodoEstadistico,
  region: geometry,
  scale: 30,
  maxPixels: 1e13
});
*/

// ----------------------------------------------------------------------------
// 7. INTERPRETACIÓN
// ----------------------------------------------------------------------------

print('=== ANÁLISIS FENOLÓGICO POR DÉCADAS ===');
print('Comparar las diferentes décadas permite identificar:');
print('- Cambios en los patrones de crecimiento de la vegetación');
print('- Alteraciones en la fenología debido al cambio climático');
print('- Efectos de la gestión del territorio sobre los ciclos vegetativos');
