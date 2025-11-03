// ========================================
// INTRODUCCIÓN A JAVASCRIPT EN GEE
// Script 1: Operadores básicos
// ========================================

// Imprimir en la consola
print('Hello, GEE world!');
console.log('Hello, GEE world!');

// Variables básicas
var gee = 'Hello, GEE world!';
print(gee);

// Comillas dentro de strings
print("'let's go'");

// Declaración de variables
var a = 10;
var b = 3;
var c = 5;
var x = 5;
var y = "5";
var isAdult = true;
var hasTicket = false;
var age = 18;

// ========================================
// OPERADORES ARITMÉTICOS
// ========================================
print("=== OPERADORES ARITMÉTICOS ===");
print("Suma:", a + b);              // 13
print("Resta:", a - b);             // 7
print("Multiplicación:", a * b);    // 30
print("División:", a / b);          // 3.3333
print("Módulo:", a % b);            // 1 (resto de la división)
print("Incremento:", ++a);          // 11 (incrementa y devuelve)
print("Decremento:", --b);          // 2 (decrementa y devuelve)

// ========================================
// OPERADORES DE ASIGNACIÓN
// ========================================
print("=== OPERADORES DE ASIGNACIÓN ===");
c += 3;  // Equivale a c = c + 3
print("+=:", c); // 8
c -= 2;  // Equivale a c = c - 2
print("-=:", c); // 6
c *= 2;  // Equivale a c = c * 2
print("*=:", c); // 12
c /= 3;  // Equivale a c = c / 3
print("/=:", c); // 4
c %= 3;  // Equivale a c = c % 3
print("%=:", c); // 1

// ========================================
// OPERADORES DE COMPARACIÓN
// ========================================
print("=== OPERADORES DE COMPARACIÓN ===");
print("== :", x == y);        // true (compara solo valor)
print("===:", x === y);       // false (compara valor y tipo)
print("!= :", x != y);        // false (compara solo valor)
print("!==:", x !== y);       // true (compara valor y tipo)
print(">  :", x > 3);         // true
print("<  :", x < 10);        // true
print(">= :", x >= 5);        // true
print("<= :", x <= 4);        // false

// ========================================
// OPERADORES LÓGICOS
// ========================================
print("=== OPERADORES LÓGICOS ===");
print("AND (&&):", isAdult && hasTicket); // false (ambos deben ser true)
print("OR (||):", isAdult || hasTicket);  // true (al menos uno debe ser true)
print("NOT (!):", !isAdult);              // false (invierte el valor)

// ========================================
// OPERADOR TERNARIO
// ========================================
print("=== OPERADOR TERNARIO ===");
// Sintaxis: condición ? valor_si_true : valor_si_false
var access = age >= 18 ? "Acceso permitido" : "Acceso denegado";
print("Acceso:", access); // "Acceso permitido"

// Otro ejemplo
var mensaje = (a > 5) ? "Mayor que 5" : "Menor o igual a 5";
print("Mensaje:", mensaje);
