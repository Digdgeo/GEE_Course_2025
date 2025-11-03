// ========================================
// DICCIONARIOS (OBJETOS) EN JAVASCRIPT
// Script 2: Trabajo con diccionarios
// ========================================

// ========================================
// CREAR UN DICCIONARIO
// ========================================
// Un diccionario almacena pares clave-valor
var persona = {
  nombre: "Juan",
  edad: 30,
  ciudad: "Madrid",
  profesion: "Ingeniero"
};

print("Diccionario completo:", persona);

// ========================================
// ACCEDER A VALORES
// ========================================
// Hay dos formas de acceder a los valores:

// Forma 1: Notación de punto
print("Nombre:", persona.nombre); // Juan

// Forma 2: Notación de corchetes
print("Edad:", persona["edad"]); // 30

// La notación de corchetes es útil cuando la clave es una variable
var clave = "ciudad";
print("Ciudad:", persona[clave]); // Madrid

// ========================================
// AÑADIR NUEVAS PROPIEDADES
// ========================================
persona.pais = "España";
print("País añadido:", persona.pais); // España

persona["hobby"] = "Fotografía";
print("Hobby añadido:", persona.hobby); // Fotografía

// ========================================
// MODIFICAR PROPIEDADES EXISTENTES
// ========================================
persona.edad = 31;
print("Nueva edad:", persona.edad); // 31

persona["ciudad"] = "Barcelona";
print("Nueva ciudad:", persona.ciudad); // Barcelona

// ========================================
// ELIMINAR PROPIEDADES
// ========================================
delete persona.ciudad;
print("Después de eliminar ciudad:", persona);

// ========================================
// DICCIONARIOS ANIDADOS
// ========================================
var empleado = {
  nombre: "Ana",
  edad: 28,
  direccion: {
    calle: "Gran Vía",
    numero: 100,
    ciudad: "Madrid"
  },
  habilidades: ["JavaScript", "Python", "GEE"]
};

print("Empleado completo:", empleado);
print("Calle:", empleado.direccion.calle);
print("Primera habilidad:", empleado.habilidades[0]);

// ========================================
// DICCIONARIOS EN EARTH ENGINE
// ========================================
// Earth Engine tiene su propio tipo de diccionario: ee.Dictionary
var eeDict = ee.Dictionary({
  sensor: "Landsat 8",
  resolucion: 30,
  bandas: 11
});

print("Diccionario EE:", eeDict);
print("Sensor:", eeDict.get("sensor"));

// Obtener todas las claves
print("Claves:", eeDict.keys());

// Obtener todos los valores
print("Valores:", eeDict.values());
