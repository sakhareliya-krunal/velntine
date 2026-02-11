(() => {
  const ACCEPTED_KEY = "valentineAccepted";
  const SESSION_KEY = "valentineAcceptedSession";
  const WINDOW_FLAG = "valentineAccepted=true";
  const params = new URLSearchParams(window.location.search);

  const hasAccepted = () => {
    let localAccepted = false;
    let sessionAccepted = false;

    try {
      localAccepted = window.localStorage.getItem(ACCEPTED_KEY) === "true";
    } catch (_) {}

    try {
      sessionAccepted = window.sessionStorage.getItem(SESSION_KEY) === "true";
    } catch (_) {}

    const queryAccepted = params.get("unlocked") === "1";
    const windowAccepted = window.name.includes(WINDOW_FLAG);

    return localAccepted || sessionAccepted || queryAccepted || windowAccepted;
  };

  const persistAccepted = () => {
    try {
      window.localStorage.setItem(ACCEPTED_KEY, "true");
    } catch (_) {}

    try {
      window.sessionStorage.setItem(SESSION_KEY, "true");
    } catch (_) {}

    if (!window.name.includes(WINDOW_FLAG)) {
      window.name = `${window.name}|${WINDOW_FLAG}`;
    }
  };

  const accepted = hasAccepted();
  if (!accepted) {
    window.location.replace("surprise.html?notice=answer");
    return;
  }

  persistAccepted();

  if (params.get("unlocked") === "1") {
    window.history.replaceState({}, "", window.location.pathname);
  }

  const sparkles = document.getElementById("sparkles");
  const heartField = document.getElementById("heartField");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const pointer3DEnabled = !reducedMotion && !coarsePointer;

  if (!sparkles || !heartField) {
    return;
  }

  const bindTilt = (element, maxTilt = 10) => {
    if (!element || !pointer3DEnabled) {
      return;
    }

    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * (maxTilt * 2);
      const rotateX = (0.5 - y) * (maxTilt * 2);
      element.style.transform = `perspective(1400px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(12px)`;
    });

    element.addEventListener("pointerleave", () => {
      element.style.transform = "";
    });
  };

  bindTilt(document.querySelector(".love-card"), 11);

  const createSparkles = () => {
    const sparkleCount = 26;
    for (let i = 0; i < sparkleCount; i += 1) {
      const dot = document.createElement("span");
      dot.className = "sparkle";
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.top = `${Math.random() * 100}%`;
      dot.style.animationDelay = `${Math.random() * 3}s`;
      dot.style.animationDuration = `${2 + Math.random() * 2.2}s`;
      sparkles.appendChild(dot);
    }
  };

  const createHearts = () => {
    const heartCount = 22;
    for (let i = 0; i < heartCount; i += 1) {
      const heart = document.createElement("span");
      heart.className = "heart";
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.animationDelay = `${Math.random() * 8}s`;
      heart.style.animationDuration = `${10 + Math.random() * 8}s`;
      heart.style.opacity = `${0.5 + Math.random() * 0.45}`;
      heart.style.scale = `${0.7 + Math.random() * 0.9}`;
      heartField.appendChild(heart);
    }
  };

  if (!reducedMotion) {
    createSparkles();
    createHearts();
  }
})();
