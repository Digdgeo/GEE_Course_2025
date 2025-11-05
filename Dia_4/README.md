# Día 4 - Introducción a Python y geemap

## 🎯 Objetivos del Día
En este cuarto día damos un paso importante: comenzamos a trabajar con Google Earth Engine desde **Python** utilizando la biblioteca **geemap**. Este es un curso introductorio donde aprendemos ambos lenguajes (JavaScript y Python) para aprovechar lo mejor de cada uno:

- Entender qué es geemap y por qué es útil
- Instalar y configurar el entorno Python para GEE
- Aprender la sintaxis básica de Python para GEE
- Ver las equivalencias entre JavaScript y Python
- Replicar conceptos de los días anteriores en Python
- Trabajar con notebooks interactivos (Jupyter/Colab)

## 📚 Introducción a Python para GEE

### ¿Por Qué Python?

Hasta ahora hemos trabajado exclusivamente con el **Code Editor de GEE (JavaScript)**. Ahora añadimos Python a nuestro arsenal de herramientas. ¿Por qué?

#### Ventajas de JavaScript (Code Editor)
✅ **Interfaz visual integrada** - Todo en un solo lugar  
✅ **Prototipado rápido** - Ideal para explorar y probar  
✅ **Visualización inmediata** - Ver resultados al instante  
✅ **Compartir scripts fácilmente** - Un solo enlace  
✅ **No requiere instalación** - Solo navegador web  

#### Ventajas de Python (geemap)
✅ **Ecosistema científico** - Pandas, NumPy, Matplotlib, etc.  
✅ **Notebooks interactivos** - Jupyter, Google Colab  
✅ **Integración con ML** - Scikit-learn, TensorFlow, PyTorch  
✅ **Automatización** - Scripts, pipelines, servicios  
✅ **Control total** - Tu entorno, tus herramientas  
✅ **Análisis estadístico avanzado** - R también via reticulate  

### ¿Qué es geemap?

**geemap** (GEE + Map) es una biblioteca de Python creada por el Dr. Qiusheng Wu que facilita el uso de Google Earth Engine desde Python. Proporciona:

🗺️ **Mapas interactivos** estilo Code Editor  
📊 **Visualización de datos** mejorada  
🔧 **Herramientas adicionales** no disponibles en JavaScript  
📝 **Notebooks interactivos** para documentación y enseñanza  
🚀 **Integración perfecta** con el ecosistema Python científico  

**GitHub**: https://github.com/gee-community/geemap  
**Documentación**: https://geemap.org  
**Libro gratuito**: https://book.geemap.org  

## 🔧 Instalación y Configuración

### Opción 1: Google Colab (Recomendado para Empezar)

**Ventajas**: Sin instalación, gratuito, acceso desde cualquier lugar

```python
# En una celda de Google Colab
!pip install geemap

import ee
import geemap

# Autenticación (solo primera vez)
ee.Authenticate()

# Inicializar
ee.Initialize()

# Crear mapa
Map = geemap.Map()
Map
```

### Opción 2: Instalación Local

#### Requisitos
- Python 3.8 o superior
- pip o conda

#### Instalación con pip
```bash
pip install geemap
```

#### Instalación con conda
```bash
conda create -n gee python=3.11
conda activate gee
conda install -c conda-forge geemap
```

#### Primera autenticación
```python
import ee
ee.Authenticate()  # Solo primera vez
ee.Initialize()
```

### Opción 3: Jupyter Notebook Local

```bash
# Instalar Jupyter
pip install notebook

# Instalar geemap
pip install geemap

# Lanzar Jupyter
jupyter notebook
```

## 🔄 Equivalencias JavaScript ↔ Python

### Sintaxis Básica

| Concepto | JavaScript | Python |
|----------|------------|--------|
| Comentarios | `// comentario` | `# comentario` |
| Variables | `var imagen = ee.Image(...)` | `imagen = ee.Image(...)` |
| Función | `function nombre() { ... }` | `def nombre(): ...` |
| Imprimir | `print('texto')` | `print('texto')` |
| Strings | `'texto'` o `"texto"` | `'texto'` o `"texto"` |
| Listas | `var lista = [1, 2, 3]` | `lista = [1, 2, 3]` |
| Diccionarios | `var obj = {key: value}` | `obj = {'key': value}` |

