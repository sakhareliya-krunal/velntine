(() => {
  const ACCEPTED_KEY = "valentineAccepted";
  const SESSION_KEY = "valentineAcceptedSession";
  const WINDOW_FLAG = "valentineAccepted=true";
  const container = document.getElementById("container");
  const noBtn = document.getElementById("noBtn");
  const yesBtn = document.getElementById("yesBtn");
  const noAnchor = document.getElementById("noAnchor");
  const cuteMessage = document.getElementById("cuteMessage");
  const yesScreen = document.getElementById("yesScreen");
  const closeYesScreen = document.getElementById("closeYesScreen");
  const questionCard = document.getElementById("questionCard");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const shouldMoveNoButton = !reducedMotion;
  const pointer3DEnabled = !reducedMotion && !coarsePointer;

  if (!container || !noBtn || !yesBtn || !noAnchor) {
    return;
  }

  const messages = [
    "Are you sure? 🥺",
    "Think again 😘",
    "I will wait forever ❤️",
    "Still no? I can keep running 💕",
  ];

  let messageIndex = 0;
  let noScale = 1;
  let yesScale = 1;
  const noMinScale = 0.5;
  const yesMaxScale = 2;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const params = new URLSearchParams(window.location.search);

  const bindTilt = (element, maxTilt = 9) => {
    if (!element || !pointer3DEnabled) {
      return;
    }

    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * (maxTilt * 2);
      const rotateX = (0.5 - y) * (maxTilt * 2);
      element.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`;
    });

    element.addEventListener("pointerleave", () => {
      element.style.transform = "";
    });
  };

  const setAccepted = () => {
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

  const isAccepted = () => {
    let localAccepted = false;
    let sessionAccepted = false;

    try {
      localAccepted = window.localStorage.getItem(ACCEPTED_KEY) === "true";
    } catch (_) {}

    try {
      sessionAccepted = window.sessionStorage.getItem(SESSION_KEY) === "true";
    } catch (_) {}

    const windowAccepted = window.name.includes(WINDOW_FLAG);
    return localAccepted || sessionAccepted || windowAccepted;
  };

  const showNotice = (message) => {
    const oldToast = document.querySelector(".notice-toast");
    if (oldToast) {
      oldToast.remove();
    }

    const toast = document.createElement("div");
    toast.className = "notice-toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 260);
    }, 2200);
  };

  const showYesScreen = () => {
    if (!yesScreen) {
      return;
    }
    yesScreen.classList.add("show");
    yesScreen.setAttribute("aria-hidden", "false");
    if (questionCard) {
      questionCard.style.visibility = "hidden";
    }
    noBtn.style.display = "none";
  };

  const hideYesScreen = () => {
    if (!yesScreen) {
      return;
    }
    yesScreen.classList.remove("show");
    yesScreen.setAttribute("aria-hidden", "true");
    if (questionCard) {
      questionCard.style.visibility = "visible";
    }
    noBtn.style.display = "inline-flex";
  };

  const getBounds = () => {
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;

    const maxX = Math.max(0, containerWidth - btnWidth);
    const maxY = Math.max(0, containerHeight - btnHeight);

    return { maxX, maxY };
  };

  const placeNoAtAnchor = () => {
    const containerRect = container.getBoundingClientRect();
    const anchorRect = noAnchor.getBoundingClientRect();
    const { maxX, maxY } = getBounds();

    const x = clamp(anchorRect.left - containerRect.left, 0, maxX);
    const y = clamp(anchorRect.top - containerRect.top, 0, maxY);

    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
    noBtn.style.transform = `scale(${noScale})`;
  };

  const moveNoButton = () => {
    if (!shouldMoveNoButton) {
      return;
    }

    const { maxX, maxY } = getBounds();

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    noScale = Math.max(noMinScale, noScale - 0.05);
    yesScale = Math.min(yesMaxScale, yesScale + 0.07);

    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
    noBtn.style.transform = `scale(${noScale})`;
    yesBtn.style.transform = `scale(${yesScale})`;

    if (cuteMessage) {
      cuteMessage.textContent = messages[messageIndex % messages.length];
      messageIndex += 1;
    }
  };

  const keepInsideOnResize = () => {
    const { maxX, maxY } = getBounds();
    const currentX = Number.parseFloat(noBtn.style.left) || 0;
    const currentY = Number.parseFloat(noBtn.style.top) || 0;

    noBtn.style.left = `${clamp(currentX, 0, maxX)}px`;
    noBtn.style.top = `${clamp(currentY, 0, maxY)}px`;
  };

  placeNoAtAnchor();
  bindTilt(questionCard, 8);
  bindTilt(yesScreen?.querySelector(".yes-card"), 7);

  if (params.get("notice") === "answer") {
    showNotice("Please answer the question first.");
    const cleanUrl = `${window.location.pathname}`;
    window.history.replaceState({}, "", cleanUrl);
  }

  if (noBtn.dataset.boundClick !== "true") {
    noBtn.dataset.boundClick = "true";
    noBtn.addEventListener("click", (event) => {
      event.preventDefault();
      noBtn.dataset.movedYet = "true";
      moveNoButton();
    });
  }

  if (shouldMoveNoButton && coarsePointer && noBtn.dataset.boundTouch !== "true") {
    noBtn.dataset.boundTouch = "true";
    noBtn.addEventListener("touchstart", (event) => {
      event.preventDefault();
      noBtn.dataset.movedYet = "true";
      moveNoButton();
    });
  }

  if (shouldMoveNoButton && noBtn.dataset.boundHover !== "true") {
    noBtn.dataset.boundHover = "true";
    if (!coarsePointer) {
      noBtn.addEventListener("mouseenter", moveNoButton);
    }
  }

  if (yesBtn.dataset.boundClick !== "true") {
    yesBtn.dataset.boundClick = "true";
    yesBtn.addEventListener("click", (event) => {
      event.preventDefault();
      if (yesBtn.dataset.redirecting === "true") {
        return;
      }

      yesBtn.dataset.redirecting = "true";
      setAccepted();
      showYesScreen();
      yesBtn.dataset.redirecting = "false";
    });
  }

  if (closeYesScreen && closeYesScreen.dataset.boundClick !== "true") {
    closeYesScreen.dataset.boundClick = "true";
    closeYesScreen.addEventListener("click", (event) => {
      event.preventDefault();
      hideYesScreen();
    });
  }

  document.querySelectorAll('.site-nav .nav-link[href="story.html"], .site-nav .nav-link[href="moment.html"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const accepted = isAccepted();
      if (accepted) {
        return;
      }

      event.preventDefault();
      showNotice("Please answer the question first.");
    });
  });

  window.addEventListener("resize", () => {
    if (!shouldMoveNoButton) {
      placeNoAtAnchor();
      return;
    }

    if (!noBtn.dataset.movedYet) {
      placeNoAtAnchor();
      return;
    }
    keepInsideOnResize();
  });
})();
