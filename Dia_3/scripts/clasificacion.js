// ============================================================================
// SCRIPT: CLASIFICACIÓN SUPERVISADA MULTI-TEMPORAL CON SENTINEL-2
// ============================================================================
// Este script realiza una clasificación supervisada de cobertura del suelo
// utilizando imágenes Sentinel-2 de las 4 estaciones del año 2020
// y un algoritmo de árboles de decisión (CART)

// ----------------------------------------------------------------------------
// 1. CONFIGURACIÓN INICIAL
// ----------------------------------------------------------------------------

// Año de análisis
var year = 2020;

// Definir las estaciones del año
var estaciones = {
  invierno: {inicio: year + '-01-01', fin: year + '-03-31'},
  primavera: {inicio: year + '-04-01', fin: year + '-06-30'},
  verano: {inicio: year + '-07-01', fin: year + '-09-30'},
  otono: {inicio: year + '-10-01', fin: year + '-12-31'}
};

// Proporción de datos para entrenamiento vs validación
var splitRatio = 0.7;  // 70% entrenamiento, 30% validación

// ----------------------------------------------------------------------------
// 2. CARGA DE DATOS DE ENTRENAMIENTO
// ----------------------------------------------------------------------------

/**
 * Cargar FeatureCollection con puntos de entrenamiento
 * Este FeatureCollection debe contener:
 * - Geometrías (puntos o polígonos) de diferentes clases
 * - Propiedad 'class' con el código numérico de cada clase
 * 
 * Clases en este ejemplo:
 * 1: Arena/Suelo desnudo
 * 2: Agua
 * 3: Invernaderos
 * 4: Arrozal
 * 5: Pinares
 * 6: Eucaliptos
 */
var newfc = ee.FeatureCollection('projects/ee-digdgeografo/assets/newfc');

print('Muestras de entrenamiento:', newfc.size());
print('Clases disponibles:', newfc.aggregate_array('class').distinct());

// ----------------------------------------------------------------------------
// 3. FUNCIONES DE PROCESAMIENTO
// ----------------------------------------------------------------------------

/**
 * Procesa una colección Sentinel-2 para una estación específica
 * Selecciona bandas relevantes y calcula NDVI
 * @param {Object} periodo - Objeto con fechas de inicio y fin
 * @returns {ee.Image} - Imagen mediana con bandas y NDVI
 */
function procesarSentinel2Estacion(periodo) {
  var coleccion = ee.ImageCollection("COPERNICUS/S2_SR")
    .filterDate(periodo.inicio, periodo.fin)
    .filterBounds(geometry)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20));
  
  // Seleccionar bandas y calcular NDVI para cada imagen
  var procesada = coleccion.map(function(image) {
    // Seleccionar bandas espectrales de Sentinel-2
    var bandas = image.select([
      'B2',   // Azul
      'B3',   // Verde
      'B4',   // Rojo
      'B5',   // Red Edge 1
      'B6',   // Red Edge 2
      'B7',   // Red Edge 3
      'B8',   // NIR
      'B8A',  // NIR Narrow
      'B11',  // SWIR 1
      'B12'   // SWIR 2
    ]);
    
    // Calcular NDVI: (NIR - Red) / (NIR + Red)
    var ndvi = image.normalizedDifference(['B8', 'B4']).rename('ndvi');
    
    return bandas.addBands(ndvi);
  });
  
  // Retornar la mediana de todas las imágenes del período
  return procesada.median();
}

// ----------------------------------------------------------------------------
// 4. CREAR COMPOSICIÓN MULTI-ESTACIONAL
// ----------------------------------------------------------------------------

print('Procesando imágenes Sentinel-2...');

// Procesar cada estación
var sentinel2_invierno = procesarSentinel2Estacion(estaciones.invierno);
var sentinel2_primavera = procesarSentinel2Estacion(estaciones.primavera);
var sentinel2_verano = procesarSentinel2Estacion(estaciones.verano);
var sentinel2_otono = procesarSentinel2Estacion(estaciones.otono);

// Concatenar todas las estaciones en una sola imagen multibanda
// Esto crea un stack con 44 bandas: 11 bandas × 4 estaciones
var imagenMultiestacional = ee.Image.cat([
  sentinel2_invierno,
  sentinel2_primavera,
  sentinel2_verano,
  sentinel2_otono
]).clip(geometry);