### Operaciones GEE

| Operación | JavaScript | Python |
|-----------|------------|--------|
| Cargar imagen | `ee.Image('LANDSAT/...')` | `ee.Image('LANDSAT/...')` |
| Cargar colección | `ee.ImageCollection('...')` | `ee.ImageCollection('...')` |
| Filtrar por fecha | `.filterDate('2020-01-01', '2020-12-31')` | `.filterDate('2020-01-01', '2020-12-31')` |
| Filtrar por área | `.filterBounds(geometry)` | `.filterBounds(geometry)` |
| Seleccionar bandas | `.select('B4', 'B3', 'B2')` | `.select('B4', 'B3', 'B2')` |
| Calcular mediana | `.median()` | `.median()` |
| Añadir al mapa | `Map.addLayer(img, vis, 'name')` | `Map.addLayer(img, vis, 'name')` |
| Centrar mapa | `Map.centerObject(geom, zoom)` | `Map.centerObject(geom, zoom)` |

### Funciones y Map

**JavaScript:**
```javascript
function calcularNDVI(imagen) {
  var ndvi = imagen.normalizedDifference(['B5', 'B4']);
  return imagen.addBands(ndvi);
}

var coleccion = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .map(calcularNDVI);
```

**Python:**
```python
def calcular_ndvi(imagen):
    ndvi = imagen.normalizedDifference(['B5', 'B4'])
    return imagen.addBands(ndvi)

coleccion = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2') \
    .map(calcular_ndvi)
```

### Funciones Anónimas (Lambda)

**JavaScript:**
```javascript
var coleccion = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .map(function(img) {
    return img.select(['B4', 'B3', 'B2']);
  });
```

**Python:**
```python
coleccion = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2') \
    .map(lambda img: img.select(['B4', 'B3', 'B2']))
```

## 📖 Conceptos Básicos de Python para GEE

### 1. Indentación (¡Importante!)

Python usa **indentación** (espacios) en lugar de llaves `{}`:

```python
# ✅ Correcto
def mi_funcion():
    x = 10
    y = 20
    return x + y

# ❌ Incorrecto (sin indentación)
def mi_funcion():
x = 10
y = 20
return x + y
```

### 2. Variables y Tipos de Datos

```python
# Números
entero = 42
decimal = 3.14

# Strings
texto = 'Hola GEE'
texto2 = "También vale"

# Listas (arrays)
bandas = ['B4', 'B3', 'B2']
valores = [1, 2, 3, 4, 5]

# Diccionarios (objetos)
vis_params = {
    'min': 0,
    'max': 3000,
    'bands': ['B4', 'B3', 'B2']
}

# Booleanos
verdadero = True
falso = False
```

### 3. Estructuras de Control

```python
# If-elif-else
if nubosidad < 20:
    print('Imagen buena')
elif nubosidad < 50:
    print('Imagen aceptable')
else:
    print('Imagen muy nublada')

# For loop
for banda in ['B2', 'B3', 'B4']:
    print(f'Procesando banda {banda}')

# While loop
contador = 0
while contador < 5:
    print(contador)
    contador += 1
```

### 4. Funciones

```python
# Función simple
def saludar(nombre):
    return f'Hola, {nombre}'

# Función con múltiples parámetros
def calcular_ndvi(imagen, banda_nir='B5', banda_red='B4'):
    ndvi = imagen.normalizedDifference([banda_nir, banda_red])
    return ndvi.rename('NDVI')

# Función con valores por defecto
def filtrar_coleccion(coleccion, fecha_inicio, fecha_fin, max_nubes=20):
    return coleccion \
        .filterDate(fecha_inicio, fecha_fin) \
        .filter(ee.Filter.lt('CLOUD_COVER', max_nubes))
```

