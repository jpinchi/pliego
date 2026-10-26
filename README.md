<div align="center">

<picture>
  <source media="(max-width: 600px)" srcset="https://raw.githubusercontent.com/jpinchi/pliego/main/docs/readme/banner-m.svg" />
  <img src="docs/banner.svg" alt="Pliego — editor de PDF de escritorio para Windows, sin servidores, sin suscripción, sin límites" width="100%" />
</picture>

<br/>

[![Electron](https://img.shields.io/badge/Electron-31-47848F?style=flat-square&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Plataforma](https://img.shields.io/badge/Windows-10%2F11-0078D4?style=flat-square&logo=windows&logoColor=white)](https://github.com/jpinchi/pliego/releases)
[![Versión](https://img.shields.io/github/v/release/jpinchi/pliego?style=flat-square&label=versi%C3%B3n&color=f0a020)](https://github.com/jpinchi/pliego/releases/latest)
[![Licencia](https://img.shields.io/badge/licencia-MIT-46c08a?style=flat-square)](LICENSE)
[![100% Offline](https://img.shields.io/badge/100%25-offline-8a909e?style=flat-square)](#seguridad)

<br/>

<a href="https://github.com/jpinchi/pliego/releases/download/v1.1.3/Pliego-Setup-1.1.3.exe"><img src="https://img.shields.io/badge/Descargar_instalador_v1.1.3-f0a020?style=for-the-badge&logo=windows&logoColor=1a1206&labelColor=f0a020&color=f0a020" alt="Descargar el instalador de la versión 1.1.3" /></a>
<a href="https://github.com/jpinchi/pliego/releases/download/v1.1.3/Pliego-1.1.3.exe"><img src="https://img.shields.io/badge/Versi%C3%B3n_portable-1c2128?style=for-the-badge&logo=windows&logoColor=white" alt="Descargar la versión portable 1.1.3" /></a>
<a href="#funciones"><img src="https://img.shields.io/badge/Ver_funciones-1c2128?style=for-the-badge&logo=googledocs&logoColor=f0a020" alt="Ver funciones" /></a>

</div>

<br/>

<a id="que-es"></a>

<picture>
  <source media="(max-width: 600px)" srcset="https://raw.githubusercontent.com/jpinchi/pliego/main/docs/readme/h-que-es-m.svg" />
  <img src="docs/readme/h-que-es.svg" alt="01 · ¿Qué es Pliego?" width="100%" />
</picture>

Pliego es una app de escritorio que te permite **editar, firmar y anotar PDFs** directamente en tu PC con Windows, sin subir tus documentos a ningún servidor. Funciona completamente sin conexión a internet y no requiere cuenta ni suscripción. La única conexión que hace es consultar GitHub Releases para saber si hay una versión nueva; no envía nada de tus documentos ni datos de uso. Está pensada para cualquiera que trabaje con documentos PDF a diario: formularios, contratos, reportes o presentaciones.

<picture>
  <source media="(max-width: 600px)" srcset="https://raw.githubusercontent.com/jpinchi/pliego/main/docs/readme/pilares-m.svg" />
  <img src="docs/readme/pilares.svg" alt="100% offline, sin internet · 0 cuentas o servidores · Gratis, sin suscripción ni límites · Interfaz bilingüe ES / EN" width="100%" />
</picture>

<br/><br/>

<a id="galeria"></a>

<picture>
  <source media="(max-width: 600px)" srcset="https://raw.githubusercontent.com/jpinchi/pliego/main/docs/readme/h-galeria-m.svg" />
  <img src="docs/readme/h-galeria.svg" alt="02 · Galería" width="100%" />
</picture>

<picture>
  <source media="(max-width: 600px)" srcset="https://raw.githubusercontent.com/jpinchi/pliego/main/docs/readme/galeria-m.svg" />
  <img src="docs/readme/galeria.svg" alt="Capturas de Pliego que se alternan: pantalla principal, anotaciones, panel de firma y tema claro" width="100%" />
</picture>

<details>
<summary><b>Ver las capturas en tamaño completo</b></summary>

<br/>

| Vista | Descripción |
|---|---|
| ![Pantalla principal](docs/screenshots/main-dark.png) | **Pantalla principal** — un PDF anotado y firmado, con el panel de herramientas y las páginas |
| ![Herramientas de anotación](docs/screenshots/annotations.png) | **Anotaciones** — resaltado, formas, dibujo a mano y texto sobre el documento |
| ![Panel de firma](docs/screenshots/signature.png) | **Firma digital** — tres modos: escribir, dibujar o insertar imagen |
| ![Tema claro](docs/screenshots/main-light.png) | **Tema claro** — alternativa para ambientes con luz natural |

> Las capturas están en [`docs/screenshots/`](docs/screenshots/). Para regenerarlas: `npm install` y luego `node docs/screenshots/capture.mjs`.

</details>

<br/>

<a id="funciones"></a>

<picture>
  <source media="(max-width: 600px)" srcset="https://raw.githubusercontent.com/jpinchi/pliego/main/docs/readme/h-funciones-m.svg" />
  <img src="docs/readme/h-funciones.svg" alt="03 · Funciones" width="100%" />
</picture>

<picture>
  <source media="(max-width: 600px)" srcset="https://raw.githubusercontent.com/jpinchi/pliego/main/docs/readme/funciones-m.svg" />
  <img src="docs/readme/funciones.svg" alt="Funciones: anotaciones, firma digital, edición de texto, formularios AcroForm, tapar datos sensibles, organización de páginas, marca de agua, marcadores y numeración, búsqueda, metadatos, imprimir y exportar a PNG, tema claro u oscuro y bilingüe español e inglés" width="100%" />
</picture>

<br/><br/>

<a id="instalacion"></a>

<picture>
  <source media="(max-width: 600px)" srcset="https://raw.githubusercontent.com/jpinchi/pliego/main/docs/readme/h-instalacion-m.svg" />
  <img src="docs/readme/h-instalacion.svg" alt="04 · Instalación" width="100%" />
</picture>

**Versión actual: 1.1.3** · [Novedades](https://github.com/jpinchi/pliego/releases/tag/v1.1.3) · [Historial de cambios](CHANGELOG.md)

### Opción A — Instalador (recomendado)

1. Ve a la [**última versión**](https://github.com/jpinchi/pliego/releases/latest)
2. Descarga `Pliego-Setup-1.1.3.exe`
3. Ejecuta el instalador y sigue los pasos. No necesita permisos de administrador: se instala solo para tu usuario
4. Abre Pliego desde el menú Inicio o el acceso directo del escritorio

> El instalador no está firmado digitalmente. Si Windows muestra **"Windows protegió su PC"**, pulsa **Más información → Ejecutar de todas formas**.

### Opción B — Versión portable (sin instalar)

1. Descarga `Pliego-1.1.3.exe` desde la [**última versión**](https://github.com/jpinchi/pliego/releases/latest)
2. Ejecuta directamente — no necesita instalación ni permisos de administrador

> La versión portable no se actualiza sola: para tener una versión nueva, descárgala otra vez.

### Actualizaciones

La versión instalada se mantiene al día sola:

- Al abrirse, Pliego busca en segundo plano si hay una versión nueva y la descarga sin interrumpirte.
- Cuando está lista aparece un aviso con el botón **Reiniciar**: instala en silencio y vuelve a abrir Pliego. Si prefieres seguir trabajando, se instala sola al cerrar la app.
- También puedes buscar cuando quieras en **Ajustes → Actualizaciones → Buscar actualizaciones**, donde además ves la versión instalada.

> Si tienes la **1.0.0**, instala la 1.1.3 a mano una vez: esa versión no tenía actualizador. Desde la **1.1.0, 1.1.1 o 1.1.2**, el botón Reiniciar del aviso no responde; cierra Pliego y la actualización se instalará al salir.

### Opción C — Ejecutar desde el código fuente

```bash
git clone https://github.com/jpinchi/pliego.git
cd pliego
npm install
npm start
```

Para generar el instalador `.exe`:

```bash
npm run dist:win
```

> Requiere [Node.js 20.9+](https://nodejs.org) y [Git](https://git-scm.com/).

### Publicar una versión nueva

1. `npm run version:patch` (o `version:minor` / `version:major`): sube la versión en `package.json` y `package-lock.json`, añade la sección en `CHANGELOG.md` y hace el commit.
2. Completa la sección nueva del `CHANGELOG.md` y haz commit.
3. `npm run dist:win` y publica en GitHub Releases el instalador, el `.blockmap` y `latest.yml`. Los archivos deben llamarse con guiones (`Pliego-Setup-X.Y.Z.exe`), que es el nombre que busca `latest.yml`. `npm run release` lo hace todo de una vez si tienes `GH_TOKEN` en el entorno.

Las apps instaladas encuentran la versión nueva leyendo `latest.yml` de la última release. Cada arranque, y cada búsqueda de actualizaciones, queda registrado en `%APPDATA%\pliego\logs\inicio.log`.

<br/>

<a id="como-funciona"></a>

<picture>
  <source media="(max-width: 600px)" srcset="https://raw.githubusercontent.com/jpinchi/pliego/main/docs/readme/h-como-funciona-m.svg" />
  <img src="docs/readme/h-como-funciona.svg" alt="05 · Cómo funciona" width="100%" />
</picture>

<picture>
  <source media="(max-width: 600px)" srcset="https://raw.githubusercontent.com/jpinchi/pliego/main/docs/readme/flujo-m.svg" />
  <img src="docs/readme/flujo.svg" alt="Flujo: abres un PDF, main.js muestra el diálogo nativo, la interfaz (pliego-pdf.html) usa pdf.js para dibujar las páginas y un canvas para anotar y firmar, pdf-lib arma el PDF final y will-download abre el diálogo Guardar como. La interfaz corre en un sandbox y todo ocurre en tu PC." width="100%" />
</picture>

<picture>
  <source media="(max-width: 600px)" srcset="https://raw.githubusercontent.com/jpinchi/pliego/main/docs/readme/tecnologias-m.svg" />
  <img src="docs/readme/tecnologias.svg" alt="Tecnologías: Electron 31, pdf.js 3.11, pdf-lib 1.17, electron-builder 24, JavaScript vanilla, HTML5 y CSS" width="100%" />
</picture>

> **Sin frameworks de UI.** Todo el renderer es HTML + CSS + JavaScript vanilla en un único archivo (`renderer/pliego-pdf.html`). Menos dependencias, arranque más rápido. El ícono multi-resolución se genera con sharp + png-to-ico, y las actualizaciones automáticas usan electron-updater con GitHub Releases.

<br/>

<a id="retos"></a>

<picture>
  <source media="(max-width: 600px)" srcset="https://raw.githubusercontent.com/jpinchi/pliego/main/docs/readme/h-retos-m.svg" />
  <img src="docs/readme/h-retos.svg" alt="06 · Retos y decisiones" width="100%" />
</picture>

**1. Rotación de páginas y coordenadas de anotaciones**
Los PDFs pueden tener rotación intrínseca en sus metadatos (`/Rotate 90`). Si se dibujan anotaciones en coordenadas de pantalla y luego se aplican al PDF sin corregir, los elementos aparecen desplazados o girados. La solución: al guardar, cualquier página con rotación ≠ 0 se rasteriza a canvas con la orientación visual correcta y se reemplaza por una página nueva con rotación 0. Las anotaciones se dibujan sobre esta página normalizada, lo que garantiza que coordenadas 0-1 sean siempre fiables.

**2. Resize de formas rotadas**
Al redimensionar una figura ya rotada, el punto del cursor (en espacio de pantalla) tiene que deshacerse del ángulo de la figura antes de calcular el nuevo ancho/alto. Esto se resuelve aplicando la inversa de la rotación al cursor alrededor del centro inicial del shape (`rotatePointAround(px, py, cx, cy, -rot)`), convirtiendo el problema rotado en uno alineado con los ejes antes de hacer el delta.

**3. Proceso principal aislado del renderer**
El renderer corre en un sandbox estricto (`sandbox:true`, `nodeIntegration:false`). Para acceder al sistema de archivos, todo pasa por `contextBridge` → IPC → proceso principal. Esto evita que un PDF malicioso pueda ejecutar código Node incluso si lograra inyectar scripts en el renderer.

**4. Bookmarks / tabla de contenidos en pdf-lib**
pdf-lib no tiene una API de alto nivel para `/Outlines`. La solución fue escribir directamente el árbol de objetos del catálogo PDF: cada marcador es un `PDFDict` con referencias `Prev`/`Next`/`Parent`/`First`/`Last` resueltas manualmente, y el array `Dest` apunta al `PDFRef` de la página destino. Rodeado de try/catch para que un fallo no corrompa el PDF completo.

<br/>

<a id="seguridad"></a>

<picture>
  <source media="(max-width: 600px)" srcset="https://raw.githubusercontent.com/jpinchi/pliego/main/docs/readme/h-seguridad-m.svg" />
  <img src="docs/readme/h-seguridad.svg" alt="07 · Calidad y seguridad" width="100%" />
</picture>

<picture>
  <source media="(max-width: 600px)" srcset="https://raw.githubusercontent.com/jpinchi/pliego/main/docs/readme/seguridad-m.svg" />
  <img src="docs/readme/seguridad.svg" alt="Sandbox estricto (sandbox: true); navegación bloqueada (will-navigate); sin telemetría, 100% offline; XSS mitigado con escapeHtml(); una sola instancia con requestSingleInstanceLock()" width="100%" />
</picture>

> **Sobre la conexión:** tus documentos nunca salen de tu PC. La única petición de red es la búsqueda de actualizaciones en GitHub Releases (al abrir la app o desde Ajustes), que descarga `latest.yml` y, si hay versión nueva, el instalador. No se envían datos de uso.

<br/><br/>

<a id="proximos"></a>

<picture>
  <source media="(max-width: 600px)" srcset="https://raw.githubusercontent.com/jpinchi/pliego/main/docs/readme/h-proximos-m.svg" />
  <img src="docs/readme/h-proximos.svg" alt="08 · Próximos pasos" width="100%" />
</picture>

- [ ] Soporte para anotaciones de comentario (sticky notes con hilo de respuestas)
- [ ] Firma con certificado digital (PKCS#12)

<br/>

<picture>
  <source media="(max-width: 600px)" srcset="https://raw.githubusercontent.com/jpinchi/pliego/main/docs/readme/pie-m.svg" />
  <img src="docs/readme/pie.svg" alt="Pliego · Hecho con Electron, pdf.js y pdf-lib · MIT · Josue Mejias" width="100%" />
</picture>

<div align="center">

[Licencia MIT](LICENSE) · [github.com/jpinchi](https://github.com/jpinchi)

</div>

<details>
<summary>🇺🇸 English summary</summary>

**Pliego** is a Windows desktop PDF editor built with Electron 31. It lets you annotate, sign, redact, fill forms, add watermarks, manage bookmarks and page numbers — all offline, no account or subscription required. The renderer is a single vanilla-JS HTML file using pdf.js for rendering and pdf-lib for generating the output PDF. Current version: **1.1.3** — download `Pliego-Setup-1.1.3.exe` from the [latest release](https://github.com/jpinchi/pliego/releases/latest) or clone and run with `npm install && npm start`. The installed app updates itself from GitHub Releases (the only network request it makes; your documents never leave your PC), and you can also check manually in **Settings → Updates**.

</details>