print('Imagen multi-estacional:', imagenMultiestacional);
print('Número de bandas:', imagenMultiestacional.bandNames().size());

// ----------------------------------------------------------------------------
// 5. DEFINIR BANDAS PARA CLASIFICACIÓN
// ----------------------------------------------------------------------------

/**
 * Lista de todas las bandas a usar en la clasificación
 * Incluye todas las bandas espectrales y NDVI de las 4 estaciones
 * Las bandas sin sufijo son del invierno
 * _1 = primavera, _2 = verano, _3 = otoño
 */
var bandasClasificacion = [
  // Invierno
  'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'B11', 'B12', 'ndvi',
  // Primavera
  'B2_1', 'B3_1', 'B4_1', 'B5_1', 'B6_1', 'B7_1', 'B8_1', 'B8A_1', 'B11_1', 'B12_1', 'ndvi_1',
  // Verano
  'B2_2', 'B3_2', 'B4_2', 'B5_2', 'B6_2', 'B7_2', 'B8_2', 'B8A_2', 'B11_2', 'B12_2', 'ndvi_2',
  // Otoño
  'B2_3', 'B3_3', 'B4_3', 'B5_3', 'B6_3', 'B7_3', 'B8_3', 'B8A_3', 'B11_3', 'B12_3', 'ndvi_3'
];

// ALTERNATIVA: Solo usar NDVI de cada estación (clasificación más simple)
// var bandasClasificacion = ['ndvi', 'ndvi_1', 'ndvi_2', 'ndvi_3'];

// ----------------------------------------------------------------------------
// 6. EXTRACCIÓN DE MUESTRAS DE ENTRENAMIENTO
// ----------------------------------------------------------------------------

/**
 * Extraer valores de píxeles en las ubicaciones de entrenamiento
 * Esto crea una tabla con los valores de todas las bandas
 * para cada punto/polígono de entrenamiento
 */
var muestrasEntrenamiento = imagenMultiestacional.select(bandasClasificacion)
  .sampleRegions({
    collection: newfc,
    properties: ['class'],  // Mantener la propiedad de clase
    scale: 10,              // Resolución de Sentinel-2
    tileScale: 4            // Reducir errores de memoria
  });

print('Total de muestras extraídas:', muestrasEntrenamiento.size());

// ----------------------------------------------------------------------------
// 7. DIVISIÓN ENTRENAMIENTO/VALIDACIÓN
// ----------------------------------------------------------------------------

/**
 * Dividir las muestras en dos conjuntos:
 * - Entrenamiento (70%): Para entrenar el modelo
 * - Validación (30%): Para evaluar la precisión
 */

// Añadir columna aleatoria para división
var muestrasConRandom = muestrasEntrenamiento.randomColumn('random');

// Dividir según el ratio definido
var muestrasEntrenar = muestrasConRandom.filter(ee.Filter.lt('random', splitRatio));
var muestrasValidar = muestrasConRandom.filter(ee.Filter.gte('random', splitRatio));

print('Muestras para entrenar:', muestrasEntrenar.size());
print('Muestras para validar:', muestrasValidar.size());

// ----------------------------------------------------------------------------
// 8. ENTRENAMIENTO DEL CLASIFICADOR
// ----------------------------------------------------------------------------

/**
 * Algoritmo CART (Classification and Regression Trees)
 * Ventajas:
 * - Rápido y eficiente
 * - No requiere normalización de datos
 * - Interpretable (árbol de decisión)
 * - Maneja bien datos multi-dimensionales
 */
var clasificador = ee.Classifier.smileCart().train({
  features: muestrasEntrenar,
  classProperty: 'class',
  inputProperties: bandasClasificacion
});

print('Clasificador entrenado:', clasificador);

// ----------------------------------------------------------------------------
// 9. APLICAR CLASIFICACIÓN
// ----------------------------------------------------------------------------

// Clasificar toda la imagen
var imagenClasificada = imagenMultiestacional.select(bandasClasificacion)
  .classify(clasificador);

print('Imagen clasificada:', imagenClasificada);