### 5. Importar Bibliotecas

```python
# Importar biblioteca completa
import ee
import geemap

# Importar con alias
import pandas as pd
import numpy as np

# Importar funciones específicas
from datetime import datetime
from geemap import Map
```

## 🗺️ Trabajando con Mapas en geemap

### Crear un Mapa

```python
import geemap

# Mapa básico
Map = geemap.Map()
Map

# Mapa centrado en ubicación
Map = geemap.Map(center=[28.3, -16.5], zoom=10)
Map

# Mapa con basemap específico
Map = geemap.Map(basemap='HYBRID')
Map
```

### Añadir Capas

```python
# Cargar imagen
imagen = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_202034_20240722')

# Parámetros de visualización
vis_params = {
    'min': 7000,
    'max': 12000,
    'bands': ['SR_B4', 'SR_B3', 'SR_B2']
}

# Añadir al mapa
Map.addLayer(imagen, vis_params, 'Landsat 8')

# Centrar en la imagen
Map.centerObject(imagen, 10)
```

### Controles del Mapa

```python
# Añadir control de capas
Map.add_layer_control()

# Añadir barra de escala
Map.add_scale_bar()

# Añadir coordenadas del cursor
Map.add_mouse_position()

# Añadir herramientas de dibujo
Map.add_draw_control()

# Añadir inspector de valores
Map.add_inspector()
```

## 🔁 Replicando Conceptos de Días Anteriores

### Día 1: Trabajar con Imágenes Individuales

**JavaScript (Día 1):**
```javascript
var imagen = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_202034_20240722');
var ndvi = imagen.normalizedDifference(['SR_B5', 'SR_B4']);
Map.addLayer(ndvi, {min: 0, max: 1, palette: ['brown', 'yellow', 'green']}, 'NDVI');
```

**Python (Día 4):**
```python
import ee
import geemap

# Inicializar
ee.Initialize()

# Cargar imagen
imagen = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_202034_20240722')

# Calcular NDVI
ndvi = imagen.normalizedDifference(['SR_B5', 'SR_B4'])

# Visualizar
Map = geemap.Map()
vis_params = {'min': 0, 'max': 1, 'palette': ['brown', 'yellow', 'green']}
Map.addLayer(ndvi, vis_params, 'NDVI')
Map.centerObject(imagen, 10)
Map
```

### Día 2: Índices Espectrales

**JavaScript:**
```javascript
var imagen = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_202034_20240722');

// Calcular múltiples índices
var ndvi = imagen.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI');
var ndwi = imagen.normalizedDifference(['SR_B3', 'SR_B6']).rename('NDWI');
var evi = imagen.expression(
  '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))',
  {
    'NIR': imagen.select('SR_B5'),
    'RED': imagen.select('SR_B4'),
    'BLUE': imagen.select('SR_B2')
  }
).rename('EVI');
```

**Python:**
```python
import ee
import geemap

imagen = ee.Image('LANDSAT/LC08/C02/T1_L2/LC08_202034_20240722')

# Calcular múltiples índices
ndvi = imagen.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI')
ndwi = imagen.normalizedDifference(['SR_B3', 'SR_B6']).rename('NDWI')
evi = imagen.expression(
    '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))',
    {
        'NIR': imagen.select('SR_B5'),
        'RED': imagen.select('SR_B4'),
        'BLUE': imagen.select('SR_B2')
    }
).rename('EVI')

# Visualizar
Map = geemap.Map()
Map.addLayer(ndvi, {'min': 0, 'max': 1, 'palette': ['brown', 'green']}, 'NDVI')
Map.addLayer(ndwi, {'min': -1, 'max': 1, 'palette': ['white', 'blue']}, 'NDWI')
Map.addLayer(evi, {'min': 0, 'max': 1, 'palette': ['red', 'yellow', 'green']}, 'EVI')
Map
```

### Día 3: Colecciones y Series Temporales

