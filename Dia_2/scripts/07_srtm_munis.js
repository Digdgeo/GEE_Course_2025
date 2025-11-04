// ========================================
// MODELO DIGITAL DE ELEVACIÓN (DEM)
// Script 7: SRTM y estadísticas zonales
// ========================================

// ========================================
// CARGAR DATASET SRTM
// ========================================
// SRTM: Shuttle Radar Topography Mission
// Resolución: 90 metros
var dataset = ee.Image('CGIAR/SRTM90_V4');

// Seleccionar la banda de elevación
var elevation = dataset.select('elevation');

// ========================================
// DERIVAR PRODUCTOS TOPOGRÁFICOS
// ========================================
// Earth Engine tiene funciones integradas para topografía

// 1. PENDIENTE (Slope) - en grados
var slope = ee.Terrain.slope(elevation);

// 2. ASPECTO (Aspect) - orientación de la pendiente
var aspect = ee.Terrain.aspect(elevation);

// 3. Otras opciones disponibles:
// - hillshade: sombreado del relieve
// - products: todos los productos a la vez

// ========================================
// CREAR IMAGEN MULTI-BANDA
// ========================================
// Combinar las tres capas en una sola imagen
var full = ee.Image.cat([elevation, slope, aspect]);

print('Imagen topográfica completa:', full);

// ========================================
// VISUALIZACIÓN
// ========================================
Map.setCenter(-5.8598, 36.8841, 10);

// Visualizar elevación
Map.addLayer(elevation, 
  {min: 0, max: 3000, palette: ['green', 'yellow', 'orange', 'brown', 'white']}, 
  'Elevación (m)', 
  false
);

// Visualizar pendiente
Map.addLayer(slope, 
  {min: 0, max: 45, palette: ['white', 'red']}, 
  'Pendiente (°)', 
  false
);

// Visualizar aspecto
Map.addLayer(aspect, 
  {min: 0, max: 360, palette: ['yellow', 'red', 'green', 'purple']}, 
  'Aspecto (°)', 
  false
);

// Visualizar desde la imagen multi-banda
Map.addLayer(full, 
  {min: 0, max: 40, bands: ['slope'], palette: ['white', 'red']}, 
  'Pendiente (desde full)'
);

// ========================================
// ESTADÍSTICAS ZONALES - REGIÓN DIBUJADA
// ========================================
// EJERCICIO: Dibuja un ROI (región de interés) usando la herramienta de geometría

// Calcular estadísticas sobre el ROI
var roiStats = full.reduceRegion({
  reducer: ee.Reducer.max(),              // Máximo
  geometry: roi,                          // Tu geometría dibujada
  scale: 90,                              // Resolución en metros
  maxPixels: 1e9                          // Límite de píxeles a procesar
});

print('Estadísticas del ROI:', roiStats);

// ========================================
// ESTADÍSTICAS ZONALES - UN MUNICIPIO
// ========================================
// var andalucia desde un recurso compartido de un asset público);
var andalucia = ee.FeatureCollection('users/digdgeografo/curso_GEE/Andalucia')

// Filtrar un municipio específico
var Almonte = andalucia.filter("nombre == 'Almonte'");
Map.addLayer(Almonte, {color: 'green'}, 'Almonte');

// Calcular estadísticas para Almonte
var AlmonteStats = full.select(['elevation', 'slope']).reduceRegion({
  reducer: ee.Reducer.median(),           // Mediana
  geometry: Almonte,
  scale: 90,
  maxPixels: 1e9
});

print('Estadísticas de Almonte:', AlmonteStats);

// ========================================
// ESTADÍSTICAS ZONALES - MÚLTIPLES MUNICIPIOS
// ========================================
// Filtrar varios municipios
var filtro = ee.Filter.inList('nombre', ['Almonte', 'Monachil', 'Cazorla']);
var munis = andalucia.filter(filtro);
Map.addLayer(munis, {color: 'purple'}, 'Municipios seleccionados');

// Calcular estadísticas para cada municipio
var selStats = full.reduceRegions({
  collection: munis.select(['nombre']),   // Mantener solo el nombre
  reducer: ee.Reducer.mean(),             // Media de cada municipio
  scale: 30
});

print('Estadísticas de municipios:', selStats);

// ========================================
// VISUALIZAR BORDES DE MUNICIPIOS
// ========================================
// Método 1: Pintar bordes
var empty = ee.Image().byte();
var outline = empty.paint({
  featureCollection: andalucia,
  width: 2
});
Map.addLayer(outline, {palette: 'black'}, 'Bordes (paint)', false);

// Método 2: Usar draw
Map.addLayer(
  andalucia.draw({color: '006600', strokeWidth: 5}), 
  {}, 
  'Bordes (draw)', 
  false
);

// ========================================
// EXPORTAR RESULTADOS
// ========================================
// Exportar la tabla de estadísticas a Google Drive
Export.table.toDrive({
  collection: selStats,
  description: 'Estadisticas_Topografia_Municipios',
  folder: 'GEE_Curso_2025',
  fileFormat: 'CSV'
});

// Para ejecutar la exportación, ve a la pestaña "Tasks" y haz clic en "Run"

// ========================================
// REDUCTORES DISPONIBLES
// ========================================
/*
REDUCTORES COMUNES:
- ee.Reducer.mean(): Media
- ee.Reducer.median(): Mediana
- ee.Reducer.min(): Mínimo
- ee.Reducer.max(): Máximo
- ee.Reducer.stdDev(): Desviación estándar
- ee.Reducer.count(): Conteo de píxeles
- ee.Reducer.sum(): Suma
- ee.Reducer.percentile([25, 50, 75]): Percentiles

COMBINAR REDUCTORES:
var combinado = ee.Reducer.mean().combine({
  reducer2: ee.Reducer.minMax(),
  sharedInputs: true
});
*/

// ========================================
// DIFERENCIAS: reduceRegion vs reduceRegions
// ========================================
/*
reduceRegion():
- Aplica un reducer a UNA geometría
- Devuelve un diccionario con los resultados

reduceRegions():
- Aplica un reducer a CADA feature de una colección
- Devuelve una FeatureCollection con los resultados
- Cada feature mantiene sus propiedades originales + resultados
*/

// ========================================
// EJERCICIO
// ========================================
/*
1. Calcula la elevación mínima, máxima y media de tu provincia
2. Encuentra el municipio con la mayor pendiente media
3. Crea un mapa de hillshade usando ee.Terrain.hillshade()
4. Exporta las estadísticas de todos los municipios de Andalucía
*/

// ========================================
// CONSEJOS
// ========================================
/*
- Ajusta el parámetro 'scale' según la resolución que necesites
- Para áreas grandes, aumenta 'maxPixels'
- Usa .combine() para calcular múltiples estadísticas a la vez
- Los reductores son muy potentes y eficientes en GEE
*/
