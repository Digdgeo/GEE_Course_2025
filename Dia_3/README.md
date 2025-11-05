# Día 3 - Colecciones de Imágenes en Google Earth Engine

## 🎯 Objetivos del Día
En este tercer día del curso avanzamos hacia el trabajo con colecciones de imágenes, uno de los conceptos más potentes de Google Earth Engine:

- Entender qué son las ImageCollections
- Aprender a filtrar colecciones por fecha, ubicación y propiedades
- Crear composiciones temporales (mosaicos, medianas, máximos)
- Reducir colecciones a imágenes únicas
- Trabajar con series temporales

## 📚 Introducción a las Colecciones de Imágenes

### ¿Qué es una ImageCollection?
Hasta ahora hemos trabajado con imágenes individuales (ee.Image). En la práctica real, necesitamos trabajar con múltiples imágenes de la misma área tomadas en diferentes momentos.

Una ImageCollection es:
- Un conjunto de imágenes del mismo sensor/producto
- Organizadas cronológicamente
- Con metadatos asociados (fecha, nubosidad, órbita, etc.)
- Que cubren una región de interés

```javascript
// Una imagen individual
var imagen = ee.Image("LANDSAT/LC08/C02/T1_L2/LC08_202034_20240722");

// Una colección de imágenes
var coleccion = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2");
```

### ¿Por Qué Usar Colecciones?
🔹 **Análisis temporal**: Ver cómo cambia un área a lo largo del tiempo  
🔹 **Reducción de nubes**: Combinar múltiples imágenes para eliminar nubes  
🔹 **Composiciones**: Crear mosaicos sin costuras de áreas grandes  
🔹 **Estadísticas temporales**: Calcular tendencias, estacionalidad, anomalías  
🔹 **Monitoreo**: Detectar cambios, deforestación, crecimiento urbano

### Diferencias Clave

| Concepto | ee.Image | ee.ImageCollection |
|----------|----------|-------------------|
| Definición | Una imagen única | Conjunto de imágenes |
| Dimensiones | 2D espacial + bandas | 3D (espacio + tiempo + bandas) |
| Ejemplo | Foto de un día | Archivo de fotos de un año |
| Uso típico | Análisis puntual | Análisis temporal |
| Visualización | Directa con Map.addLayer | Requiere reducción primero |

## 🔍 Conceptos Fundamentales

### 1. Catálogo de Datasets
Google Earth Engine tiene cientos de colecciones públicas:

**Datos Ópticos:**
- Landsat (1972-presente): `LANDSAT/LC08/C02/T1_L2`
- Sentinel-2 (2015-presente): `COPERNICUS/S2_SR_HARMONIZED`
- MODIS (2000-presente): `MODIS/006/MOD09A1`

**Datos Radar:**
- Sentinel-1 SAR: `COPERNICUS/S1_GRD`

**Datos Climáticos:**
- ERA5 (clima): `ECMWF/ERA5/DAILY`
- CHIRPS (precipitación): `UCSB-CHG/CHIRPS/DAILY`

**Otros:**
- Luminosidad nocturna: `NOAA/VIIRS/DNB/MONTHLY_V1/VCMSLCFG`
- Temperatura superficial: `MODIS/006/MOD11A1`

### 2. Filtrado de Colecciones
Las colecciones suelen contener miles o millones de imágenes. Necesitamos filtrar para obtener solo las que nos interesan:

#### a) Filtrado Espacial
```javascript
// Filtrar por geometría
var coleccion = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
  .filterBounds(roi);  // Solo imágenes que intersectan con roi

// Filtrar por punto
var coleccion = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
  .filterBounds(ee.Geometry.Point([-5.86, 36.88]));
```

