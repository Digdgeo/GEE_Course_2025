# Día 2 - Índices Espectrales, DEM y Nuevos Datasets

## 🎯 Objetivos del Día
- Completar los contenidos pendientes del Día 1
- Calcular índices espectrales (NDVI, MNDWI, SAVI)
- Trabajar con Modelos Digitales de Elevación (DEM)
- Realizar estadísticas zonales avanzadas
- Explorar datos radar para tráfico marítimo
- Analizar datos de luminosidad nocturna

---

## 📝 Contenidos Planificados

### Scripts Pendientes del Día 1

Los siguientes scripts no se cubrieron en la primera sesión y se trabajarán hoy:

#### Script 6: Cálculo de Índices Espectrales
**Archivo:** `06_ndvi_image.js`

**Aprenderemos:**
- Cargar imágenes Landsat 8 (Collection 2)
- Convertir Digital Numbers a reflectancia de superficie
- Calcular NDVI (Normalized Difference Vegetation Index)
- Calcular MNDWI (Modified Normalized Difference Water Index)
- Calcular SAVI (Soil Adjusted Vegetation Index)
- Aplicar máscaras basadas en valores
- Clasificar índices por umbrales
- Usar paletas de color para visualización

---

#### Script 7: Modelo Digital de Elevación (DEM)
**Archivo:** `07_srtm_munis.js`

**Aprenderemos:**
- Cargar el dataset SRTM (elevación global)
- Derivar productos topográficos:
  - Pendiente (slope)
  - Aspecto (aspect)
- Crear imágenes multi-banda
- Calcular estadísticas zonales con `reduceRegion()`
- Calcular estadísticas zonales múltiples con `reduceRegions()`
- Diferentes reductores: mean, median, max, min, etc.
- Exportar resultados a CSV

---

#### Script 8: Combinando DEM y Datos Espectrales
**Archivo:** `08_srtm_ndvi_mask.js`

**Aprenderemos:**
- Filtrar colecciones Landsat por fecha, ubicación y path/row
- Analizar nubosidad en colecciones
- Crear composiciones temporales (máximo, media, mediana)
- Combinar datos topográficos y espectrales
- Aplicar máscaras múltiples (elevación, NDVI, combinadas)
- Operadores lógicos en imágenes: `and()`, `or()`, `not()`
- Crear clasificaciones basadas en múltiples criterios

---

#### Script 9: Estadísticas Zonales Avanzadas
**Archivo:** `09_zonal_stats_dem_ndvi.js`

**Aprenderemos:**
- Calcular valores máximos/mínimos temporales
- Crear zonas (categorías) usando `where()`
- Reductores agrupados con `.group()`
- Calcular histogramas por zona
- Análisis cruzado de variables (elevación × NDVI)
- Calcular áreas con `ee.Image.pixelArea()`
- Convertir imágenes clasificadas a vectores
- Exportar imágenes y tablas

---

### 🆕 Nuevos Contenidos del Día 2

#### Datos Radar: Tráfico Marítimo
**Dataset:** Sentinel-1 SAR o similares

**Exploraremos:**
- Introducción a datos de radar (SAR)
- Diferencias entre datos ópticos y radar
- Ventajas del radar (nubes, noche)
- Aplicaciones para monitoreo marítimo
- Detección de embarcaciones
- Análisis de tráfico marítimo
- Visualización de datos radar

**Posibles aplicaciones:**
- Seguimiento de rutas marítimas
- Identificación de zonas de pesca
- Monitoreo de puertos
- Detección de anomalías

---

#### Datos de Luminosidad Nocturna
**Dataset:** VIIRS Nighttime Day/Night Band o DMSP-OLS

**Exploraremos:**
- Fuentes de datos de luminosidad nocturna
- Aplicaciones de los datos nocturnos
- Análisis de desarrollo urbano
- Seguimiento de actividad económica
- Comparaciones temporales
- Identificación de cambios en iluminación
- Detección de eventos (apagones, crecimiento urbano)

**Posibles aplicaciones:**
- Mapeo de expansión urbana
- Estudios de desarrollo económico
- Análisis de consumo energético
- Detección de asentamientos informales
- Impacto de conflictos o desastres

---

## 🔗 Recursos del Día

### Documentación Oficial
- [Image Collections](https://developers.google.com/earth-engine/guides/ic_filtering)
- [Reducers](https://developers.google.com/earth-engine/guides/reducers_intro)
- [Masking](https://developers.google.com/earth-engine/guides/image_mask)
- [Exporting Data](https://developers.google.com/earth-engine/guides/exporting)

### Datasets
- [Landsat 8 Collection 2 Surface Reflectance](https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_LC08_C02_T1_L2)
- [SRTM Digital Elevation Data](https://developers.google.com/earth-engine/datasets/catalog/USGS_SRTMGL1_003)
- [Sentinel-1 SAR](https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S1_GRD)
- [VIIRS Nighttime Lights](https://developers.google.com/earth-engine/datasets/catalog/NOAA_VIIRS_DNB_MONTHLY_V1_VCMSLCFG)

---

## 📌 Recordatorios Importantes

### Antes de Empezar
- ✅ Verifica que estás usando la misma cuenta de Google en Cloud Console y Code Editor
- ✅ Confirma que Earth Engine API está habilitada en tu proyecto
- ✅ Repasa los conceptos del Día 1 (especialmente client vs server)

### Conceptos Clave para Hoy
- **Reducers:** Herramientas para calcular estadísticas sobre regiones
- **Scale:** Define la resolución del análisis (muy importante para resultados correctos)
- **Máscaras:** Filtran píxeles basándose en criterios
- **Composiciones temporales:** Combinan múltiples imágenes en una sola
- **Datos SAR:** Funcionan con microondas, no dependen de luz solar

---

## ✅ Ejercicios Sugeridos

Si terminamos antes de tiempo o para practicar en casa:

### Nivel Básico
1. Calcula el NDVI medio de tu región para el último mes
2. Identifica las zonas con mayor elevación en tu área de estudio
3. Visualiza la luminosidad nocturna de tu ciudad

### Nivel Intermedio
4. Crea un mapa que muestre solo vegetación en zonas de baja pendiente
5. Compara la luminosidad nocturna de dos años diferentes
6. Identifica cambios en el tráfico marítimo entre dos períodos

### Nivel Avanzado
7. Calcula estadísticas de NDVI por rangos de elevación
8. Analiza la correlación entre luminosidad nocturna y densidad de población
9. Detecta patrones temporales en el tráfico marítimo

---

## 🎓 Para Profundizar en Casa

### Sobre Índices Espectrales
- ¿Qué mide exactamente el NDVI y por qué es útil?
- ¿Cuándo usar SAVI en lugar de NDVI?
- ¿Para qué sirve el MNDWI?

### Sobre DEM y Topografía
- ¿Qué es SRTM y cuál es su resolución?
- ¿Cómo se calcula la pendiente a partir de elevación?
- ¿Qué aplicaciones tienen los datos de aspecto?

### Sobre Nuevos Datasets
- ¿Cómo funciona el radar SAR?
- ¿Qué ventajas tiene sobre datos ópticos?
- ¿Cómo se capturan los datos de luminosidad nocturna?

---

## 🎯 Preparación para el Día 3

El próximo día probablemente trabajaremos con:
- Series temporales y análisis de cambios
- Clasificación de imágenes
- Exportación de resultados
- Proyectos personalizados

---

## 🎉 ¡Sigamos aprendiendo!

Hoy cubriremos mucho contenido. No te preocupes si no entiendes todo a la primera - lo importante es practicar y experimentar. Los scripts estarán disponibles para que sigas practicando después de clase.
