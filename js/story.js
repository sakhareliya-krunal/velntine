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

  if (!hasAccepted()) {
    window.location.replace("surprise.html?notice=answer");
    return;
  }

  persistAccepted();

  if (params.get("unlocked") === "1") {
    window.history.replaceState({}, "", window.location.pathname);
  }

  const sparkles = document.getElementById("sparkles");
  const playMusicButton = document.getElementById("playMusic");
  const bgMusic = document.getElementById("bgMusic");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const pointer3DEnabled = !reducedMotion && !coarsePointer;
  if (!sparkles) {
    return;
  }

  const bindTilt = (element, maxTilt = 8) => {
    if (!element || !pointer3DEnabled) {
      return;
    }

    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * (maxTilt * 2);
      const rotateX = (0.5 - y) * (maxTilt * 2);
      element.style.transform = `perspective(1400px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`;
    });

    element.addEventListener("pointerleave", () => {
      element.style.transform = "";
    });
  };

  document.querySelectorAll(".panel").forEach((panel, index) => {
    bindTilt(panel, index === 0 ? 7 : 10);
  });

  if (!reducedMotion) {
    for (let i = 0; i < 22; i += 1) {
      const dot = document.createElement("span");
      dot.className = "sparkle";
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.top = `${Math.random() * 100}%`;
      dot.style.animationDelay = `${Math.random() * 3}s`;
      dot.style.animationDuration = `${2.1 + Math.random() * 2.4}s`;
      sparkles.appendChild(dot);
    }
  }

  if (playMusicButton && bgMusic) {
    const syncMusicButton = () => {
      if (bgMusic.paused) {
        playMusicButton.textContent = "Play Our Song 🎶";
        playMusicButton.classList.remove("is-playing");
      } else {
        playMusicButton.textContent = "Pause Song ⏸";
        playMusicButton.classList.add("is-playing");
      }
    };

    playMusicButton.addEventListener("click", async () => {
      if (bgMusic.paused) {
        try {
          await bgMusic.play();
        } catch (_) {}
      } else {
        bgMusic.pause();
      }
      syncMusicButton();
    });

    bgMusic.addEventListener("play", syncMusicButton);
    bgMusic.addEventListener("pause", syncMusicButton);
    syncMusicButton();
  }
})();
