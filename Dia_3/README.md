# Día 3 - Colecciones de Imágenes en Google Earth Engine

## 🎯 Objetivos del Día

En este tercer día del curso avanzamos hacia el trabajo con **colecciones de imágenes**, uno de los conceptos más potentes de Google Earth Engine:

- Entender qué son las ImageCollections
- Aprender a filtrar colecciones por fecha, ubicación y propiedades
- Crear composiciones temporales (mosaicos, medianas, máximos)
- Reducir colecciones a imágenes únicas
- Trabajar con series temporales

## 📚 Introducción a las Colecciones de Imágenes

### ¿Qué es una ImageCollection?

Hasta ahora hemos trabajado con imágenes individuales (`ee.Image`). En la práctica real, necesitamos trabajar con **múltiples imágenes** de la misma área tomadas en diferentes momentos.

Una **ImageCollection** es:
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
| **Definición** | Una imagen única | Conjunto de imágenes |
| **Dimensiones** | 2D espacial + bandas | 3D (espacio + tiempo + bandas) |
| **Ejemplo** | Foto de un día | Archivo de fotos de un año |
| **Uso típico** | Análisis puntual | Análisis temporal |
| **Visualización** | Directa con Map.addLayer | Requiere reducción primero |

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

Las colecciones suelen contener miles o millones de imágenes. Necesitamos **filtrar** para obtener solo las que nos interesan:

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

Para **visualizar** o **analizar** una colección, normalmente la reducimos a una sola imagen:

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
| **median()** | Eliminar nubes, outliers | Robusto a valores extremos |
| **mean()** | Promedios, condiciones típicas | Suaviza variaciones |
| **max()** | Pico de vegetación, NDVI máximo | Captura el mejor escenario |
| **min()** | Cuerpos de agua, NDVI mínimo | Condiciones mínimas |
| **mosaic()** | Crear mosaico sin costuras | Imagen "limpia" si hay máscaras |

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

1. **Procesamiento paralelo**: GEE procesa miles de imágenes simultáneamente
2. **No necesitas descargar**: Todo el procesamiento ocurre en la nube
3. **Acceso instantáneo**: Décadas de datos disponibles inmediatamente
4. **Escalabilidad**: Análisis de áreas enormes sin preocuparte por el almacenamiento
5. **Reproducibilidad**: Scripts compartibles que siempre usan los mismos datos

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

## 📝 Contenidos Trabajados en Clase

*Esta sección se actualizará después de la sesión con los scripts específicos trabajados*

### Scripts del Día 3

**Script XX: [Título]**
- Descripción de lo trabajado
- Conceptos clave aplicados

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
- ¿Cuál es la diferencia práctica entre `.median()` y `.mean()`?
- ¿Por qué `.mosaic()` necesita que las imágenes tengan máscaras?
- ¿Cuándo usarías `.max()` vs `.qualityMosaic()`?
- ¿Qué ventajas tiene trabajar con colecciones vs descargar imágenes individuales?

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
- [Dataset Catalog](https://developers.google.com/earth-engine/datasets/)

## 💡 Consejos Prácticos

1. **Siempre filtra antes de procesar** - Reduce el tiempo de cómputo
2. **Usa `.median()` para eliminar nubes** - Es más robusto que `.mean()`
3. **Verifica `.size()` después de filtrar** - Asegúrate de tener suficientes imágenes
4. **Copia las propiedades importantes** - Usa `.copyProperties()` al mapear
5. **Ten cuidado con `.mosaic()`** - Solo útil si tus imágenes tienen máscaras de nubes
6. **Usa `.first()` para pruebas rápidas** - Testea tu código con una imagen antes de aplicar a toda la colección
7. **Visualiza antes de exportar** - Confirma que tu resultado es correcto

## 🚀 Preparación para Próximas Sesiones

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

---

*README del Día 3 - Se actualizará con los scripts específicos trabajados en clase*