**JavaScript:**
```javascript
var coleccion = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .filterBounds(geometry)
  .filterDate('2024-01-01', '2024-12-31')
  .filter(ee.Filter.lt('CLOUD_COVER', 20));

var mediana = coleccion.median();
Map.addLayer(mediana, {bands: ['SR_B4', 'SR_B3', 'SR_B2'], min: 7000, max: 12000}, 'Mediana');
```

**Python:**
```python
import ee
import geemap

# Definir geometría
geometry = ee.Geometry.Point([-5.86, 36.88]).buffer(10000)

# Cargar colección
coleccion = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2') \
    .filterBounds(geometry) \
    .filterDate('2024-01-01', '2024-12-31') \
    .filter(ee.Filter.lt('CLOUD_COVER', 20))

# Calcular mediana
mediana = coleccion.median()

# Visualizar
Map = geemap.Map()
vis_params = {'bands': ['SR_B4', 'SR_B3', 'SR_B2'], 'min': 7000, 'max': 12000}
Map.addLayer(mediana, vis_params, 'Mediana 2024')
Map.centerObject(geometry, 10)
Map
```

## 🌟 Ventajas Únicas de geemap

### 1. Mapas Divididos (Split Map)

```python
# Comparar dos períodos lado a lado
Map = geemap.Map()

# Imagen 2020
img_2020 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2') \
    .filterDate('2020-01-01', '2020-12-31') \
    .median()

# Imagen 2024
img_2024 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2') \
    .filterDate('2024-01-01', '2024-12-31') \
    .median()

vis = {'bands': ['SR_B4', 'SR_B3', 'SR_B2'], 'min': 7000, 'max': 12000}

# Crear mapa dividido
Map.split_map(img_2020, img_2024, left_label='2020', right_label='2024', left_args=vis, right_args=vis)
Map
```

### 2. Series Temporales Interactivas

```python
# Crear gráfico de serie temporal
roi = ee.Geometry.Point([-5.86, 36.88])

coleccion = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2') \
    .filterBounds(roi) \
    .filterDate('2023-01-01', '2024-12-31')

# Calcular NDVI
def calcular_ndvi(img):
    ndvi = img.normalizedDifference(['SR_B5', 'SR_B4'])
    return img.addBands(ndvi.rename('NDVI'))

coleccion_ndvi = coleccion.map(calcular_ndvi)

# Crear gráfico
geemap.image_dates(coleccion_ndvi)
```

### 3. Exportación Simplificada

```python
# Exportar a Google Drive
geemap.download_ee_image(
    imagen,
    filename='mi_imagen.tif',
    scale=30,
    region=geometry
)

# Exportar colección como GIF
geemap.download_ee_video(
    coleccion,
    filename='serie_temporal.gif',
    scale=30,
    region=geometry
)
```

### 4. Integración con Pandas

```python
import pandas as pd

# Extraer valores a DataFrame
fc = ee.FeatureCollection('projects/mi-proyecto/assets/puntos')
df = geemap.ee_to_pandas(fc)
print(df.head())

# Convertir DataFrame a FeatureCollection
df = pd.DataFrame({
    'lon': [-5.5, -6.0, -5.8],
    'lat': [36.5, 36.8, 37.0],
    'clase': ['bosque', 'agua', 'urbano']
})

fc = geemap.pandas_to_ee(df)
```

## 📝 Ejemplo Completo: Script del Día 3 en Python

Aquí mostramos cómo se vería el script de MNDWI del Día 3 en Python:

