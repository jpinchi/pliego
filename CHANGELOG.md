# Changelog

Todos los cambios notables de Pliego se documentan aquí.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).

## [1.1.3] — 2026-10-26

### Añadido
- 

### Cambiado
- 

### Corregido
- 

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
