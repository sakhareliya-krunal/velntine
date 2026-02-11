(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const layerId = "heartRainLayer";

  if (prefersReducedMotion || document.getElementById(layerId)) {
    return;
  }

  const layer = document.createElement("div");
  layer.id = layerId;
  layer.className = "heart-rain-layer";
  layer.setAttribute("aria-hidden", "true");
  document.body.prepend(layer);

  const particleCount = Math.min(50, Math.max(30, Math.floor(window.innerWidth / 34)));
  const hearts = [];
  let viewportWidth = window.innerWidth;
  let viewportHeight = window.innerHeight;
  let lastTime = performance.now();

  const rand = (min, max) => min + Math.random() * (max - min);

  const resetHeart = (heart, startAbove = false) => {
    // Recycle particles instead of creating/removing nodes for smooth 60fps updates.
    heart.x = rand(0, viewportWidth);
    heart.y = startAbove ? rand(-viewportHeight, viewportHeight) : rand(-180, -40);
    heart.scale = rand(0.45, 1.3);
    heart.speed = rand(26, 94);
    heart.drift = rand(-14, 14);
    heart.rotation = rand(0, 360);
    heart.rotationSpeed = rand(-22, 22);
    heart.opacity = rand(0.28, 0.85);
  };

  for (let i = 0; i < particleCount; i += 1) {
    const node = document.createElement("span");
    node.className = "heart-drop";
    layer.appendChild(node);

    const heart = { node };
    resetHeart(heart, true);
    hearts.push(heart);
  }

  const onResize = () => {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
  };

  const tick = (now) => {
    const delta = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    for (let i = 0; i < hearts.length; i += 1) {
      const heart = hearts[i];
      heart.y += heart.speed * delta;
      heart.x += heart.drift * delta;
      heart.rotation += heart.rotationSpeed * delta;

      if (heart.y > viewportHeight + 26 || heart.x < -40 || heart.x > viewportWidth + 40) {
        resetHeart(heart);
      }

      // Transform + opacity updates are GPU-friendly and avoid layout thrashing.
      heart.node.style.transform = `translate3d(${heart.x.toFixed(2)}px, ${heart.y.toFixed(2)}px, 0) scale(${heart.scale.toFixed(3)}) rotate(${heart.rotation.toFixed(2)}deg)`;
      heart.node.style.opacity = heart.opacity.toFixed(2);
    }

    window.requestAnimationFrame(tick);
  };

  window.addEventListener("resize", onResize, { passive: true });
  window.requestAnimationFrame(tick);
})();