```python
"""
ANÁLISIS TEMPORAL DE AGUA CON MNDWI - SERIES TEMPORALES LANDSAT
Versión Python con geemap
"""

import ee
import geemap

# Inicializar
ee.Initialize()

# ============================================================================
# 1. CONFIGURACIÓN INICIAL
# ============================================================================

# Definir geometría (ejemplo: Embalse)
geometry = ee.Geometry.Rectangle([-6.5, 36.8, -6.0, 37.2])

# Sistema de coordenadas
crs = 'EPSG:32629'
escala = 30

# Método estadístico: 'median', 'max', 'percentile95'
metodo = 'median'

# Umbral de agua
umbral_agua = 0

# ============================================================================
# 2. FUNCIONES DE PROCESAMIENTO
# ============================================================================

def seleccionar_bandas(imagen, satelite):
    """Selecciona y renombra bandas según el satélite"""
    if satelite in ['L5', 'L7']:
        bandas_originales = ['SR_B1', 'SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B7']
    else:
        bandas_originales = ['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7']
    
    bandas_renombradas = ['blue', 'green', 'red', 'nir', 'swir1', 'swir2']
    return imagen.select(bandas_originales, bandas_renombradas)

def aplicar_reflectancia(imagen):
    """Convierte a reflectancia de superficie"""
    return imagen.multiply(0.0000275).add(-0.2) \
        .copyProperties(imagen, imagen.propertyNames())

def calcular_mndwi(imagen):
    """Calcula MNDWI"""
    mndwi = imagen.normalizedDifference(['green', 'swir1']).rename('MNDWI')
    return mndwi.clip(geometry).reproject(crs=crs, scale=escala)

def enmascarar_agua(imagen):
    """Enmascara valores <= 0"""
    mascara = imagen.gt(umbral_agua)
    return imagen.updateMask(mascara)

# ============================================================================
# 3. CARGAR Y PROCESAR COLECCIONES LANDSAT
# ============================================================================

# Cargar Landsat 5
landsat5 = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2') \
    .filterDate('1984-01-01', '2023-12-31') \
    .filterBounds(geometry) \
    .filter(ee.Filter.lt('CLOUD_COVER', 20)) \
    .map(lambda img: seleccionar_bandas(img, 'L5').clip(geometry))

# Cargar Landsat 7
landsat7 = ee.ImageCollection('LANDSAT/LE07/C02/T1_L2') \
    .filterDate('1984-01-01', '2023-12-31') \
    .filterBounds(geometry) \
    .filter(ee.Filter.lt('CLOUD_COVER', 20)) \
    .map(lambda img: seleccionar_bandas(img, 'L7').clip(geometry))

# Cargar Landsat 8
landsat8 = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2') \
    .filterDate('1984-01-01', '2023-12-31') \
    .filterBounds(geometry) \
    .filter(ee.Filter.lt('CLOUD_COVER', 20)) \
    .map(lambda img: seleccionar_bandas(img, 'L8').clip(geometry))

# Cargar Landsat 9
landsat9 = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2') \
    .filterDate('1984-01-01', '2023-12-31') \
    .filterBounds(geometry) \
    .filter(ee.Filter.lt('CLOUD_COVER', 20)) \
    .map(lambda img: seleccionar_bandas(img, 'L9').clip(geometry))

# Combinar todas las colecciones
landsat_combinado = landsat5.merge(landsat7).merge(landsat8).merge(landsat9)

# Aplicar reflectancia
landsat_reflectancia = landsat_combinado.map(aplicar_reflectancia)

# ============================================================================
# 4. CALCULAR MNDWI POR PERÍODOS
# ============================================================================

# Filtrar por períodos
periodo_1984_1994 = landsat_reflectancia.filterDate('1984-09-01', '1994-08-31')
periodo_1994_2004 = landsat_reflectancia.filterDate('1994-09-01', '2004-08-31')
periodo_2004_2014 = landsat_reflectancia.filterDate('2004-09-01', '2014-08-31')
periodo_2014_2024 = landsat_reflectancia.filterDate('2014-09-01', '2024-08-31')

# Calcular MNDWI y aplicar método estadístico
mndwi_1984_1994 = periodo_1984_1994.map(calcular_mndwi).median()
mndwi_1994_2004 = periodo_1994_2004.map(calcular_mndwi).median()
mndwi_2004_2014 = periodo_2004_2014.map(calcular_mndwi).median()
mndwi_2014_2024 = periodo_2014_2024.map(calcular_mndwi).median()

# Enmascarar
mndwi_1984_1994_masked = enmascarar_agua(mndwi_1984_1994)
mndwi_1994_2004_masked = enmascarar_agua(mndwi_1994_2004)
mndwi_2004_2014_masked = enmascarar_agua(mndwi_2004_2014)
mndwi_2014_2024_masked = enmascarar_agua(mndwi_2014_2024)

# ============================================================================
# 5. VISUALIZACIÓN
# ============================================================================

# Crear mapa
Map = geemap.Map(center=[36.9, -6.3], zoom=10)

# Paleta de colores
paleta_agua = ['lightblue', 'blue', 'darkblue']

# Añadir capas
Map.addLayer(mndwi_1984_1994_masked, {'min': 0, 'max': 1, 'palette': paleta_agua}, 
             'MNDWI 1984-1994', False)
Map.addLayer(mndwi_1994_2004_masked, {'min': 0, 'max': 1, 'palette': paleta_agua}, 
             'MNDWI 1994-2004', False)
Map.addLayer(mndwi_2004_2014_masked, {'min': 0, 'max': 1, 'palette': paleta_agua}, 
             'MNDWI 2004-2014', False)
Map.addLayer(mndwi_2014_2024_masked, {'min': 0, 'max': 1, 'palette': paleta_agua}, 
             'MNDWI 2014-2024', True)

Map.addLayer(geometry, {'color': 'red'}, 'Área de Estudio')

# Mostrar mapa
Map
```

