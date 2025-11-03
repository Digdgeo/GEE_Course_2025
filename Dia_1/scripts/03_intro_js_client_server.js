// ========================================
// CLIENT SIDE vs SERVER SIDE EN GEE
// Script 3: Entender la arquitectura de Earth Engine
// ========================================

// ========================================
// DIFERENCIA FUNDAMENTAL
// ========================================
// JavaScript tiene dos "lados":
// 1. CLIENT SIDE: Se ejecuta en tu navegador (JavaScript nativo)
// 2. SERVER SIDE: Se ejecuta en los servidores de Google (objetos ee.*)

// ========================================
// STRINGS: CLIENT vs SERVER
// ========================================
var clientString = 'I am a String';
print("Tipo de clientString:", typeof clientString);  // string (JavaScript nativo)

var serverString = ee.String('I am not a String!');
print("Tipo de serverString:", typeof serverString);  // object (objeto de Earth Engine)
print("¿Es un objeto EE?:", serverString instanceof ee.ComputedObject);  // true

print("Contenido serverString:", serverString);  // I am not a String

// Para ver la representación del objeto:
print("toString:", serverString.toString());  // ee.String("I am not a String!")

// ========================================
// CONVERSIÓN SERVER -> CLIENT
// ========================================
// .getInfo() trae datos del servidor al cliente (¡CUIDADO: es lento!)
var someString = serverString.getInfo();
var strings = someString + '  Am I?';
print("Después de getInfo:", strings);  // I am not a String!  Am I?

// ========================================
// LOOPS: CLIENT SIDE
// ========================================
print("=== LOOPS CLIENT SIDE ===");

// Loop simple
var clientList = [];
for(var i = 0; i < 10; i++) {
  clientList.push(i + 1);
}
print("Lista client simple:", clientList);

// Loop con condicional
var clientList2 = [];
for (var i = 1; i <= 10; i++) {
  // Si es par, suma 10; si es impar, deja como está
  clientList2.push(i % 2 === 0 ? i + 10 : i);
}
print("Lista client condicional:", clientList2);

// ========================================
// LOOPS: SERVER SIDE
// ========================================
print("=== LOOPS SERVER SIDE ===");

// En el servidor NO usamos loops tradicionales
// Usamos .map() sobre listas ee.List
var serverList = ee.List.sequence(0, 9);
serverList = serverList.map(function(n) {
  return ee.Number(n).add(1);
});
print("Lista server simple:", serverList);

// Map con condicional en el servidor
var clientList3 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var updatedServerList = clientList3.map(function(n) {
  var number = ee.Number(n);
  // Si es par, suma 100; si es impar, divide entre 2
  return ee.Algorithms.If(
    number.mod(2).eq(0), 
    number.add(100), 
    number.divide(2)
  );
});
print("Lista server condicional:", updatedServerList);

// ========================================
// CONDICIONALES: CLIENT vs SERVER
// ========================================
print("=== CONDICIONALES ===");

var myList = ee.List([1, 2, 3]);
var serverBoolean = myList.contains(5);
print("¿Lista contiene 5?:", serverBoolean);  // false

// ❌ INCORRECTO: No podemos usar condicionales client con valores server
var clientConditional;
if (serverBoolean) {  // ¡ESTO NO FUNCIONA COMO ESPERAS!
  clientConditional = true;
} else {
  clientConditional = false;
}
print("Condicional client (INCORRECTO):", clientConditional);  // True! (¡ERROR!)

// ✅ CORRECTO: Usar ee.Algorithms.If para lógica en el servidor
var serverConditional = ee.Algorithms.If(serverBoolean, 'True!', 'False!');
print("Condicional server (CORRECTO):", serverConditional);  // False!

// ========================================
// FUNCIONES
// ========================================
print("=== FUNCIONES ===");

// Función tradicional de JavaScript
var suma = function(a1, a2, a3) {
  var resultado = a1 + a2 + a3;
  print("Suma:", resultado);
  return resultado;
};

var total = suma(10, 1, 3);
print("Total + 10:", total + 10);

// Función para mapear sobre colecciones (muy común en GEE)
var multiplicarPorDos = function(numero) {
  return ee.Number(numero).multiply(2);
};

var numeros = ee.List([1, 2, 3, 4, 5]);
var duplicados = numeros.map(multiplicarPorDos);
print("Números duplicados:", duplicados);

// ========================================
// REGLAS DE ORO
// ========================================
/*
1. Evita usar getInfo() en loops (es muy lento)
2. Usa objetos ee.* para trabajar con datos grandes
3. Usa .map() en lugar de loops for cuando trabajes con colecciones
4. Usa ee.Algorithms.If para condicionales sobre datos del servidor
5. No mezcles lógica client y server sin pensarlo bien
*/
