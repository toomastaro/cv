(() => {
  "use strict";

  const contentByLanguage = window.CVTranslations || {};
  const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
  const language = Object.hasOwn(contentByLanguage, requestedLanguage) ? requestedLanguage : "en";
  const content = contentByLanguage[language];

  const getValue = (path) =>
    path.split(".").reduce((value, key) => value?.[key], content);

  const createElement = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  const appendRichText = (container, segments) => {
    segments.forEach((segment) => {
      if (typeof segment === "string") {
        container.append(document.createTextNode(segment));
        return;
      }
      const strong = createElement("strong", "", segment.strong);
      container.append(strong);
    });
  };

  const renderContacts = () => {
    const container = document.querySelector('[data-render="contacts"]');
    if (!container) return;
    const items = [
      { text: content.contact.location },
      { text: "toomas.taro@gmail.com", href: "mailto:toomas.taro@gmail.com" },
      { text: "LinkedIn", href: "https://www.linkedin.com/in/toomastaro" },
      { text: "Telegram", href: "https://t.me/mousesquad" }
    ];
    items.forEach((item, index) => {
      if (index > 0) container.append(createElement("span", "contact-divider", "|"));
      const element = item.href ? createElement("a", "", item.text) : createElement("span", "", item.text);
      if (item.href) element.href = item.href;
      container.append(element);
    });
  };

  const renderSummary = () => {
    const container = document.querySelector('[data-render="summary"]');
    if (!container) return;
    content.summary.forEach((paragraph) => container.append(createElement("p", "", paragraph)));
  };

  const renderExpertise = () => {
    const container = document.querySelector('[data-render="expertise"]');
    if (!container) return;
    content.expertise.forEach((item) => {
      const li = createElement("li");
      li.append(createElement("span", "expertise-label", `${item.label}: `), document.createTextNode(item.text));
      container.append(li);
    });
  };

  const renderExperience = () => {
    const container = document.querySelector('[data-render="experience"]');
    if (!container) return;
    content.experience.forEach((item) => {
      const article = createElement("article", "experience-entry");
      const heading = createElement("p", "experience-heading");
      heading.append(
        createElement("span", "company", item.company),
        document.createTextNode(" | "),
        createElement("span", "experience-role", item.role),
        document.createTextNode(" | "),
        createElement("span", "period", item.period)
      );
      article.append(heading);
      if (item.description) article.append(createElement("p", "experience-description", item.description));
      const list = createElement("ul");
      item.bullets.forEach((bullet) => {
        const li = createElement("li");
        appendRichText(li, bullet);
        list.append(li);
      });
      article.append(list);
      container.append(article);
    });
  };

  const renderCredentials = () => {
    const container = document.querySelector('[data-render="credentials"]');
    if (!container) return;
    content.credentials.forEach((item) => {
      const row = createElement("div", "credential-row");
      row.append(
        createElement("span", "credential-category", item.category),
        createElement("span", "", item.text)
      );
      container.append(row);
    });
  };

  const initialize = () => {
    document.documentElement.lang = language;
    document.title = `Toomas Taro — ${content.documentTitle}`;
    document.querySelectorAll("[data-field]").forEach((element) => {
      const value = getValue(element.dataset.field);
      if (typeof value === "string") element.textContent = value;
    });
    renderContacts();
    renderSummary();
    renderExpertise();
    renderExperience();
    renderCredentials();
    document.documentElement.dataset.ready = "true";
  };

  initialize();
})();