## 💡 Consejos para la Transición JS → Python

### 1. Naming Conventions

- **JavaScript**: `camelCase` → `var imagenSentinel = ee.Image(...)`
- **Python**: `snake_case` → `imagen_sentinel = ee.Image(...)`

### 2. Indentación

```python
# Python requiere indentación consistente (4 espacios recomendado)
def mi_funcion():
    if condicion:
        hacer_algo()
    else:
        hacer_otra_cosa()
```

### 3. String Formatting

```python
# f-strings (recomendado en Python 3.6+)
nombre = 'NDVI'
fecha = '2024-01-01'
print(f'Procesando {nombre} para {fecha}')

# .format()
print('Procesando {} para {}'.format(nombre, fecha))

# Concatenación (menos recomendado)
print('Procesando ' + nombre + ' para ' + fecha)
```

### 4. Comprensiones de Lista

```python
# En lugar de map() de JavaScript, Python tiene list comprehensions
bandas_landsat = ['B' + str(i) for i in range(1, 8)]
# Resultado: ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7']
```

### 5. None vs null

```python
# JavaScript: null, undefined
# Python: None

valor = None
if valor is None:
    print('Valor no definido')
```

## 📊 Ventajas de Notebooks

### Jupyter Notebook / Google Colab

✅ **Documentación integrada** - Markdown + código  
✅ **Ejecución por celdas** - Probar paso a paso  
✅ **Visualización inline** - Gráficos y mapas en el documento  
✅ **Reproducibilidad** - Compartir resultados completos  
✅ **Exploración interactiva** - Modificar y reejecutar  

### Estructura Típica de un Notebook

```python
# Celda 1: Instalación y configuración
!pip install geemap

# Celda 2: Imports
import ee
import geemap
ee.Initialize()

# Celda 3: Definir parámetros
fecha_inicio = '2024-01-01'
fecha_fin = '2024-12-31'

# Celda 4: Cargar datos
coleccion = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')...

# Celda 5: Procesar
mediana = coleccion.median()

# Celda 6: Visualizar
Map = geemap.Map()
Map.addLayer(mediana, vis_params, 'Resultado')
Map

# Celda 7: Análisis
print('Número de imágenes:', coleccion.size().getInfo())

# Celda 8: Exportar
geemap.download_ee_image(mediana, 'resultado.tif')
```

## 📚 Recursos de Aprendizaje

### Documentación Oficial

- **geemap**: https://geemap.org
- **Earth Engine Python API**: https://developers.google.com/earth-engine/guides/python_install
- **Libro geemap**: https://book.geemap.org
- **Tutoriales geemap**: https://geemap.org/tutorials

### Python Básico

