// ============================================================================
// SCRIPT: ANÁLISIS FENOLÓGICO CON NDVI MULTIESTACIONAL
// ============================================================================
// Este script utiliza composites de NDVI de 32 días para crear una imagen
// multiestacional RGB donde cada color representa la época del año en que
// la vegetación alcanza su máxima actividad fotosintética

// ----------------------------------------------------------------------------
// 1. CONFIGURACIÓN INICIAL
// ----------------------------------------------------------------------------

// Año de análisis
var year = 2024;

// Colección de composites de NDVI de Landsat (cada 32 días)
var coleccionNDVI = 'LANDSAT/COMPOSITES/C02/T1_L2_32DAY_NDVI';

// Umbral de NDVI para enmascarar (solo vegetación activa)
var umbralNDVI = 0.20;

// ----------------------------------------------------------------------------
// 2. DEFINICIÓN DE ESTACIONES
// ----------------------------------------------------------------------------

// Definir los rangos de fechas para cada estación del año
var estaciones = {
  invierno: {inicio: year + '-01-01', fin: year + '-03-31', nombre: 'invierno'},
  primavera: {inicio: year + '-04-01', fin: year + '-06-30', nombre: 'primavera'},
  verano: {inicio: year + '-07-01', fin: year + '-09-30', nombre: 'verano'},
  otono: {inicio: year + '-10-01', fin: year + '-12-31', nombre: 'otono'}
};

// ----------------------------------------------------------------------------
// 3. FUNCIÓN PARA CALCULAR NDVI MÁXIMO POR ESTACIÓN
// ----------------------------------------------------------------------------

/**
 * Calcula el NDVI máximo para una estación específica
 * El máximo representa el momento de mayor actividad vegetativa
 * @param {Object} estacion - Objeto con inicio, fin y nombre de la estación
 * @returns {ee.Image} - Imagen con el NDVI máximo de la estación
 */
function calcularNDVIEstacion(estacion) {
  return ee.ImageCollection(coleccionNDVI)
    .filterDate(estacion.inicio, estacion.fin)
    .select('NDVI')
    .max()  // Máximo NDVI del período
    .rename(estacion.nombre);  // Renombrar con el nombre de la estación
}

// ----------------------------------------------------------------------------
// 4. CALCULAR NDVI PARA CADA ESTACIÓN DEL AÑO
// ----------------------------------------------------------------------------

var ndvi_invierno = calcularNDVIEstacion(estaciones.invierno);
var ndvi_primavera = calcularNDVIEstacion(estaciones.primavera);
var ndvi_verano = calcularNDVIEstacion(estaciones.verano);
var ndvi_otono = calcularNDVIEstacion(estaciones.otono);

// ----------------------------------------------------------------------------
// 5. CONCATENAR ESTACIONES EN UNA IMAGEN MULTIBANDA
// ----------------------------------------------------------------------------

// Combinar las 4 estaciones en una sola imagen
// Cada banda representa una estación del año
var imagenMultiestacional = ee.Image.cat([
  ndvi_invierno,
  ndvi_primavera, 
  ndvi_verano,
  ndvi_otono
]).clip(geometry);

print('Imagen multiestacional:', imagenMultiestacional);

// ----------------------------------------------------------------------------
// 6. CREAR VERSIÓN ENMASCARADA (SOLO VEGETACIÓN ACTIVA)
// ----------------------------------------------------------------------------

// Calcular el NDVI medio anual para usar como criterio de enmascaramiento
var ndviMedioAnual = imagenMultiestacional.reduce(ee.Reducer.mean());

// Crear máscara: solo píxeles con NDVI medio > umbral
var mascara = ndviMedioAnual.gt(umbralNDVI);

// Aplicar la máscara a la imagen multiestacional
var imagenMultiestacionalMasked = imagenMultiestacional.updateMask(mascara);

// ----------------------------------------------------------------------------
// 7. VISUALIZACIÓN EN EL MAPA
// ----------------------------------------------------------------------------

// Centrar el mapa en el área de estudio
Map.centerObject(geometry, 9);

// Parámetros de visualización
// min y max definen el rango de NDVI a visualizar
var parametrosVis = {
  min: 0.1, 
  max: 0.7,
  // RGB = Invierno(R), Primavera(G), Verano(B)
  bands: ['invierno', 'primavera', 'verano']
};

// Añadir capas al mapa
Map.addLayer(imagenMultiestacional, parametrosVis, 
  'NDVI ' + year + ' - Multiestacional');
Map.addLayer(imagenMultiestacionalMasked, {min: 0.25, max: 0.7, bands: ['invierno', 'primavera', 'verano']}, 
  'NDVI ' + year + ' - Multiestacional (enmascarado)');

// Añadir geometría de referencia
Map.addLayer(geometry, {color: 'red', opacity: 0.3}, 'Área de estudio');

// ----------------------------------------------------------------------------
// 8. INTERPRETACIÓN DE COLORES
// ----------------------------------------------------------------------------

print('=== INTERPRETACIÓN DE COLORES ===');
print('Rojo: Vegetación más activa en INVIERNO');
print('Verde: Vegetación más activa en PRIMAVERA');
print('Azul: Vegetación más activa en VERANO');
print('Cian: Vegetación activa en PRIMAVERA y VERANO');
print('Magenta: Vegetación activa en INVIERNO y VERANO');
print('Amarillo: Vegetación activa en INVIERNO y PRIMAVERA');
print('Blanco: Vegetación activa todo el año');

