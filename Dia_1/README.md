# Día 1 - Introducción a Google Earth Engine

## 🎯 Objetivos del Día

- Familiarizarse con el entorno de Google Earth Engine
- Conocer el Code Editor y sus componentes
- Cargar y visualizar imágenes satelitales
- Entender la estructura de datos de Earth Engine

---

## 📝 Contenidos

### 1. Introducción al Ecosistema GEE

- ¿Qué es Google Earth Engine?
- Catálogo de datos
- Capacidades y casos de uso
- Configuración de la cuenta (ver [CONFIGURACION.md](../CONFIGURACION.md))

### 2. Earth Engine Code Editor

- Interfaz del editor
- Panel de scripts
- Consola
- Inspector
- Panel de mapas
- Assets

### 3. Primeros Pasos con JavaScript

- Variables y tipos de datos
- Objetos y diccionarios
- Listas
- Funciones básicas

### 4. Trabajo con Imágenes

- Cargar una imagen
- Visualización básica
- Parámetros de visualización
- Inspector de valores

---

## 💻 Scripts del Día

### Script 1: Hola Mundo GEE
```javascript
// Tu primer script en Earth Engine
print('Hola Google Earth Engine!');

// Cargar y visualizar una imagen
var imagen = ee.Image('USGS/SRTMGL1_003');
Map.centerObject(imagen, 4);
Map.addLayer(imagen, {min: 0, max: 3000}, 'Elevación SRTM');
```

### Script 2: [Añadir más scripts]

---

## 🔗 Recursos del Día

- [Documentación de JavaScript](https://developers.google.com/earth-engine/guides/getstarted)
- [Earth Engine Explorer](https://explorer.earthengine.google.com/)
- [Catálogo de Datos](https://developers.google.com/earth-engine/datasets)

---

## 📌 Notas y Comentarios

- [Espacio para notas durante la clase]

---

## ✅ Tareas / Ejercicios

1. 
2. 
3. 

---

## 📚 Para Profundizar

- [Enlaces adicionales]
- [Lecturas recomendadas]
