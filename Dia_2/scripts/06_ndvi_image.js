// ========================================
// CÁLCULO DE ÍNDICES ESPECTRALES
// Script 6: NDVI, MNDWI, SAVI con Landsat 8
// ========================================

// ========================================
// CARGAR UNA IMAGEN LANDSAT 8
// ========================================
// Landsat 8 Collection 2 Tier 1 Level 2 (Surface Reflectance)
var image = ee.Image("LANDSAT/LC08/C02/T1_L2/LC08_202034_20240722");

// Centrar el mapa en la imagen
Map.centerObject(image, 8);

// ========================================
// CONVERSIÓN A REFLECTANCIA
// ========================================
// Los valores de Landsat vienen en "Digital Numbers"
// Necesitamos convertirlos a reflectancia de superficie

function applyReflectanceConversion(image) {
  // Seleccionar bandas de interés
  var bands = ['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'];
  
  // Aplicar factores de escala de Landsat Collection 2
  // Fórmula: (DN × 0.0000275) - 0.2
  var reflectance = image.select(bands)
                         .multiply(0.0000275)
                         .add(-0.2);
  
  // Renombrar bandas con nombres descriptivos
  return reflectance.rename(['Blue', 'Green', 'Red', 'Nir', 'Swir', 'Mir']);
}

// Aplicar la conversión
var composite = applyReflectanceConversion(image);

// Visualizar la imagen en falso color (SWIR, NIR, Blue)
Map.addLayer(composite, 
  {bands: ['Swir', 'Nir', 'Blue'], min: 0, max: 0.3}, 
  'Falso Color (Landsat 8)'
);

// ========================================
// MÉTODO 1: CÁLCULO MANUAL DE NDVI
// ========================================
// NDVI = (NIR - Red) / (NIR + Red)
var b5 = composite.select("Nir");
var b4 = composite.select("Red");
var ndvi_1 = b5.subtract(b4).divide(b5.add(b4));

// ========================================
// MÉTODO 2: FUNCIÓN NORMALIZADA
// ========================================
// Earth Engine tiene una función built-in para índices normalizados
var ndvi_2 = composite.normalizedDifference(["Nir", "Red"]);

// ========================================
// MÉTODO 3: USANDO EXPRESIONES
// ========================================
// Las expresiones son útiles para fórmulas complejas
var ndvi_3 = composite.expression(
  "(b5 - b4) / (b5 + b4)", 
  {
    b5: composite.select("Nir"),
    b4: composite.select("Red")
  }
);

// Los tres métodos producen el mismo resultado
print("NDVI Método 1:", ndvi_1);
print("NDVI Método 2:", ndvi_2);
print("NDVI Método 3:", ndvi_3);

// ========================================
// CLASIFICACIÓN DE NDVI POR UMBRALES
// ========================================
// Crear categorías basadas en valores de NDVI
var ndvi_classes = ndvi_1.updateMask(ndvi_1.mask())
  .where(ndvi_1.lt(0.2), 1)                    // Vegetación escasa
  .where(ndvi_1.gte(0.2).and(ndvi_1.lt(0.5)), 2) // Vegetación moderada
  .where(ndvi_1.gte(0.5), 3);                  // Vegetación densa

// Visualizar clasificación
Map.addLayer(ndvi_classes, 
  {min: 1, max: 3, palette: ['yellow', 'orange', 'green']}, 
  'Clasificación NDVI'
);

// ========================================
// MNDWI: ÍNDICE DE AGUA
// ========================================
// Modified Normalized Difference Water Index
// MNDWI = (Green - SWIR) / (Green + SWIR)
var mndwi = composite.normalizedDifference(['Green', 'Swir'])
                     .rename(['mndwi']); 

// Aplicar máscara para mostrar solo agua (MNDWI >= 0)
var mndwi_masked = mndwi.updateMask(mndwi.gte(0));

// ========================================
// SAVI: ÍNDICE AJUSTADO AL SUELO
// ========================================
// Soil-Adjusted Vegetation Index
// Útil en áreas con vegetación dispersa
// SAVI = 1.5 × ((NIR - Red) / (NIR + Red + 0.5))
var savi = composite.expression(
  '1.5 * ((NIR - RED) / (NIR + RED + 0.5))', 
  {
    'NIR': composite.select('Nir'),
    'RED': composite.select('Red')
  }
).rename('savi');

// ========================================
// VISUALIZACIÓN DE ÍNDICES
// ========================================
// Paletas de color
var ndviVis = {
  min: 0, 
  max: 1, 
  palette: ['#a8d5e2', '#f9a620', '#ffd449', '#548c2f', '#104911']
};

var ndwiVis = {
  min: 0, 
  max: 1, 
  palette: ['white', 'blue']
};

// Añadir capas al mapa
Map.addLayer(mndwi, ndwiVis, 'MNDWI', false);
Map.addLayer(mndwi_masked, ndwiVis, 'MNDWI (solo agua)');
Map.addLayer(savi, ndviVis, 'SAVI');
Map.addLayer(ndvi_1, ndviVis, 'NDVI'); 

// ========================================
// ESTADÍSTICAS DEL NDVI
// ========================================
// Calcular estadísticas sobre un área de interés
// (Descomenta si tienes un ROI dibujado)
/*
var stats = ndvi_1.reduceRegion({
  reducer: ee.Reducer.mean().combine({
    reducer2: ee.Reducer.minMax(),
    sharedInputs: true
  }),
  geometry: roi,
  scale: 30,
  maxPixels: 1e9
});
print('Estadísticas NDVI:', stats);
*/

// ========================================
// RESUMEN DE ÍNDICES
// ========================================
/*
NDVI (Normalized Difference Vegetation Index):
- Rango: -1 a 1
- Agua: < 0
- Suelo desnudo: 0 - 0.2
- Vegetación dispersa: 0.2 - 0.5
- Vegetación densa: > 0.5

MNDWI (Modified Normalized Difference Water Index):
- Rango: -1 a 1
- Agua: > 0
- Útil para detectar cuerpos de agua

SAVI (Soil-Adjusted Vegetation Index):
- Similar a NDVI pero ajustado para suelo
- Útil en áreas con poca vegetación
- Reduce el efecto del brillo del suelo
*/

// ========================================
// EJERCICIO
// ========================================
/*
1. Prueba con una imagen diferente de Landsat
2. Calcula el índice EVI (Enhanced Vegetation Index)
3. Crea una máscara para mostrar solo vegetación saludable (NDVI > 0.6)
4. Combina NDVI y MNDWI para separar vegetación de agua
*/
