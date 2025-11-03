# Día 1 - Introducción a Google Earth Engine

## 🎯 Objetivos del Día
- Familiarizarse con el entorno de Google Earth Engine
- Dominar los fundamentos de JavaScript para GEE
- Entender la arquitectura Client-Server de Earth Engine
- Trabajar con geometrías y operaciones espaciales básicas

## 📝 Contenidos Cubiertos en Clase

### 0. Primer Contacto con Google Earth Engine Explorer

🌍 Antes de programar, exploramos:

- **Google Earth Engine Explorer:** Interfaz visual para explorar datos sin código
- Navegar por el catálogo de imágenes
- Visualizar diferentes datasets
- Time-lapse y animaciones
- Comparar imágenes de diferentes fechas

💡 Comenzamos el curso con Earth Engine Explorer para familiarizarnos con los datos disponibles antes de programar.


### 1. Introducción al Ecosistema GEE
- ¿Qué es Google Earth Engine?
- Catálogo de datos disponibles
- Capacidades y casos de uso
- Configuración de la cuenta (ver CONFIGURACION.md)

### 2. Earth Engine Code Editor
- Interfaz del editor: paneles y componentes
- Panel de scripts y assets
- Consola para debugging
- Inspector para explorar valores
- Panel de mapas interactivo
- Herramientas de geometría

### 3. Fundamentos de JavaScript
- Variables y tipos de datos
- Operadores (aritméticos, lógicos, comparación)
- Estructuras de datos (objetos/diccionarios, listas)
- Funciones y callbacks
- Sintaxis básica de JavaScript

---

## 📚 Scripts Trabajados en Clase

Los siguientes scripts fueron cubiertos durante el Día 1:

---

### 🌍 Actividad Inicial: Earth Engine Explorer

