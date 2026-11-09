# Changelog

Todos los cambios notables de Pliego se documentan aquí.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).

## [1.1.8] — 2026-11-09

### Añadido
- 

### Cambiado
- 

### Corregido
- 

## [1.1.7] — 2026-11-02

### Cambiado
- **Guardar PDF da exactamente lo que se ve en pantalla:** el guardado usa el mismo código de dibujo que la pantalla
- Los textos añadidos usan Arial en pantalla y en el PDF (incrustada, solo con las letras usadas)
- Las páginas giradas se guardan vectoriales: el texto original sigue siendo seleccionable y nítido

### Corregido
- Guardar fallaba si había un texto girado
- El texto quedaba más abajo en el PDF y con otro espaciado entre letras
- Rectángulos, imágenes, firmas, resaltados y tapados girados se guardaban girados al revés
- El tachado quedaba a otra altura; el dibujo a mano y las líneas tenían las uniones cortadas
- La marca de agua y los valores de formulario cambiaban de tamaño y posición al guardar
- **Dividir** y **Extraer páginas** no incluían los cambios hechos en Pliego
- Las anotaciones se desplazaban en páginas con zona de recorte (CropBox)

## [1.1.6] — 2026-11-02

### Añadido
- **Panel de propiedades:** al seleccionar un elemento con Mover (o con clic derecho), el panel derecho permite editarlo
  - Texto: tamaño de letra, negrita, cursiva, color y rotación
  - Rectángulo y círculo: color y grosor del borde, relleno y su color, rotación
  - Línea y flecha: color, grosor y convertir una en la otra
  - Dibujo a mano: color y grosor · Resaltado y tapado: color · Subrayado/tachado: color y tipo
  - Imagen y firma: rotación
- La negrita y la cursiva de los textos se conservan en el PDF guardado

## [1.1.5] — 2026-11-02

### Añadido
- **Caja de texto:** en la herramienta Texto, clic para escribir o arrastrar para crear una caja con ajuste de línea. **Shift+Enter** hace un salto de línea, **Enter** termina y **Esc** cancela
- Corregir un texto ya puesto: clic sobre él con Texto, doble clic con Mover o **Editar texto** en el menú
- **Menú contextual (clic derecho)** en formas, textos, dibujos, imágenes y firmas: Cortar, Copiar, Pegar, Duplicar, Traer al frente, Enviar al fondo y Eliminar. En una zona vacía, **Pegar aquí**
- Atajos **Ctrl+C**, **Ctrl+X**, **Ctrl+V** y **Ctrl+D** (duplicar); se puede pegar en otra página

### Cambiado
- El texto se escribe directamente sobre la página, en lugar de en una ventana aparte; el tamaño de letra está en el panel de la herramienta

### Corregido
- Las líneas y flechas no se podían mover con la herramienta Mover

## [1.1.4] — 2026-11-02

### Añadido
- **Relleno en formas:** el rectángulo y el círculo pueden ir rellenos de un color sólido, distinto o igual al del borde
- **Color personalizado** en todas las paletas: Dibujo, Resaltar, Texto, Formas, Marcado, Tapar datos, Editar texto, Marca de agua, Números de página, Firma y Ajustes. Se recuerdan los últimos 5 colores personalizados
- Color en Editar texto, Marca de agua y Números de página, que antes eran fijos

### Corregido
- El color seleccionado se distingue también con el tema claro

## [1.1.3] — 2026-10-26

### Añadido
- **Ajustes → Actualizaciones:** versión instalada, botón **Buscar actualizaciones**, estado de la búsqueda y de la descarga, y botón **Reiniciar** cuando hay una versión lista

### Cambiado
- La pantalla de inicio tiene una barra de carga que sigue la carga real de la app; la app se abre cuando llega al 100 %
- Los avisos de actualización siguen el idioma elegido (ES/EN)

### Corregido
- Ya no se ve la ventana de la app, vacía y a pantalla completa, detrás de la pantalla de inicio cuando se cerró maximizada
- El aviso con **Reiniciar** acepta clics

## [1.1.2] — 2026-10-26

### Corregido
- El botón **Reiniciar** de la actualización instala en silencio y vuelve a abrir Pliego; antes abría el asistente completo del instalador y la app no se reabría

## [1.1.1] — 2026-10-26

### Añadido
- `inicio.log` registra cada búsqueda de actualizaciones y cuando no hay ninguna nueva

### Corregido
- `npm run version:*` ahora actualiza también la versión de `package-lock.json`

## [1.1.0] — 2026-10-26

### Añadido
- Sistema de auto-actualización con `electron-updater` + GitHub Releases
- Toast persistente en la app cuando hay una actualización descargada y lista
- Script `npm run version:patch/minor/major` para gestionar versiones semánticas
- Script `npm run release` para compilar y publicar un release a GitHub
- `CHANGELOG.md` para registro de cambios

### Cambiado
- Splash screen: reemplazado video VP9+yuva420p por animación CSS pura
- Splash window: eliminado `transparent:true` → desaparece el flash negro en Windows (DWM bug)
- Splash window: `backgroundColor:'#0d1018'` — ventana sólida sin parpadeo al crear
- Splash definitivo: diseño plano con los tokens de la app, sigue el tema claro/oscuro y el idioma ES/EN, indicador de carga indeterminado, respeta "reducir animaciones"
- El splash se desvanece cuando la app ya está visible (antes quedaba un rectángulo vacío)
- Eliminados los videos `.webm` y `splash-player.js`, que ya no se usaban

### Corregido
- Pantalla completa negra al abrir la app en Windows (DWM compositor bug con `transparent:true`)
- Video VP9 no decodificaba correctamente en ciertos drivers GPU

## [1.0.0] — 2026-10-01

### Añadido
- Editor de PDF con soporte para múltiples páginas
- Herramientas: Mover, Dibujar, Resaltar, Texto, Formas, Editar, Redactar, Firmar, Form, Info, Watermark, Merge, Photo, Img→PDF, Print, Page numbers, Bookmarks, Page→PNG
- Splash screen animado al inicio
- Ventana sin marco nativo con controles personalizados (minimizar/maximizar/cerrar)
- Soporte multilenguaje (ES/EN)
- Tema claro/oscuro
- Archivos recientes
- Drag & drop de PDF e imágenes
- Conversión de imágenes JPG/PNG a PDF
- Gestión de marcadores
- División de páginas
- Selección por lote (extraer/eliminar)
- Firma digital básica
- Numeración de páginas
- Marca de agua
- Formularios PDF
