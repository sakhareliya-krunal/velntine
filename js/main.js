(() => {
  const heartsContainer = document.getElementById("floatingHearts");
  const typingQuote = document.getElementById("typingQuote");
  const celebration = document.getElementById("celebration");
  const confettiCanvas = document.getElementById("confettiCanvas");
  const playMusicButton = document.getElementById("playMusic");
  const music = document.getElementById("bgMusic");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (
    !heartsContainer ||
    !typingQuote ||
    !celebration ||
    !confettiCanvas ||
    !playMusicButton ||
    !music
  ) {
    return;
  }

  const quotes = [
    "Every love story is beautiful, but ours is my favorite.",
    "You are my favorite hello and my sweetest forever.",
    "In a world of maybe, you are my always.",
  ];

  let quoteIndex = 0;
  let charIndex = 0;

  const typeQuote = () => {
    const current = quotes[quoteIndex];
    typingQuote.textContent = current.slice(0, charIndex);
    if (charIndex < current.length) {
      charIndex += 1;
      setTimeout(typeQuote, 60);
    } else {
      setTimeout(() => {
        charIndex = 0;
        quoteIndex = (quoteIndex + 1) % quotes.length;
        typeQuote();
      }, 1600);
    }
  };

  if (!reducedMotion) {
    typeQuote();
  } else {
    typingQuote.textContent = quotes[0];
  }

  const makeFloatingHearts = () => {
    for (let i = 0; i < 18; i += 1) {
      const heart = document.createElement("span");
      heart.className = "floating-heart";
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.animationDelay = `${Math.random() * 6}s`;
      heart.style.animationDuration = `${10 + Math.random() * 6}s`;
      heart.style.opacity = (0.3 + Math.random() * 0.6).toFixed(2);
      heart.style.transform = `scale(${0.4 + Math.random() * 0.7})`;
      heartsContainer.appendChild(heart);
    }
  };

  if (!reducedMotion) {
    makeFloatingHearts();
  }

  const startCelebration = () => {
    celebration.style.display = "flex";
    launchConfetti();
    if (window.gsap) {
      window.gsap.fromTo(
        ".celebration .message",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "elastic.out(1, 0.5)" }
      );
    }
  };

  const setupParallax = () => {
    const elements = document.querySelectorAll(".parallax");
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      elements.forEach((el) => {
        const speed = Number(el.dataset.speed || 0.2);
        el.style.transform = `translateY(${scrollY * speed * 0.2}px)`;
      });
    });
  };

  if (!reducedMotion) {
    setupParallax();
  }

  playMusicButton.addEventListener("click", async () => {
    try {
      await music.play();
      playMusicButton.textContent = "Music Playing ✨";
    } catch (error) {
      console.error(error);
    }
  });

  if (window.gsap) {
    window.gsap.from(".hero-card", { opacity: 0, y: 40, duration: 1.2 });
    window.gsap.from(".photo-frame", { opacity: 0, y: 60, duration: 1.2, delay: 0.2 });
  }

  const resizeCanvas = () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  };

  const confettiCtx = confettiCanvas.getContext("2d");
  const confettiPieces = [];

  const createConfetti = () => {
    const colors = ["#ff2f7d", "#ff7ab8", "#ffd1e8", "#fff1f8", "#ff4d6d"];
    for (let i = 0; i < 160; i += 1) {
      confettiPieces.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height - confettiCanvas.height,
        r: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10,
        speed: Math.random() * 3 + 2,
      });
    }
  };

  const renderConfetti = () => {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces.forEach((p) => {
      confettiCtx.beginPath();
      confettiCtx.fillStyle = p.color;
      confettiCtx.ellipse(p.x, p.y, p.r, p.r * 1.4, p.tilt, 0, Math.PI * 2);
      confettiCtx.fill();
      p.y += p.speed;
      if (p.y > confettiCanvas.height) {
        p.y = -20;
      }
    });
    requestAnimationFrame(renderConfetti);
  };

  const launchConfetti = () => {
    resizeCanvas();
    confettiPieces.length = 0;
    createConfetti();
    renderConfetti();
  };

  window.addEventListener("resize", resizeCanvas);
})();
