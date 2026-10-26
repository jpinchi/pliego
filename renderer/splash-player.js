// Reproduce el video splash y avisa al proceso principal por IPC.
(function () {
  const video = document.getElementById("v");
  const src   = document.getElementById("src");

  // El proceso principal pasa ?quiet=1 cuando prefersReducedMotion
  const quiet = new URLSearchParams(location.search).get("quiet") === "1";
  src.src = quiet ? "img/splash-quiet.webm" : "img/splash.webm";
  video.load();

  // Cuando está listo para reproducir → avisar al main para que muestre la ventana
  video.addEventListener("canplaythrough", function onReady() {
    video.removeEventListener("canplaythrough", onReady);
    if (window.splashBridge) window.splashBridge.ready();
    video.play().catch(() => {});
  }, { once: true });

  // Cuando termina → avisar al main para que cierre el splash y muestre la app
  video.addEventListener("ended", () => {
    if (window.splashBridge) window.splashBridge.done();
  }, { once: true });

  // Fallback: si no carga en 6 s, avisar igualmente
  setTimeout(() => {
    if (!video.readyState) {
      if (window.splashBridge) { window.splashBridge.ready(); window.splashBridge.done(); }
    }
  }, 6000);
})();
