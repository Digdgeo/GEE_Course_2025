// ========================================
// GEOMETRÍAS Y OPERACIONES ESPACIALES
// Script 4: Trabajo con geometrías en GEE
// ========================================

// ========================================
// PASO 1: CREAR PUNTOS DE REFERENCIA
// ========================================
// EJERCICIO: Crea los siguientes puntos usando la herramienta de geometría:
// 1. Un punto llamado "huelva" en las coordenadas aproximadas de Huelva
// 2. Un punto llamado "sevilla" en las coordenadas aproximadas de Sevilla  
// 3. Un polígono llamado "Marisma" que cubra la zona de marismas del Guadalquivir

// Puedes buscar las coordenadas en Google Maps o usar:
// Huelva: [-6.9447, 37.2614]
// Sevilla: [-5.9845, 37.3891]

// ========================================
// PASO 2: CREAR BUFFERS
// ========================================
// Un buffer crea un área de influencia alrededor de una geometría
var huelva_buffer = huelva.buffer(50000);      // 50 km de radio
var sevilla_buffer = sevilla.buffer(50000);    // 50 km de radio

// Visualizar los buffers
Map.addLayer(huelva_buffer, {color: 'red'}, 'Huelva Buffer');
Map.addLayer(sevilla_buffer, {color: 'blue'}, 'Sevilla Buffer');

// ========================================
// OPERACIONES ESPACIALES
// ========================================

// 1. INTERSECCIÓN (área común entre dos geometrías)
var intersection = huelva_buffer.intersection(sevilla_buffer);
Map.addLayer(intersection, {color: '00FF00'}, 'Intersección HS');

// 2. UNIÓN (combina dos geometrías en una)
var union = huelva_buffer.union(sevilla_buffer);
Map.addLayer(union, {color: 'FF00FF'}, 'Unión');

// 3. RECORTAR LA UNIÓN CON LA MARISMA
var clip_union = union.intersection(Marisma);
Map.addLayer(clip_union, {color: 'green'}, 'Unión recortada');

// 4. DIFERENCIA (área de A que no está en B)
var diff1 = huelva_buffer.difference(sevilla_buffer);
Map.addLayer(diff1, {color: 'FFFF00'}, 'Diferencia H-S');

// 5. DIFERENCIA SIMÉTRICA (áreas que están en A o B, pero no en ambas)
var symDiff = huelva_buffer.symmetricDifference(sevilla_buffer)
                           .symmetricDifference(Marisma);
Map.addLayer(symDiff, {color: '000000'}, 'Diferencia simétrica');

// ========================================
// PROPIEDADES GEOMÉTRICAS
// ========================================

// Calcular área (en metros cuadrados)
print('El área de la marisma es:', Marisma.area());

// Calcular centroide
print('El centroide se encuentra en:', Marisma.centroid());

// Visualizar el centroide
Map.addLayer(Marisma.centroid(), {color: 'red'}, 'Centroide');

// ========================================
// FEATURE: GEOMETRÍA + PROPIEDADES
// ========================================
// Un Feature es una geometría con propiedades asociadas (atributos)

// Crear un punto con propiedades
var singlePoint = ee.Feature(
  ee.Geometry.Point([-5.9845, 37.3891]),           // Geometría
  {name: 'Sevilla', population: 688711}            // Propiedades
);

print('Un solo Feature (Sevilla):', singlePoint);
Map.addLayer(singlePoint, {color: 'green'}, 'Punto con propiedades');

// ========================================
// FEATURE COLLECTION: CONJUNTO DE FEATURES
// ========================================
// Una FeatureCollection es una colección de Features (como una capa de puntos)

// Crear varios puntos con propiedades
var pointsCollection = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([-5.9845, 37.3891]), {name: 'Sevilla', population: 688711}),
  ee.Feature(ee.Geometry.Point([-6.9447, 37.2614]), {name: 'Huelva', population: 144258}),
  ee.Feature(ee.Geometry.Point([-6.0839, 37.3404]), {name: 'Mairena', population: 27493}),
  ee.Feature(ee.Geometry.Point([-6.3074, 37.2563]), {name: 'Villamanrique', population: 21076})
]);

print('FeatureCollection de puntos:', pointsCollection);

// ========================================
// ESTILIZAR FEATURES DINÁMICAMENTE
// ========================================

// Definir una función de estilo basada en el nombre
var estilo = function(feature) {
  var nombre = ee.String(feature.get('name'));
  
  // Asignar color según el nombre
  var color = ee.Algorithms.If(
    nombre.equals('Sevilla'), 'red',
    ee.Algorithms.If(
      nombre.equals('Huelva'), 'green',
      ee.Algorithms.If(
        nombre.equals('Mairena'), 'yellow',
        'blue'
      )
    )
  );
  
  return feature.set({style: {color: color, pointSize: 10}});
};

// Aplicar el estilo a cada punto
var puntosEstilizados = pointsCollection.map(estilo);

// Agregar la colección estilizada al mapa
Map.addLayer(puntosEstilizados.style({styleProperty: 'style'}), {}, 'Puntos Estilizados');

// Centrar el mapa en la colección
Map.centerObject(pointsCollection, 9);

// ========================================
// RESUMEN DE OPERACIONES ESPACIALES
// ========================================
/*
- buffer(): Crea área de influencia
- intersection(): Área común entre geometrías
- union(): Combina geometrías
- difference(): Resta geometrías
- symmetricDifference(): Áreas exclusivas de cada geometría
- area(): Calcula área en m²
- centroid(): Calcula punto central
- bounds(): Obtiene el rectángulo envolvente
*/
