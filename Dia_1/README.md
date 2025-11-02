# Día 1 - Introducción a Google Earth Engine

## 🎯 Objetivos del Día

- Familiarizarse con el entorno de Google Earth Engine
- Dominar los fundamentos de JavaScript para GEE
- Entender la arquitectura Client-Server de Earth Engine
- Trabajar con geometrías y operaciones espaciales
- Calcular índices espectrales básicos
- Realizar estadísticas zonales

---

## 📝 Contenidos del Día

### 0. Primer Contacto con Google Earth Engine Explorer

**🌍 Antes de programar, exploraremos:**
- [Google Earth Engine Explorer](https://explorer.earthengine.google.com/#workspace)
- Interfaz visual para explorar datos sin código
- Navegar por el catálogo de imágenes
- Visualizar diferentes datasets
- Time-lapse y animaciones
- Comparar imágenes de diferentes fechas

> 💡 **Comenzaremos el curso con Earth Engine Explorer** para familiarizarnos con los datos disponibles antes de programar.

### 1. Introducción al Ecosistema GEE

- ¿Qué es Google Earth Engine?
- Catálogo de datos disponibles
- Capacidades y casos de uso
- Configuración de la cuenta (ver [CONFIGURACION.md](../CONFIGURACION.md))

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

## 📚 Secuencia de Aprendizaje

Los scripts están numerados para seguirse en orden. **Los scripts finales se subirán al final del día** para que practiques durante la clase.

---

### 🌍 Actividad Inicial: Earth Engine Explorer
**[Earth Engine Explorer](https://explorer.earthengine.google.com/#workspace)**

**Comenzaremos el día explorando Earth Engine de forma visual, sin código.**

Explorarás:
- **Interfaz del Explorer:** Panel de capas, línea de tiempo, herramientas de visualización
- **Catálogo de datos:** Navegar por las colecciones disponibles (Landsat, Sentinel, MODIS, etc.)
- **Visualización de imágenes:** Cargar y visualizar diferentes datasets
- **Time-lapse:** Crear animaciones temporales de forma interactiva
- **Comparación temporal:** Ver cambios entre diferentes fechas
- **Herramientas de análisis:** Medir distancias, áreas, exportar imágenes
- **Ejemplos predefinidos:** Explorar casos de uso ya preparados

**Objetivos:**
- Familiarizarte con los datos disponibles en GEE
- Ver ejemplos de lo que se puede hacer
- Entender los tipos de datos (óptico, radar, clima, terreno)
- Inspirarte para proyectos futuros

> 💡 **Consejo:** Guarda los enlaces de las capas que te interesen para usarlas luego en código.

---

### Script 1: Operadores Básicos de JavaScript
**`01_intro_js_operadores.js`**

Aprenderás:
- Cómo imprimir en la consola (`print()` vs `console.log()`)
- Declaración de variables con `var`
- Operadores aritméticos: suma, resta, multiplicación, división, módulo
- Operadores de asignación: `+=`, `-=`, `*=`, `/=`, `%=`
- Operadores de comparación: `==`, `===`, `!=`, `!==`, `>`, `<`, `>=`, `<=`
- Operadores lógicos: `&&` (AND), `||` (OR), `!` (NOT)
- Operador ternario para condicionales simples

---

### Script 2: Diccionarios (Objetos)
**`02_dict.js`**

Aprenderás:
- Crear diccionarios (objetos JavaScript)
- Acceder a valores con notación de punto y corchetes
- Añadir nuevas propiedades
- Modificar propiedades existentes
- Eliminar propiedades con `delete`
- Trabajar con diccionarios anidados
- Diferencia entre objetos JavaScript y `ee.Dictionary`

---

### Script 3: Client Side vs Server Side
**`03_intro_js_client_server.js`** ⚠️ **MUY IMPORTANTE**

Aprenderás:
- La arquitectura fundamental de Earth Engine
- Diferencia entre código client-side (navegador) y server-side (servidores de Google)
- Objetos nativos de JavaScript vs objetos `ee.*`
- Por qué NO usar loops tradicionales con datos grandes
- Cómo usar `.map()` en lugar de `for` loops
- Uso de `ee.Algorithms.If` para condicionales en el servidor
- Cuándo (no) usar `.getInfo()`
- Buenas prácticas para código eficiente en GEE

---

### Script 4: Geometrías y Operaciones Espaciales
**`04_geometrias.js`**

Aprenderás:
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

**Ejercicio durante la clase:** Crearás puntos para Huelva, Sevilla y un polígono para la Marisma.

---

### Script 5: Puntos con Tamaño Variable
**`05_points_size.js`**

Aprenderás:
- Crear colecciones de puntos con propiedades
- Estilizar puntos proporcionalmente a sus atributos
- Usar funciones para mapear estilos dinámicos
- Diferencia entre escala lineal y logarítmica
- Visualización de datos cuantitativos con símbolos proporcionales
- Añadir etiquetas a Features

---

### Script 6: Cálculo de Índices Espectrales
**`06_ndvi_image.js`**

Aprenderás:
- Cargar una imagen Landsat 8 (Collection 2)
- Convertir Digital Numbers a reflectancia de superficie
- Calcular NDVI (Normalized Difference Vegetation Index):
  - Método manual con operaciones de bandas
  - Método con `normalizedDifference()`
  - Método con `expression()`
- Clasificar NDVI por umbrales
- Calcular otros índices:
  - MNDWI (agua)
  - SAVI (vegetación ajustada al suelo)
- Aplicar máscaras basadas en valores
- Paletas de color para visualización

---

### Script 7: Modelo Digital de Elevación (DEM)
**`07_srtm_munis.js`**

Aprenderás:
- Cargar el dataset SRTM (elevación global)
- Derivar productos topográficos:
  - Pendiente (slope)
  - Aspecto (aspect)
- Crear imágenes multi-banda con `ee.Image.cat()`
- Estadísticas zonales con `reduceRegion()`:
  - Sobre un ROI dibujado manualmente
  - Sobre un municipio específico
- Estadísticas zonales múltiples con `reduceRegions()`
- Diferentes reductores: mean, median, max, min, etc.
- Combinar reductores con `.combine()`
- Visualizar bordes de polígonos
- Exportar resultados a CSV

**Nota:** Necesitarás un FeatureCollection de municipios (se proporcionará como asset)

---

### Script 8: Combinando DEM y Datos Espectrales
**`08_srtm_ndvi_mask.js`**

Aprenderás:
- Filtrar colecciones Landsat por fecha, ubicación y path/row
- Analizar nubosidad en colecciones
- Crear composiciones temporales (máximo, media, mediana)
- Combinar datos topográficos y espectrales en una imagen
- Aplicar máscaras múltiples:
  - Basadas en elevación
  - Basadas en NDVI
  - Combinadas
- Operadores lógicos en imágenes: `and()`, `or()`, `not()`
- Operadores de comparación: `gt()`, `lt()`, `gte()`, `lte()`, `eq()`, `neq()`
- Crear clasificaciones basadas en múltiples criterios
- Análisis cruzado de variables

---

### Script 9: Estadísticas Zonales Avanzadas
**`09_zonal_stats_dem_ndvi.js`**

Aprenderás:
- Calcular valores máximos/mínimos temporales con `.max()`, `.min()`
- Crear zonas (categorías) usando `where()`
- Reductores agrupados con `.group()`:
  - Calcular estadísticas por categorías
  - Histogramas por zona
  - Áreas por categoría
- Análisis cruzado de variables (elevación × NDVI)
- Calcular áreas con `ee.Image.pixelArea()`
- Convertir imágenes clasificadas a vectores
- Estadísticas detalladas combinando múltiples reductores
- Exportar imágenes clasificadas
- Exportar tablas de estadísticas

---

## 🔗 Recursos del Día

### Documentación Oficial
- [Guía de JavaScript en GEE](https://developers.google.com/earth-engine/guides/getstarted)
- [Objetos y Métodos de Earth Engine](https://developers.google.com/earth-engine/apidocs)
- [Guía de Geometrías](https://developers.google.com/earth-engine/guides/geometries)
- [Reducers (Estadísticas Zonales)](https://developers.google.com/earth-engine/guides/reducers_intro)

### Datasets Utilizados
- [Landsat 8 Collection 2 Surface Reflectance](https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_LC08_C02_T1_L2)
- [SRTM Digital Elevation Data](https://developers.google.com/earth-engine/datasets/catalog/CGIAR_SRTM90_V4)

### Herramientas
- **[Earth Engine Explorer](https://explorer.earthengine.google.com/#workspace)** ⭐ (empezaremos aquí)
- [Earth Engine Code Editor](https://code.earthengine.google.com/)

---

## 📌 Notas y Recordatorios

### Conceptos Clave del Día
- **Client vs Server:** El concepto más importante de GEE
- **Evitar getInfo():** No uses `.getInfo()` en loops o con datos grandes
- **Usar .map():** En lugar de loops `for`, usa `.map()` sobre colecciones
- **ee.Algorithms.If:** Para condicionales sobre datos del servidor
- **Scale:** El parámetro `scale` define la resolución de análisis

### Errores Comunes
- ❌ Mezclar objetos client y server sin conversión
- ❌ Usar `if/else` con valores de objetos `ee.*`
- ❌ Olvidar el parámetro `scale` en reductores
- ❌ No aplicar `.clip()` cuando sea necesario
- ❌ Intentar procesar datos muy grandes sin optimización

### Buenas Prácticas
- ✅ Usa nombres de variables descriptivos
- ✅ Comenta tu código
- ✅ Estructura tu código con secciones claras
- ✅ Prueba con áreas pequeñas antes de procesar regiones grandes
- ✅ Usa `print()` para debuggear y entender la estructura de datos

---

## ✅ Ejercicios para Practicar

### Nivel Básico
1. Crea un script que calcule el NDVI de tu ciudad usando una imagen Landsat reciente
2. Dibuja un buffer de 10 km alrededor de tu ubicación y calcula estadísticas de elevación
3. Crea una colección de 5 ciudades con sus poblaciones y estiliza por tamaño

### Nivel Intermedio
4. Encuentra la imagen Landsat con menos nubes de 2024 para tu región
5. Clasifica una imagen en 4 categorías de NDVI y calcula el área de cada categoría
6. Crea un mapa que muestre vegetación solo en zonas con pendiente < 15°

### Nivel Avanzado
7. Calcula el NDVI medio de tu región para cada mes del último año
8. Identifica áreas con NDVI > 0.6 y elevación > 1000m
9. Crea un análisis de NDVI por rangos altitudinales (cada 200m)

---

## 🎓 Conceptos para Repasar en Casa

- Diferencia entre `==` y `===` en JavaScript
- ¿Qué es un reducer y para qué sirve?
- ¿Cuándo usar `reduceRegion()` vs `reduceRegions()`?
- ¿Cómo funcionan las máscaras en Earth Engine?
- ¿Qué es la reflectancia y por qué la calculamos?

---

## 📚 Para Profundizar

### Lecturas Recomendadas
- [Client vs Server: The Key Concept](https://developers.google.com/earth-engine/guides/client_server)
- [Image Visualization Guide](https://developers.google.com/earth-engine/guides/image_visualization)
- [Reducer Overview](https://developers.google.com/earth-engine/guides/reducers_intro)

### Videos Tutoriales
- [GEE Playlist oficial de Google](https://www.youtube.com/playlist?list=PLivRXhCUgrZpCR3iSByLYdd_VwFv-3mfs)

### Comunidad
- [GEE Developers Forum](https://groups.google.com/g/google-earth-engine-developers)
- [GEE en Stack Exchange](https://gis.stackexchange.com/questions/tagged/google-earth-engine)

---

**🎉 ¡Buen trabajo en tu primer día con Google Earth Engine!**

Los scripts completos se subirán al final del día. Mientras tanto, usa este README como guía y experimenta creando tus propias versiones.
