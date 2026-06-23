(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  const setHeaderState = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  if (menuButton && navLinks) {
    const closeMenu = () => {
      menuButton.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("is-open");
    };

    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      navLinks.classList.toggle("is-open", !isOpen);
    });

    navLinks.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".nav-shell")) closeMenu();
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -6%", threshold: 0.08 });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  document.querySelectorAll(".video-launch[data-video]").forEach((launchButton) => {
    launchButton.addEventListener("click", () => {
      const source = launchButton.dataset.video;
      if (!source) return;

      document.querySelectorAll("video").forEach((video) => video.pause());

      const video = document.createElement("video");
      video.className = "video-frame";
      video.controls = true;
      video.autoplay = true;
      video.preload = "metadata";
      video.playsInline = true;
      video.setAttribute("aria-label", launchButton.getAttribute("aria-label") || "Video player");

      const sourceElement = document.createElement("source");
      sourceElement.src = source;
      sourceElement.type = "video/mp4";
      video.append(sourceElement);
      video.append(document.createTextNode("Your browser does not support HTML video."));
      launchButton.replaceWith(video);
      video.focus();
    });
  });

  const lightbox = document.querySelector("#lightbox");
  const galleryButtons = [...document.querySelectorAll(".gallery-item")];

  if (lightbox && galleryButtons.length) {
    const lightboxImage = lightbox.querySelector("img");
    const lightboxCaption = lightbox.querySelector("figcaption");
    const closeButton = lightbox.querySelector(".lightbox-close");
    const previousButton = lightbox.querySelector(".lightbox-prev");
    const nextButton = lightbox.querySelector(".lightbox-next");
    let currentIndex = 0;

    const showImage = (index) => {
      currentIndex = (index + galleryButtons.length) % galleryButtons.length;
      const selectedImage = galleryButtons[currentIndex].querySelector("img");
      lightboxImage.src = selectedImage.currentSrc || selectedImage.src;
      lightboxImage.alt = selectedImage.alt;
      lightboxCaption.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(galleryButtons.length).padStart(2, "0")} — ${selectedImage.alt}`;
    };

    galleryButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        showImage(index);
        lightbox.showModal();
      });
    });

    closeButton.addEventListener("click", () => lightbox.close());
    previousButton.addEventListener("click", () => showImage(currentIndex - 1));
    nextButton.addEventListener("click", () => showImage(currentIndex + 1));

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) lightbox.close();
    });

    lightbox.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") showImage(currentIndex - 1);
      if (event.key === "ArrowRight") showImage(currentIndex + 1);
    });
  }

  const rosterRoot = document.querySelector("[data-roster]");
  if (rosterRoot) {
    const players = [
      { name: "Katya", image: "images/katya.jpg" },
      { name: "Wiwers", image: "images/wiwers.jpg" },
      { name: "Masha", image: "images/masha.jpg" },
      { name: "Dismoral", image: "images/dismoral.jpg" },
      { name: "Bolen", image: "images/donk.png" },
      { name: "Lizka", image: "images/lizka.jpg" }
    ];
    const focusImage = rosterRoot.querySelector("[data-roster-image]");
    const focusName = rosterRoot.querySelector("[data-roster-name]");
    const focusNumber = rosterRoot.querySelector("[data-roster-number]");
    const tabs = [...rosterRoot.querySelectorAll(".roster-tab")];
    let currentPlayer = 0;

    const updateRoster = (index) => {
      currentPlayer = (index + players.length) % players.length;
      const player = players[currentPlayer];
      focusImage.src = player.image;
      focusImage.alt = `${player.name}, Sweezkh roster member`;
      focusName.textContent = player.name;
      focusNumber.textContent = `Player ${String(currentPlayer + 1).padStart(2, "0")} / ${String(players.length).padStart(2, "0")}`;
      tabs.forEach((tab, tabIndex) => {
        tab.setAttribute("aria-selected", String(tabIndex === currentPlayer));
        tab.tabIndex = tabIndex === currentPlayer ? 0 : -1;
      });
    };

    rosterRoot.querySelector("[data-roster-prev]").addEventListener("click", () => updateRoster(currentPlayer - 1));
    rosterRoot.querySelector("[data-roster-next]").addEventListener("click", () => updateRoster(currentPlayer + 1));
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => updateRoster(index));
      tab.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        const direction = event.key === "ArrowRight" ? 1 : -1;
        updateRoster(currentPlayer + direction);
        tabs[currentPlayer].focus();
      });
    });

    updateRoster(0);
  }

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
})();
