const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
const mediaBtn = document.querySelector(".media-btn");
const tabs = document.querySelectorAll(".tab");
const accordionItems = document.querySelectorAll(".accordion__item");
const form = document.querySelector(".newsletter__form");
const emailInput = document.querySelector("#email");
const formMessage = document.querySelector(".form-message");

function setMenu(open) {
  if (!menuToggle || !mobileMenu) return;
  mobileMenu.hidden = !open;
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.style.overflow = open ? "hidden" : "";
}

menuToggle?.addEventListener("click", () => {
  setMenu(mobileMenu.hidden);
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

mediaBtn?.addEventListener("click", () => {
  const playing = mediaBtn.dataset.state === "playing";
  mediaBtn.dataset.state = playing ? "paused" : "playing";
  mediaBtn.setAttribute("aria-label", playing ? "Play demo" : "Pause demo");
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => {
      item.classList.toggle("is-active", item === tab);
      item.setAttribute("aria-selected", String(item === tab));
    });

    const filter = tab.dataset.filter;
    accordionItems.forEach((item) => {
      const match = filter === "all" || item.dataset.category === filter;
      item.hidden = !match;
      if (!match) {
        item.classList.remove("is-open");
        item.querySelector(".accordion__trigger")?.setAttribute("aria-expanded", "false");
      }
    });
  });
});

accordionItems.forEach((item) => {
  const trigger = item.querySelector(".accordion__trigger");
  trigger?.addEventListener("click", () => {
    const shouldOpen = !item.classList.contains("is-open");
    accordionItems.forEach((other) => {
      other.classList.remove("is-open");
      other.querySelector(".accordion__trigger")?.setAttribute("aria-expanded", "false");
    });
    if (shouldOpen) {
      item.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
    }
  });
});

function encodeForm(formElement) {
  const data = new FormData(formElement);
  return new URLSearchParams(data).toString();
}

function showFormMessage(text, type) {
  if (!formMessage) return;
  formMessage.textContent = text;
  formMessage.classList.remove("is-error", "is-success");
  formMessage.classList.add(type === "error" ? "is-error" : "is-success");
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = emailInput.value.trim();

  if (!EMAIL_PATTERN.test(email)) {
    emailInput.classList.add("is-invalid");
    showFormMessage("Please enter a valid email address.", "error");
    emailInput.focus();
    return;
  }

  emailInput.classList.remove("is-invalid");
  showFormMessage("Sending…", "success");

  try {
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encodeForm(form),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    form.reset();
    showFormMessage("Thanks! You’re subscribed.", "success");
  } catch (error) {
    showFormMessage("Something went wrong. Please try again.", "error");
  }
});

emailInput?.addEventListener("input", () => {
  emailInput.classList.remove("is-invalid");
  if (formMessage?.classList.contains("is-error")) {
    formMessage.textContent = "";
    formMessage.classList.remove("is-error");
  }
});