// ----------------------------------------------------------------------------
// 10. EVALUACIÓN DE PRECISIÓN
// ----------------------------------------------------------------------------

/**
 * Clasificar las muestras de validación y calcular métricas de precisión
 */
var muestrasValidadas = muestrasValidar.classify(clasificador);

// Matriz de confusión
var matrizConfusion = muestrasValidadas.errorMatrix('class', 'classification');

// Métricas de precisión
print('================== EVALUACIÓN DE PRECISIÓN ==================');
print('Matriz de Confusión:', matrizConfusion);
print('-------------------------------------------------------------');
print('Precisión Global (Overall Accuracy):', matrizConfusion.accuracy());
print('Precisión del Productor:', matrizConfusion.producersAccuracy());
print('Precisión del Usuario:', matrizConfusion.consumersAccuracy());
print('Índice Kappa:', matrizConfusion.kappa());
print('=============================================================');

// ----------------------------------------------------------------------------
// 11. VISUALIZACIÓN
// ----------------------------------------------------------------------------

// Centrar el mapa
Map.centerObject(geometry, 12);

// Paleta de colores para las clases
// 1: Arena (amarillo), 2: Agua (azul claro), 3: Invernaderos (azul oscuro)
// 4: Arrozal (verde lima), 5: Pinares (verde oscuro), 6: Eucaliptos (verde medio)
var paletaClases = {
  min: 1, 
  max: 6, 
  palette: [
    '#d6b21c',  // Arena/Suelo
    '#7edeff',  // Agua
    '#0406a8',  // Invernaderos
    '#4cff0a',  // Arrozal
    '#193417',  // Pinares
    '#7bc25a'   // Eucaliptos
  ]
};

// Añadir capas al mapa
Map.addLayer(
  imagenMultiestacional, 
  {min: 0, max: 3000, bands: ['B8_2', 'B4_2', 'B3_2']}, 
  'Sentinel-2 Verano (NIR-R-G)', 
  false
);

Map.addLayer(
  imagenClasificada, 
  paletaClases, 
  'Clasificación ' + year
);

// Añadir puntos de entrenamiento
Map.addLayer(
  newfc, 
  {color: 'yellow'}, 
  'Puntos de Entrenamiento', 
  false
);

Map.addLayer(
  geometry, 
  {color: 'red', opacity: 0.3}, 
  'Área de Estudio'
);

// ----------------------------------------------------------------------------
// 12. LEYENDA (OPCIONAL)
// ----------------------------------------------------------------------------

print('================= LEYENDA DE CLASES =================');
print('1: Arena / Suelo Desnudo (amarillo)');
print('2: Agua (azul claro)');
print('3: Invernaderos (azul oscuro)');
print('4: Arrozal (verde lima)');
print('5: Pinares (verde oscuro)');
print('6: Eucaliptos (verde medio)');
print('====================================================');

// ----------------------------------------------------------------------------
// 13. EXPORTACIÓN (OPCIONAL)
// ----------------------------------------------------------------------------

/**
 * Descomentar para exportar la imagen clasificada
 */
/*
Export.image.toDrive({
  image: imagenClasificada,
  description: 'Clasificacion_' + year,
  folder: 'GEE_Clasificacion',
  region: geometry,
  scale: 10,
  maxPixels: 1e13
});
*/


// NOTAS ADICIONALES:
// 
// MEJORAS POSIBLES:
// 1. Probar otros clasificadores: Random Forest (smileRandomForest), 
//    SVM (libsvm), Gradient Tree Boost (smileGradientTreeBoost)
// 2. Añadir más índices espectrales: EVI, NDWI, SAVI
// 3. Incluir datos de elevación (DEM) o pendientes
// 4. Validación cruzada (k-fold cross-validation)
// 5. Optimización de hiperparámetros
// 
// INTERPRETACIÓN DE MÉTRICAS:
// - Overall Accuracy: Porcentaje total de aciertos (ideal > 85%)
// - Producer's Accuracy: Por cada clase, % correctamente clasificados (omisión)
// - Consumer's Accuracy: Por cada clase, % que realmente pertenecen (comisión)
// - Kappa: Acuerdo más allá del azar (0-1, ideal > 0.8)