**Herramienta:** [Earth Engine Explorer](https://explorer.earthengine.google.com)

Comenzamos el día explorando Earth Engine de forma visual, sin código.

**Exploramos:**
- **Interfaz del Explorer:** Panel de capas, línea de tiempo, herramientas de visualización
- **Catálogo de datos:** Navegar por las colecciones disponibles (Landsat, Sentinel, MODIS, etc.)
- **Visualización de imágenes:** Cargar y visualizar diferentes datasets
- **Time-lapse:** Crear animaciones temporales de forma interactiva
- **Comparación temporal:** Ver cambios entre diferentes fechas
- **Herramientas de análisis:** Medir distancias, áreas, exportar imágenes
- **Ejemplos predefinidos:** Explorar casos de uso ya preparados

---

### Script 1: Operadores Básicos de JavaScript
**Archivo:** `01_intro_js_operadores.js`

**Aprendimos:**
- Cómo imprimir en la consola (`print()` vs `console.log()`)
- Declaración de variables con `var`
- Operadores aritméticos: suma, resta, multiplicación, división, módulo
- Operadores de asignación: `+=`, `-=`, `*=`, `/=`, `%=`
- Operadores de comparación: `==`, `===`, `!=`, `!==`, `>`, `<`, `>=`, `<=`
- Operadores lógicos: `&&` (AND), `||` (OR), `!` (NOT)
- Operador ternario para condicionales simples

---

### Script 2: Diccionarios (Objetos)
**Archivo:** `02_dict.js`

**Aprendimos:**
- Crear diccionarios (objetos JavaScript)
- Acceder a valores con notación de punto y corchetes
- Añadir nuevas propiedades
- Modificar propiedades existentes
- Eliminar propiedades con `delete`
- Trabajar con diccionarios anidados
- Diferencia entre objetos JavaScript y `ee.Dictionary`

---

### Script 3: Client Side vs Server Side ⚠️
**Archivo:** `03_intro_js_client_server.js`  
**⚠️ MUY IMPORTANTE**

**Aprendimos:**
- La arquitectura fundamental de Earth Engine
- Diferencia entre código client-side (navegador) y server-side (servidores de Google)
- Objetos nativos de JavaScript vs objetos `ee.*`
- Por qué NO usar loops tradicionales con datos grandes
- Cómo usar `.map()` en lugar de for loops
- Uso de `ee.Algorithms.If` para condicionales en el servidor
- Cuándo (no) usar `.getInfo()`
- Buenas prácticas para código eficiente en GEE

---

### Script 4: Geometrías y Operaciones Espaciales
**Archivo:** `04_geometrias.js`

**Aprendimos:**
- Crear puntos manualmente con la herramienta de geometría
- Crear buffers alrededor de geometrías
- Operaciones espaciales básicas:
  - Intersección (área común)
  - Unión (combinar geometrías)
  - Diferencia (restar áreas)
  - Diferencia simétrica
- Propiedades geométricas: área, centroide
- Diferencia entre Geometry, Feature y FeatureCollection
- Añadir propiedades a Features
- Estilizar Features dinámicamente

**Ejercicio en clase:** Creamos puntos para Huelva, Sevilla y un polígono para la Marisma.

---

### Script 5: Puntos con Tamaño Variable
**Archivo:** `05_points_size.js`

**Aprendimos:**
- Crear colecciones de puntos con propiedades
- Estilizar puntos proporcionalmente a sus atributos
- Usar funciones para mapear estilos dinámicos
- Diferencia entre escala lineal y logarítmica
- Visualización de datos cuantitativos con símbolos proporcionales
- Añadir etiquetas a Features

---

## 📋 Contenidos Pendientes para Próximas Sesiones

Los siguientes scripts no se cubrieron en el Día 1 y se trabajarán en sesiones posteriores:

- **Script 6:** Cálculo de Índices Espectrales (`06_ndvi_image.js`)
- **Script 7:** Modelo Digital de Elevación (`07_srtm_munis.js`)
- **Script 8:** Combinando DEM y Datos Espectrales (`08_srtm_ndvi_mask.js`)
- **Script 9:** Estadísticas Zonales Avanzadas (`09_zonal_stats_dem_ndvi.js`)

---

## 🔗 Recursos del Día

### Documentación Oficial
- [Guía de JavaScript en GEE](https://developers.google.com/earth-engine/guides/getstarted)
- [Objetos y Métodos de Earth Engine](https://developers.google.com/earth-engine/guides/objects_methods_overview)
- [Guía de Geometrías](https://developers.google.com/earth-engine/guides/geometries)

### Herramientas
- [Earth Engine Explorer](https://explorer.earthengine.google.com) ⭐ (empezamos aquí)
- [Earth Engine Code Editor](https://code.earthengine.google.com)

---

## 📌 Notas y Recordatorios

### Conceptos Clave del Día
- **Client vs Server:** El concepto más importante de GEE
- **Evitar getInfo():** No uses `.getInfo()` en loops o con datos grandes
- **Usar .map():** En lugar de loops for, usa `.map()` sobre colecciones
- **ee.Algorithms.If:** Para condicionales sobre datos del servidor
- **Geometrías:** Diferencia entre Geometry, Feature y FeatureCollection

---

## ⚠️ Errores Comunes Detectados en Clase

### 🔴 Problemas de Configuración de Cuenta (¡MUY IMPORTANTE!)

**❌ Error #1: Usar diferentes cuentas de Google**

**Problema:** Crear el proyecto de Google Cloud con una cuenta de email y luego entrar al Code Editor con otra cuenta distinta.

**Solución:** Asegúrate de usar **LA MISMA cuenta de Google** tanto para:
- Crear y gestionar el proyecto en Google Cloud Platform
- Acceder al Earth Engine Code Editor

**Cómo verificarlo:**
- Revisa qué cuenta estás usando en la esquina superior derecha del navegador
- En Google Cloud Console: verifica el proyecto activo
- En Code Editor: verifica que el proyecto mostrado sea el correcto

---

**❌ Error #2: No habilitar Earth Engine en el proyecto**

**Problema:** Crear un proyecto de Google Cloud pero olvidar habilitar la API de Earth Engine para ese proyecto.

**Solución:**
1. Ve a Google Cloud Console
2. Selecciona tu proyecto
3. Ve a "APIs y servicios" → "Biblioteca"
4. Busca "Earth Engine API"
5. Haz clic en "Habilitar"

**Síntoma:** Errores de autorización o proyecto no encontrado al intentar usar el Code Editor.

---

### 🟡 Otros Errores Comunes

- ❌ Mezclar objetos client y server sin conversión
- ❌ Usar if/else con valores de objetos ee.*
- ❌ No entender la diferencia entre objetos JavaScript nativos y objetos ee.*
- ❌ Olvidar que las geometrías dibujadas son variables globales
- ❌ No usar print() para debuggear y entender la estructura de datos

### ✅ Buenas Prácticas

- Verifica que estás usando la misma cuenta de Google en todo momento
- Confirma que Earth Engine API está habilitada en tu proyecto
- Usa nombres de variables descriptivos
- Comenta tu código
- Estructura tu código con secciones claras
- Usa print() para debuggear y entender la estructura de datos
- Guarda tus scripts frecuentemente

## ✅ Ejercicios para Practicar en Casa
Basados en lo que vimos en clase:

### Nivel Básico
1. Crea variables con diferentes tipos de datos (números, strings, booleanos) y practica operadores
2. Crea un diccionario con información de tu ciudad (nombre, población, coordenadas)
3. Dibuja 3 puntos en el mapa y crea un buffer de 5km alrededor de cada uno

### Nivel Intermedio
4. Crea una función que tome dos números y devuelva su suma (primero en JavaScript nativo, luego con objetos ee.Number)
5. Crea una colección de Features con 5 ciudades, incluyendo sus nombres y poblaciones como propiedades
6. Estiliza los puntos de las ciudades proporcionalmente a su población

### Nivel Avanzado
7. Crea un polígono manualmente, divídelo en dos mitades usando operaciones geométricas
8. Experimenta con diferentes operaciones espaciales (intersection, union, difference) entre geometrías
9. Crea una función que genere buffers de tamaño variable según una propiedad numérica

## 🎓 Conceptos para Repasar en Casa

1. ¿Cuál es la diferencia entre `==` y `===` en JavaScript?
2. ¿Qué significa "client-side" vs "server-side" en Earth Engine?
3. ¿Por qué no debemos usar loops `for` tradicionales con colecciones `ee.*`?
4. ¿Cuál es la diferencia entre un objeto JavaScript `{}` y un `ee.Dictionary`?
5. ¿Qué es un Feature y en qué se diferencia de una Geometry?

## 📚 Para Profundizar

### Lecturas Recomendadas
- [Client vs Server: The Key Concept](https://developers.google.com/earth-engine/guides/client_server)
- [Feature Collections](https://developers.google.com/earth-engine/guides/feature_collections)

### Videos Tutoriales
- [GEE Playlist oficial de Google](https://www.youtube.com/playlist?list=PLivRXhCUgrZpCR3iSByLYdd_VwFv-3mfs)

### Comunidad
- [GEE Developers Forum](https://groups.google.com/g/google-earth-engine-developers)
- [GEE en Stack Exchange](https://gis.stackexchange.com/questions/tagged/google-earth-engine)

---

## 🎯 Preparación para el Día 2

Para la próxima sesión trabajaremos con:
- Cálculo de índices espectrales (NDVI, MNDWI, SAVI)
- Trabajo con colecciones de imágenes
- Modelos digitales de elevación
- Estadísticas zonales

**Asegúrate de:**
- ✅ Tener tu proyecto de Google Cloud correctamente configurado
- ✅ Verificar que puedes acceder al Code Editor sin problemas
- ✅ Repasar los conceptos de client vs server
- ✅ Practicar con geometrías y Features

---

## 🎉 ¡Buen trabajo en tu primer día con Google Earth Engine!

Recuerda: los scripts completos están disponibles en el repositorio del curso. Experimenta, juega con el código y no tengas miedo de cometer errores - ¡es la mejor forma de aprender!
