(() => {
  const form = document.getElementById("emailForm");
  const successOverlay = document.getElementById("successOverlay");
  const loaderOverlay = document.getElementById("loaderOverlay");
  const heartsContainer = document.getElementById("floatingHearts");
  const emailCard = document.getElementById("emailCard");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const pointer3DEnabled = !reducedMotion && !coarsePointer;

  const EMAILJS_PUBLIC_KEY = "E3QHoPtqedRBLC7vm";
  const EMAILJS_SERVICE_ID = "service_5hb6v8m";
  const EMAILJS_TEMPLATE_ID = "template_rmt1rqr";
  const SURPRISE_BASE_URL = "https://forever-loveletter.netlify.app";

  if (window.emailjs) {
    window.emailjs.init(EMAILJS_PUBLIC_KEY);
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

  bindTilt(emailCard, 7);

  const makeFloatingHearts = () => {
    for (let i = 0; i < 14; i += 1) {
      const heart = document.createElement("span");
      heart.className = "floating-heart";
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.animationDelay = `${Math.random() * 6}s`;
      heart.style.animationDuration = `${8 + Math.random() * 6}s`;
      heart.style.opacity = (0.4 + Math.random() * 0.6).toFixed(2);
      heart.style.transform = `scale(${0.4 + Math.random() * 0.6})`;
      heartsContainer.appendChild(heart);
    }
  };

  makeFloatingHearts();

  const buildEmailHtml = (landingUrl) => {
    return `
      <div style="font-family:'Poppins', Arial, sans-serif;background:#fff0f7;padding:32px;border-radius:20px;">
        <div style="background:#ffffff;border-radius:18px;padding:28px;box-shadow:0 20px 60px rgba(255, 31, 107, 0.2);">
          <h1 style="margin:0 0 12px;font-family:'Playfair Display', Georgia, serif;color:#61102f;">A Valentine Surprise Just For You</h1>
          <p style="margin:0 0 16px;color:#7b2144;">Every moment with you is my favorite. I made something special to remind you how loved you are.</p>
          <img src="assets/email-romantic.gif" alt="romantic" style="width:100%;border-radius:16px;margin:16px 0;" />
          <a href="${landingUrl}" style="display:inline-block;margin-top:10px;padding:14px 22px;background:#ff2f7d;color:#ffffff;text-decoration:none;border-radius:999px;font-weight:600;">Open Your Surprise ❤️</a>
          <p style="margin-top:18px;color:#a13c64;font-size:12px;">Sent with endless love.</p>
        </div>
      </div>
    `;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("userEmail").value.trim();

    if (!window.emailjs) {
      alert("EmailJS not loaded. Please check your connection.");
      return;
    }

    const origin =
      window.location.origin && !window.location.origin.startsWith("file")
        ? window.location.origin
        : SURPRISE_BASE_URL;
    const landingUrl = `${origin}/surprise.html`;

    const templateParams = {
      to_email: email,
      message_html: buildEmailHtml(landingUrl),
    };

    try {
      if (loaderOverlay) {
        loaderOverlay.style.display = "flex";
        loaderOverlay.setAttribute("aria-hidden", "false");
      }
      await window.emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );
      if (loaderOverlay) {
        loaderOverlay.style.display = "none";
        loaderOverlay.setAttribute("aria-hidden", "true");
      }
      successOverlay.style.display = "flex";
      setTimeout(() => {
        successOverlay.style.display = "none";
      }, 2600);
      form.reset();
    } catch (error) {
      console.error(error);
      if (loaderOverlay) {
        loaderOverlay.style.display = "none";
        loaderOverlay.setAttribute("aria-hidden", "true");
      }
      alert("Something went wrong. Please try again.");
    }
  });
})();