#### b) Filtrado Temporal
```javascript
// Filtrar por rango de fechas
var coleccion = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
  .filterDate('2024-01-01', '2024-12-31');

// Filtrar por año específico
var coleccion = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
  .filter(ee.Filter.calendarRange(2024, 2024, 'year'));

// Filtrar por meses (ej: verano)
var coleccion = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
  .filter(ee.Filter.calendarRange(6, 8, 'month'));  // Junio-Agosto
```

#### c) Filtrado por Propiedades
```javascript
// Filtrar por nubosidad
var coleccion = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
  .filter(ee.Filter.lt('CLOUD_COVER', 20));  // Menos del 20% de nubes

// Filtrar por path/row de Landsat
var coleccion = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
  .filter(ee.Filter.eq('WRS_PATH', 202))
  .filter(ee.Filter.eq('WRS_ROW', 34));
```

#### d) Combinando Filtros
```javascript
// Filtrado completo
var coleccion = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
  .filterBounds(roi)                           // Área de interés
  .filterDate('2024-01-01', '2024-12-31')     // Año 2024
  .filter(ee.Filter.lt('CLOUD_COVER', 20));   // < 20% nubes

print('Imágenes en la colección:', coleccion.size());
```

### 3. Reducción Temporal
Para visualizar o analizar una colección, normalmente la reducimos a una sola imagen:

#### Métodos Comunes de Reducción
```javascript
// MEDIANA - Elimina outliers, bueno para eliminar nubes
var mediana = coleccion.median();

// MEDIA - Promedio de todos los valores
var media = coleccion.mean();

// MÁXIMO - Valor máximo en cada píxel
var maximo = coleccion.max();

// MÍNIMO - Valor mínimo en cada píxel
var minimo = coleccion.min();

// MOSAICO - Primera imagen sin nubes (requiere máscaras)
var mosaico = coleccion.mosaic();
```

#### ¿Cuándo Usar Cada Método?

| Método | Cuándo Usarlo | Ventaja |
|--------|---------------|---------|
| `median()` | Eliminar nubes, outliers | Robusto a valores extremos |
| `mean()` | Promedios, condiciones típicas | Suaviza variaciones |
| `max()` | Pico de vegetación, NDVI máximo | Captura el mejor escenario |
| `min()` | Cuerpos de agua, NDVI mínimo | Condiciones mínimas |
| `mosaic()` | Crear mosaico sin costuras | Imagen "limpia" si hay máscaras |

### 4. Visualización de Colecciones
```javascript
// ❌ INCORRECTO - No se puede visualizar directamente
Map.addLayer(coleccion, {}, 'Colección');  // Error!

// ✅ CORRECTO - Primero reducir, luego visualizar
var compuesta = coleccion.median();
Map.addLayer(compuesta, {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000}, 'Mediana');
```

### 5. Operaciones con Colecciones

#### Mapear Funciones (Aplicar a Cada Imagen)
```javascript
// Calcular NDVI para cada imagen de la colección
function calcularNDVI(imagen) {
  var ndvi = imagen.normalizedDifference(['B5', 'B4']).rename('NDVI');
  return imagen.addBands(ndvi);
}

var coleccionConNDVI = coleccion.map(calcularNDVI);
```

#### Seleccionar Bandas
```javascript
// Seleccionar solo bandas específicas
var coleccionRGB = coleccion.select(['B4', 'B3', 'B2']);
```

#### Ordenar Colecciones
```javascript
// Ordenar por fecha (más reciente primero)
var ordenada = coleccion.sort('system:time_start', false);

// Ordenar por nubosidad (menos nubes primero)
var menosNubes = coleccion.sort('CLOUD_COVER');
```

#### Obtener la Primera Imagen
```javascript
// Obtener la imagen con menos nubes
var mejorImagen = coleccion
  .sort('CLOUD_COVER')
  .first();
```