- **Python.org Tutorial**: https://docs.python.org/es/3/tutorial/
- **Real Python**: https://realpython.com
- **DataCamp**: Cursos gratuitos de Python

### Notebooks

- **Google Colab**: https://colab.research.google.com
- **Jupyter**: https://jupyter.org
- **Ejemplos geemap**: https://github.com/gee-community/geemap/tree/master/examples

## ✅ Checklist para Empezar

- [ ] Decidir entre Colab (fácil) o local (más control)
- [ ] Instalar geemap
- [ ] Autenticar Earth Engine (`ee.Authenticate()`)
- [ ] Inicializar (`ee.Initialize()`)
- [ ] Crear primer mapa (`Map = geemap.Map()`)
- [ ] Replicar un script simple de JavaScript
- [ ] Explorar ejemplos de geemap
- [ ] Practicar con notebooks

## 🎯 Objetivos del Día 4

Al final de esta sesión deberás ser capaz de:

✅ Instalar y configurar geemap en tu entorno  
✅ Entender las diferencias básicas JavaScript vs Python  
✅ Crear mapas interactivos con geemap  
✅ Replicar scripts de los días anteriores en Python  
✅ Aprovechar ventajas únicas de Python (pandas, notebooks, etc.)  
✅ Decidir cuándo usar JavaScript vs Python según la tarea  

## 🚀 ¿Por Qué Aprender Ambos?

En este curso aprendemos **JavaScript Y Python** porque:

🎯 **Complementarios, no excluyentes**:
- JavaScript: Prototipado rápido, exploración, compartir
- Python: Análisis profundo, automatización, integración

🔧 **Herramienta correcta para cada trabajo**:
- ¿Explorar datos rápido? → JavaScript
- ¿Pipeline automatizado? → Python
- ¿Compartir con no-programadores? → JavaScript
- ¿Integrar con ML? → Python

🌍 **Comunidad**:
- Ambos lenguajes tienen comunidades activas en GEE
- Más oportunidades laborales
- Acceso a todas las herramientas del ecosistema GEE

## 📝 Contenidos Trabajados en Clase

Esta sección se actualizará después de la sesión con los scripts y notebooks específicos trabajados.

### Notebooks del Día 4

**Notebook 1**: Introducción a Python y geemap  
- Instalación y configuración
- Primeros pasos con mapas interactivos
- Equivalencias JavaScript ↔ Python

**Notebook 2**: Replicando conceptos anteriores  
- Trabajar con imágenes individuales (Día 1)
- Calcular índices espectrales (Día 2)
- Procesar colecciones y series temporales (Día 3)

**Notebook 3**: Ventajas únicas de geemap  
- Mapas divididos para comparar períodos
- Series temporales interactivas
- Integración con pandas y exportación

## 🎓 Preparación para Próximas Sesiones

Con Python y geemap en nuestro arsenal, estaremos preparados para:

- Análisis estadísticos avanzados
- Integración con machine learning
- Automatización de flujos de trabajo
- Generación de reportes automáticos
- Pipelines de procesamiento complejos
- Aplicaciones web con GEE como backend

## 📌 Recordatorios Importantes

⚠️ **La API de GEE es la misma** - Solo cambia la sintaxis del lenguaje

⚠️ **Indentación en Python es crucial** - Usa 4 espacios consistentemente

⚠️ **snake_case vs camelCase** - Python usa snake_case para variables y funciones

⚠️ **Notebooks son ideales para aprender** - Permite ejecutar y ver resultados paso a paso

⚠️ **No tienes que elegir uno** - Usa ambos según la tarea

## 💻 Próximos Pasos

Después de dominar lo básico:

1. **Explorar el libro de geemap** (https://book.geemap.org)
2. **Practicar replicando tus scripts de JavaScript**
3. **Experimentar con las herramientas únicas de Python**
4. **Integrar con otras bibliotecas** (pandas, matplotlib, folium)
5. **Crear tus propios notebooks** documentando análisis

---

**¡Bienvenido al mundo de Earth Engine con Python!** 🐍🌍
