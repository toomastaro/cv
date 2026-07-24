(() => {
  "use strict";

  const translations = window.PortfolioTranslations || {};
  const supportedLanguages = ["en", "et", "ru"];
  const defaultLanguage = "en";
  const storageKey = "toomas-portfolio-language";
  let currentLanguage = defaultLanguage;

  const getNestedValue = (object, path) =>
    path.split(".").reduce((value, key) => value?.[key], object);

  const getPreferredLanguage = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (supportedLanguages.includes(saved) && translations[saved]) return saved;
    } catch {
      // Storage may be blocked; browser preference still provides a safe fallback.
    }

    const browserLanguage = navigator.language?.slice(0, 2).toLowerCase();
    return supportedLanguages.includes(browserLanguage) && translations[browserLanguage]
      ? browserLanguage
      : defaultLanguage;
  };

  const createElement = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  const renderPrinciples = (content) => {
    const container = document.querySelector('[data-render="principles"]');
    if (!container) return;
    container.replaceChildren(
      ...content.hero.principles.map((item, index) => {
        const article = createElement("article", "principle");
        article.append(createElement("span", "principle-number", `0${index + 1}`));
        const copy = createElement("div");
        copy.append(createElement("h2", "", item.title), createElement("p", "", item.text));
        article.append(copy);
        return article;
      })
    );
  };

  const renderExpertise = (content) => {
    const container = document.querySelector('[data-render="expertise"]');
    if (!container) return;
    container.replaceChildren(
      ...content.expertise.items.map((item, index) => {
        const article = createElement("article", "expertise-card");
        article.append(
          createElement("span", "card-number", `0${index + 1}`),
          createElement("h3", "", item.title),
          createElement("p", "", item.text)
        );
        return article;
      })
    );
  };

  const renderImpact = (content) => {
    const container = document.querySelector('[data-render="impact"]');
    if (!container) return;
    container.replaceChildren(
      ...content.impact.items.map((item) => {
        const article = createElement("article", "impact-card");
        article.append(
          createElement("span", "impact-value", item.value),
          createElement("h3", "", item.title),
          createElement("p", "", item.text)
        );
        return article;
      })
    );
  };

  const renderExperience = (content) => {
    const container = document.querySelector('[data-render="experience"]');
    if (!container) return;

    container.replaceChildren(
      ...content.experience.items.map((item, index) => {
        const article = createElement("article", "timeline-item");
        article.append(createElement("span", "timeline-marker"));

        const meta = createElement("div", "timeline-meta");
        meta.append(
          createElement("h3", "timeline-company", item.company),
          createElement("span", "timeline-period", item.period)
        );
        article.append(
          meta,
          createElement("p", "timeline-role", item.role),
          createElement("p", "timeline-description", item.description)
        );

        if (item.details?.length) {
          const detailsId = `experience-details-${index}`;
          const button = createElement("button", "details-toggle", content.experience.detailsLabel);
          button.type = "button";
          button.setAttribute("aria-expanded", "false");
          button.setAttribute("aria-controls", detailsId);
          button.setAttribute("aria-label", `${content.a11y.details}: ${item.company}, ${item.role}`);

          const details = createElement("div", "timeline-details");
          details.id = detailsId;
          const detailsInner = createElement("div");
          const list = createElement("ul");
          list.append(...item.details.map((detail) => createElement("li", "", detail)));
          detailsInner.append(list);
          details.append(detailsInner);

          button.addEventListener("click", () => {
            const willOpen = button.getAttribute("aria-expanded") !== "true";
            button.setAttribute("aria-expanded", String(willOpen));
            details.classList.toggle("is-open", willOpen);
          });
          article.append(button, details);
        }
        return article;
      })
    );
  };

  const renderIndustries = (content) => {
    const container = document.querySelector('[data-render="industries"]');
    if (!container) return;
    container.replaceChildren(
      ...content.industries.items.map((item) => createElement("div", "industry-item", item))
    );
  };

  const renderCredentials = (content) => {
    const container = document.querySelector('[data-render="credentials"]');
    if (!container) return;
    container.replaceChildren(
      ...content.credentials.items.map((item) => {
        const article = createElement("article", "credential-item");
        article.append(
          createElement("span", "credential-code", item.code),
          createElement("span", "credential-name", item.name),
          createElement("span", "credential-type", item.type)
        );
        return article;
      })
    );
  };

  const updateMetadata = (content) => {
    document.title = content.meta.title;
    const description = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (description) description.content = content.meta.description;
    if (ogTitle) ogTitle.content = content.meta.title;
    if (ogDescription) ogDescription.content = content.meta.description;
    if (twitterTitle) twitterTitle.content = content.meta.title;
    if (twitterDescription) twitterDescription.content = content.meta.description;
  };

  const updateStaticText = (content) => {
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = getNestedValue(content, element.dataset.i18n);
      if (typeof value === "string") element.textContent = value;
    });
  };

  const updateLanguageControls = (language) => {
    document.querySelectorAll("[data-language]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.language === language));
    });
  };

  const activateRevealEffects = () => {
    const elements = document.querySelectorAll(".reveal:not(.is-visible), [data-render] > *:not(.is-visible)");
    if (!elements.length) return;

    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px" }
    );
    elements.forEach((element) => observer.observe(element));
  };

  const applyLanguage = (language, persist = true) => {
    const safeLanguage = supportedLanguages.includes(language) && translations[language]
      ? language
      : defaultLanguage;
    const content = translations[safeLanguage];
    if (!content) return;

    currentLanguage = safeLanguage;
    document.documentElement.lang = safeLanguage;
    updateStaticText(content);
    updateMetadata(content);
    updateLanguageControls(safeLanguage);
    renderPrinciples(content);
    renderExpertise(content);
    renderImpact(content);
    renderExperience(content);
    renderIndustries(content);
    renderCredentials(content);

    const cvLink = document.querySelector("[data-cv-link]");
    if (cvLink) cvLink.href = content.cv;

    if (persist) {
      try {
        localStorage.setItem(storageKey, safeLanguage);
      } catch {
        // Language still works for the current page when storage is unavailable.
      }
    }
    activateRevealEffects();
  };

  const closeMenu = () => {
    const nav = document.querySelector("[data-nav]");
    const toggle = document.querySelector("[data-menu-toggle]");
    const header = document.querySelector("[data-header]");
    if (!nav || !toggle || !header) return;
    nav.classList.remove("is-open");
    header.classList.remove("is-menu-open");
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    const label = toggle.querySelector("[data-i18n]");
    if (label) label.textContent = translations[currentLanguage]?.a11y.menu || "Open menu";
  };

  const initializeMenu = () => {
    const nav = document.querySelector("[data-nav]");
    const toggle = document.querySelector("[data-menu-toggle]");
    const header = document.querySelector("[data-header]");
    if (!nav || !toggle || !header) return;

    toggle.addEventListener("click", () => {
      const willOpen = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(willOpen));
      nav.classList.toggle("is-open", willOpen);
      header.classList.toggle("is-menu-open", willOpen);
      document.body.classList.toggle("menu-open", willOpen);
      const label = toggle.querySelector("[data-i18n]");
      if (label) {
        label.textContent = willOpen
          ? translations[currentLanguage]?.a11y.closeMenu || "Close menu"
          : translations[currentLanguage]?.a11y.menu || "Open menu";
      }
    });

    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        toggle.focus();
      }
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 800) closeMenu();
    });
  };

  const initializeHeader = () => {
    const header = document.querySelector("[data-header]");
    if (!header) return;
    const update = () => header.classList.toggle("is-scrolled", window.scrollY > 18);
    update();
    window.addEventListener("scroll", update, { passive: true });
  };

  const initializeActiveNavigation = () => {
    if (!("IntersectionObserver" in window)) return;
    const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
    const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!activeEntry) return;
        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${activeEntry.target.id}`;
          if (isActive) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0, 0.25, 0.5] }
    );
    sections.forEach((section) => observer.observe(section));
  };

  const initialize = () => {
    document.querySelectorAll("[data-language]").forEach((button) => {
      button.addEventListener("click", () => applyLanguage(button.dataset.language));
    });
    const year = document.querySelector("[data-current-year]");
    if (year) year.textContent = String(new Date().getFullYear());
    initializeMenu();
    initializeHeader();
    initializeActiveNavigation();
    applyLanguage(getPreferredLanguage(), false);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