### 6. Información de Colecciones
```javascript
// Número de imágenes
print('Número de imágenes:', coleccion.size());

// Fechas de la colección
var fechas = coleccion.aggregate_array('system:time_start');
print('Fechas disponibles:', fechas);

// Rango de nubosidad
var nubosidad = coleccion.aggregate_array('CLOUD_COVER');
print('Nubosidad:', nubosidad);

// Primera y última imagen
print('Primera imagen:', coleccion.first());
print('Última imagen:', coleccion.sort('system:time_start', false).first());
```

## 🔧 Flujo de Trabajo Típico
```javascript
// 1. DEFINIR ÁREA Y PERIODO
var roi = ee.Geometry.Point([-5.86, 36.88]).buffer(10000);
var fechaInicio = '2024-01-01';
var fechaFin = '2024-12-31';

// 2. CARGAR Y FILTRAR COLECCIÓN
var coleccion = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
  .filterBounds(roi)
  .filterDate(fechaInicio, fechaFin)
  .filter(ee.Filter.lt('CLOUD_COVER', 20));

// 3. PREPROCESAR (aplicar función a cada imagen)
function preprocesar(imagen) {
  // Convertir a reflectancia
  var reflectancia = imagen.select(['SR_B.*']).multiply(0.0000275).add(-0.2);
  // Calcular NDVI
  var ndvi = reflectancia.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI');
  // Retornar imagen con NDVI añadido
  return reflectancia.addBands(ndvi)
    .copyProperties(imagen, ['system:time_start']);
}

var procesada = coleccion.map(preprocesar);

// 4. REDUCIR A UNA IMAGEN
var compuesta = procesada.median();

// 5. VISUALIZAR
Map.centerObject(roi, 10);
Map.addLayer(compuesta, {bands: ['SR_B5', 'SR_B4', 'SR_B3'], min: 0, max: 0.3}, 'Falso Color');
Map.addLayer(compuesta.select('NDVI'), {min: 0, max: 1, palette: ['brown', 'yellow', 'green']}, 'NDVI');
```

## 💡 Conceptos Avanzados

### Series Temporales
```javascript
// Crear un gráfico de NDVI a lo largo del tiempo
var grafico = ui.Chart.image.series({
  imageCollection: coleccionConNDVI.select('NDVI'),
  region: roi,
  reducer: ee.Reducer.mean(),
  scale: 30
}).setOptions({
  title: 'Serie Temporal de NDVI',
  vAxis: {title: 'NDVI'},
  hAxis: {title: 'Fecha'}
});

print(grafico);
```

### Composiciones por Calidad
```javascript
// Crear composición usando píxeles de mejor calidad
var compuesta = coleccion.qualityMosaic('NDVI');  // Usa píxeles con mayor NDVI
```

### Máscaras de Nubes
```javascript
// Función para enmascarar nubes en Landsat 8
function enmascararNubes(imagen) {
  var qaMask = imagen.select('QA_PIXEL').bitwiseAnd(parseInt('11111', 2)).eq(0);
  return imagen.updateMask(qaMask);
}

var sinNubes = coleccion.map(enmascararNubes);
```

## 🎯 Ventajas de las Colecciones en GEE
- **Procesamiento paralelo**: GEE procesa miles de imágenes simultáneamente
- **No necesitas descargar**: Todo el procesamiento ocurre en la nube
- **Acceso instantáneo**: Décadas de datos disponibles inmediatamente
- **Escalabilidad**: Análisis de áreas enormes sin preocuparte por el almacenamiento
- **Reproducibilidad**: Scripts compartibles que siempre usan los mismos datos

## 📊 Casos de Uso Comunes

### 🌱 Agricultura
```javascript
// NDVI máximo de la temporada de crecimiento
var ndviMax = coleccion
  .filterDate('2024-03-01', '2024-09-01')
  .map(calcularNDVI)
  .select('NDVI')
  .max();
```

