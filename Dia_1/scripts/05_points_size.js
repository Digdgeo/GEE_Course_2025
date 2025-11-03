// ========================================
// ESTILIZAR PUNTOS CON TAMAÑO VARIABLE
// Script 5: Visualización proporcional
// ========================================

// ========================================
// CREAR COLECCIÓN DE PUNTOS
// ========================================
// Crear una colección de puntos con nombres y poblaciones
var puntos = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([-6.0074, 37.3824]), {nombre: 'Sevilla', poblacion: 688711}),
  ee.Feature(ee.Geometry.Point([-6.9447, 37.2614]), {nombre: 'Huelva', poblacion: 144258}),
  ee.Feature(ee.Geometry.Point([-5.9272, 37.3891]), {nombre: 'Dos Hermanas', poblacion: 136317}),
  ee.Feature(ee.Geometry.Point([-6.1378, 36.7213]), {nombre: 'Algeciras', poblacion: 123078}),
  ee.Feature(ee.Geometry.Point([-5.6654, 37.1828]), {nombre: 'Écija', poblacion: 40025})
]);

print('Colección de ciudades:', puntos);

// ========================================
// ESTILO BASADO EN POBLACIÓN
// ========================================
// Función para asignar tamaño de punto proporcional a la población
var asignarEstilo = function(feature) {
  var poblacion = ee.Number(feature.get('poblacion'));
  
  // Calcular tamaño del punto
  // Formula: población / divisor + tamaño base
  // Ajusta estos valores según necesites
  var pointSize = poblacion.divide(20000).add(3);
  
  // También podemos variar el color según la población
  var color = ee.Algorithms.If(
    poblacion.gt(500000), 'red',      // Ciudades grandes: rojo
    ee.Algorithms.If(
      poblacion.gt(100000), 'orange', // Ciudades medianas: naranja
      'blue'                          // Ciudades pequeñas: azul
    )
  );
  
  return feature.set({
    style: {
      color: color,
      pointSize: pointSize
    }
  });
};

// Aplicar el estilo a cada punto
var puntosEstilizados = puntos.map(asignarEstilo);

// ========================================
// VISUALIZAR EN EL MAPA
// ========================================
// Agregar la colección estilizada al mapa
Map.addLayer(
  puntosEstilizados.style({styleProperty: 'style'}), 
  {}, 
  'Ciudades (tamaño = población)'
);

// Centrar el mapa en la zona
Map.centerObject(puntos, 8);

// ========================================
// VARIANTE: ESCALA LOGARÍTMICA
// ========================================
// Para datos con gran rango de valores, una escala logarítmica funciona mejor
var asignarEstiloLog = function(feature) {
  var poblacion = ee.Number(feature.get('poblacion'));
  
  // Usar logaritmo para suavizar las diferencias
  var pointSize = poblacion.log().multiply(2).add(5);
  
  return feature.set({
    style: {
      color: 'purple',
      pointSize: pointSize
    }
  });
};

var puntosEstilizadosLog = puntos.map(asignarEstiloLog);

Map.addLayer(
  puntosEstilizadosLog.style({styleProperty: 'style'}), 
  {}, 
  'Ciudades (escala logarítmica)'
);

// ========================================
// AÑADIR ETIQUETAS
// ========================================
// Crear etiquetas con el nombre de cada ciudad
var etiquetas = puntos.map(function(feature) {
  var nombre = feature.get('nombre');
  var poblacion = feature.get('poblacion');
  
  return feature.set({
    label: ee.String(nombre).cat(' (')
      .cat(ee.Number(poblacion).format())
      .cat(')')
  });
});

// Imprimir para ver las etiquetas
print('Ciudades con etiquetas:', etiquetas);

// ========================================
// EJERCICIO
// ========================================
/*
PRUEBA TÚ MISMO:
1. Añade más ciudades a la colección
2. Experimenta con diferentes divisores en la fórmula del tamaño
3. Crea categorías de color basadas en rangos de población diferentes
4. Intenta hacer que el color también sea gradual (no solo categorías)
*/

// ========================================
// CONSEJOS
// ========================================
/*
- Para puntos muy grandes, divide por un número mayor (ej: 50000)
- Para puntos muy pequeños, divide por un número menor (ej: 10000)
- El .add() al final define el tamaño mínimo del punto
- La escala logarítmica es útil cuando hay mucha diferencia entre valores
*/