### 🌊 Monitoreo de Agua
```javascript
// Frecuencia de inundación
var frecuencia = coleccion
  .map(function(img) {
    var mndwi = img.normalizedDifference(['B3', 'B6']);
    return mndwi.gt(0);  // 1 si hay agua, 0 si no
  })
  .sum()  // Contar cuántas veces hubo agua
  .divide(coleccion.size());  // Convertir a frecuencia (0-1)
```

### 🏙️ Crecimiento Urbano
```javascript
// Comparar dos períodos
var periodo1 = coleccion.filterDate('2020-01-01', '2020-12-31').median();
var periodo2 = coleccion.filterDate('2024-01-01', '2024-12-31').median();

var cambio = periodo2.subtract(periodo1);
```

---

## 📝 Contenidos Trabajados en Clase

En esta sesión nos hemos enfocado en aplicar los conceptos de colecciones de imágenes a dos casos prácticos de **series temporales**:

### 🎯 Conceptos Clave Aplicados

1. **Combinación de múltiples misiones Landsat** (5, 7, 8 y 9) en una sola serie temporal continua
2. **Análisis temporal por períodos decadales** (1984-2024)
3. **Métodos de reducción estadística**: mediana, máximo y percentil 95
4. **Enmascaramiento** de valores para mostrar solo información relevante
5. **Índices espectrales aplicados a series temporales**:
   - **MNDWI** para detección de agua
   - **NDVI** para análisis fenológico de vegetación

### 📁 Scripts Desarrollados

Los siguientes scripts están disponibles en la carpeta `scripts/dia-3/`:

---

#### **Script 1: Análisis Temporal de Agua con MNDWI**
**Archivo**: `01_series_temporales_mndwi.js`

**Descripción**:  
Script para analizar la evolución temporal de cuerpos de agua utilizando el índice MNDWI (Modified Normalized Difference Water Index) en cuatro períodos decadales.

**Características principales**:
- ✅ Combinación de **4 colecciones Landsat** (L5, L7, L8, L9) en una serie temporal unificada
- ✅ División en **4 períodos de 10 años** (1984-1994, 1994-2004, 2004-2014, 2014-2024)
- ✅ Períodos hidrológicos: del **1 de septiembre al 31 de agosto**
- ✅ **Aplicación de coeficientes de reflectancia** según documentación Landsat C02
- ✅ Cálculo de MNDWI: `(Green - SWIR1) / (Green + SWIR1)`
- ✅ **Selección de método estadístico** configurable: `median`, `max` o `percentile95`
- ✅ **Enmascaramiento automático** para mostrar solo valores MNDWI > 0 (agua)
- ✅ Código completamente **comentado y estructurado** para fines didácticos
- ✅ Exportación a Earth Engine Assets

**Conceptos trabajados**:
- Normalización de bandas entre diferentes sensores
- `.merge()` para combinar colecciones
- `.map()` para aplicar funciones a cada imagen
- Filtrado temporal con `.filterDate()`
- Reducción estadística configurable
- Máscaras con `.updateMask()`
- Sistema de coordenadas y reproyección

**Aplicación práctica**:  
Monitoreo de cambios en extensión de embalses, lagunas o zonas húmedas a lo largo de 40 años.

---

#### **Script 2: Análisis Fenológico con NDVI Multiestacional**
**Archivo**: `02_ndvi_multiestacional.js`

**Descripción**:  
Script para crear visualizaciones RGB donde cada color representa la **época del año** en que la vegetación alcanza su máxima actividad fotosintética. Los colores muestran **tiempo**, no tipo de vegetación.

**Dos versiones disponibles**:

##### **Versión Simple (2024)**
- 📅 Análisis de un **año específico** (configurable)
- 🍂 4 estaciones: Invierno, Primavera, Verano, Otoño
- 🎨 Visualización RGB multiestacional
- ✅ Enmascaramiento por umbral de NDVI (vegetación activa)
- 📊 Interpretación clara de colores temporales

##### **Versión Decadal (1984-2024)**
- 📅 Análisis de **4 décadas** alineadas con el script de MNDWI
- 🔄 Filtrado por meses específicos usando `.calendarRange()`
- 🎯 Método estadístico configurable (median/max/percentile95)
- 📈 Comparación de cambios fenológicos históricos
- 🌍 Detección de impactos del cambio climático en ciclos vegetativos

**Características principales**:
- ✅ Uso de **composites pre-calculados** de NDVI (cada 32 días)
- ✅ Función `ee.Image.cat()` para concatenar bandas estacionales
- ✅ Visualización RGB multiestacional (los colores dependen de qué bandas asignemos a R, G, B)
- ✅ **Por defecto usamos**: R=Invierno, G=Primavera, B=Verano, interpretándose así:
  - ⚫ **Negro** = Sin vegetación activa en ningún período
  - 🔴 **Rojo** = Vegetación activa en INVIERNO
  - 🟢 **Verde** = Vegetación activa en PRIMAVERA  
  - 🔵 **Azul** = Vegetación activa en VERANO
  - 🟡 **Amarillo** = Invierno + Primavera (R+G)
  - 🩵 **Cian (verde azulado)** = Primavera + Verano (G+B)
  - 🟣 **Magenta** = Invierno + Verano (R+B)
  - ⚪ **Blanco** = Activa todo el año (R+G+B)
- ✅ Enmascaramiento basado en NDVI medio anual

**Conceptos trabajados**:
- Colecciones pre-procesadas (`LANDSAT/COMPOSITES/C02/T1_L2_32DAY_NDVI`)
- Filtrado por meses específicos con `.calendarRange()`
- Concatenación de bandas con `.cat()`
- Análisis fenológico multitemporal
- Visualizaciones RGB para representar tiempo

**Aplicación práctica**:  
Identificación de patrones de crecimiento vegetal, diferenciación de cultivos por fenología, análisis de impactos del cambio climático.

---

### 🔑 Puntos Clave de la Sesión

1. **Series Temporales Largas**: Aprendimos a combinar múltiples misiones satelitales para crear series temporales de 40 años
2. **Harmonización de Datos**: Normalización de bandas para hacer comparables diferentes sensores
3. **Análisis Decadal**: División de series largas en períodos significativos
4. **Reducción Inteligente**: Uso de diferentes métodos estadísticos según el objetivo
5. **Enmascaramiento Temático**: Mostrar solo información relevante (agua, vegetación activa)
6. **Visualización del Tiempo**: Uso de color RGB para representar dimensión temporal
7. **Código Estructurado**: Organización clara con secciones, funciones reutilizables y comentarios

### 💡 Aplicaciones Reales

Estos scripts son la base para:
- 🌊 **Estudios hidrológicos**: Evolución de embalses, sequías
- 🌱 **Monitoreo agrícola**: Identificación de cultivos por fenología
- 🌳 **Evaluación ambiental**: Cambios en cobertura vegetal
- 🔥 **Gestión de incendios**: Análisis de vegetación seca (NDVI bajo)
- 🌍 **Cambio climático**: Impactos en ciclos estacionales

---

## ✅ Ejercicios Propuestos

### Nivel Básico
- [ ] Cargar una colección de Landsat 8 para tu región
- [ ] Filtrar la colección por fecha y nubosidad
- [ ] Crear una imagen mediana y visualizarla
- [ ] Imprimir el número de imágenes en la colección

### Nivel Intermedio
- [ ] Crear una composición del verano de 2024 con menos del 10% de nubes
- [ ] Calcular el NDVI para cada imagen y encontrar el NDVI máximo
- [ ] Comparar la mediana vs la media de una colección
- [ ] Crear un gráfico de serie temporal de NDVI

### Nivel Avanzado
- [ ] Crear una función que enmascare automáticamente las nubes
- [ ] Calcular estadísticas mensuales de NDVI para un año completo
- [ ] Detectar cambios entre dos períodos diferentes
- [ ] Crear una composición usando `qualityMosaic()` con tu propio criterio de calidad

## 🎓 Para Profundizar

### Preguntas Conceptuales
1. ¿Cuál es la diferencia práctica entre `.median()` y `.mean()`?
2. ¿Por qué `.mosaic()` necesita que las imágenes tengan máscaras?
3. ¿Cuándo usarías `.max()` vs `.qualityMosaic()`?
4. ¿Qué ventajas tiene trabajar con colecciones vs descargar imágenes individuales?

### Exploración de Datasets
- ¿Qué diferencias hay entre Landsat 8 y Sentinel-2 en términos de colecciones?
- ¿Qué colecciones están disponibles para análisis de precipitación?
- ¿Cómo se accede a datos históricos de MODIS?

## 📚 Recursos de Referencia

### Documentación Oficial
- [ImageCollection Guide](https://developers.google.com/earth-engine/guides/ic_creating)
- [Filtering Collections](https://developers.google.com/earth-engine/guides/ic_filtering)
- [Reducing Collections](https://developers.google.com/earth-engine/guides/ic_reducing)
- [Mapping over Collections](https://developers.google.com/earth-engine/guides/ic_mapping)

### Datasets Más Usados
- [Landsat Collections](https://developers.google.com/earth-engine/datasets/catalog/landsat)
- [Sentinel-2](https://developers.google.com/earth-engine/datasets/catalog/sentinel-2)
- [MODIS](https://developers.google.com/earth-engine/datasets/catalog/modis)
- [Dataset Catalog](https://developers.google.com/earth-engine/datasets)

## 💡 Consejos Prácticos

✅ **Siempre filtra antes de procesar** - Reduce el tiempo de cómputo  
✅ **Usa `.median()` para eliminar nubes** - Es más robusto que `.mean()`  
✅ **Verifica `.size()` después de filtrar** - Asegúrate de tener suficientes imágenes  
✅ **Copia las propiedades importantes** - Usa `.copyProperties()` al mapear  
✅ **Ten cuidado con `.mosaic()`** - Solo útil si tus imágenes tienen máscaras de nubes  
✅ **Usa `.first()` para pruebas rápidas** - Testea tu código con una imagen antes de aplicar a toda la colección  
✅ **Visualiza antes de exportar** - Confirma que tu resultado es correcto  

## 🚀 Preparación para Próximas Sesiones

### Día 4: Introducción a la API de Python con geemap

En la próxima sesión comenzaremos a trabajar con **Google Earth Engine desde Python** utilizando la biblioteca **geemap**. Este es un curso introductorio donde aprenderemos ambos lenguajes (JavaScript y Python) para trabajar con GEE.

**¿Qué veremos?**
- Instalación y configuración de geemap
- Sintaxis básica de Python para GEE
- Equivalencias entre JavaScript y Python
- Ventajas de usar notebooks de Jupyter
- Visualización interactiva con mapas

**Requisitos previos**:
- Todo lo aprendido en JavaScript es directamente transferible
- Los conceptos de ImageCollection, filtros y reducción son idénticos
- Solo cambia la sintaxis, no la lógica

### Más Adelante

Con el conocimiento de colecciones de imágenes, estaremos preparados para:
- Análisis de cambios temporales
- Detección de anomalías
- Clasificación de imágenes usando múltiples fechas
- Creación de series temporales complejas
- Análisis de tendencias a largo plazo

## 📌 Recordatorios Importantes

⚠️ **No puedes visualizar una colección directamente** - Siempre debes reducirla primero a una imagen

⚠️ **Las operaciones son "lazy"** - GEE no procesa hasta que pides un resultado (visualización, print, export)

⚠️ **El orden de los filtros importa** - Filtra espacialmente primero, luego temporalmente, luego por propiedades

⚠️ **`.map()` es tu amigo** - Aprende a usarlo bien para aplicar funciones a cada imagen
