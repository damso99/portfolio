/* 전역에서 사용할 렌더링 함수들을 정의한다. */
(function () {
  // HTML 주입 전에 문자열을 안전하게 이스케이프한다.
  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  // 링크가 비어 있을 때 기본값을 보장한다.
  function safeHref(value) {
    var href = String(value ?? "").trim();
    return href || "#";
  }

  // 외부 링크 속성을 일관되게 반환한다.
  function externalLinkAttrs() {
    return ' target="_blank" rel="noopener noreferrer"';
  }

  // Hero 섹션을 렌더링한다.
  function renderHero(hero) {
    var container = document.querySelector("#hero-content");
    if (!container) return;

    var heroData = hero || {};
    var nameEn = heroData.nameEn || heroData.eyebrow || "";
    var name = heroData.name || heroData.title || "";
    var tagline = heroData.tagline || "";
    var subTagline = heroData.subTagline || heroData.description || "";
    var primary = heroData.ctaPrimary || {};
    var secondary = heroData.ctaSecondary || {};
    var scrollIndicator = heroData.scrollIndicator === true;

    container.innerHTML = [
      '<div class="hero__inner">',
      '  <div class="hero__copy">',
      '    <p class="hero__eyebrow">' + escapeHTML(nameEn) + '</p>',
      '    <h1 class="hero__name">' + escapeHTML(name) + '</h1>',
      '    <p class="hero__tagline">' + escapeHTML(tagline) + '</p>',
      '    <p class="hero__sub-tagline">' + escapeHTML(subTagline) + '</p>',
      '    <div class="hero__actions">',
      '      <a class="hero__button hero__button--primary" href="' + escapeHTML(safeHref(primary.href)) + '" download>' + escapeHTML(primary.label || "이력서 다운로드") + '</a>',
      '      <a class="hero__button hero__button--secondary" href="' + escapeHTML(safeHref(secondary.href)) + '"' + externalLinkAttrs() + '>' + escapeHTML(secondary.label || "GitHub 보기") + '</a>',
      '    </div>',
      "  </div>",
      '  <div class="hero__visual" aria-hidden="true">',
      '    <div class="hero__orb hero__orb--primary"></div>',
      '    <div class="hero__orb hero__orb--secondary"></div>',
      '    <div class="hero__device hero__device--laptop">',
      '      <div class="hero__device-screen">',
      '        <div class="hero__screen-top"></div>',
      '        <div class="hero__screen-grid">',
      '          <span></span><span></span><span></span><span></span>',
      "        </div>",
      "      </div>",
      "    </div>",
      '    <div class="hero__device hero__device--phone">',
      '      <div class="hero__phone-notch"></div>',
      '      <div class="hero__phone-screen">',
      '        <div class="hero__phone-line hero__phone-line--lg"></div>',
      '        <div class="hero__phone-line"></div>',
      '        <div class="hero__phone-line"></div>',
      '        <div class="hero__phone-card"></div>',
      "      </div>",
      "    </div>",
      "  </div>",
      scrollIndicator
        ? [
            '  <div class="hero__scroll" aria-hidden="true">',
            '    <span class="hero__scroll-text">SCROLL</span>',
            '    <span class="hero__scroll-arrow">↓</span>',
            "  </div>"
          ].join("")
        : "",
      "</div>"
    ].join("");
  }

  // 소개 섹션을 렌더링한다.
  function renderAbout(about) {
    var container = document.querySelector("#about-content");
    if (!container || !about) return;

    var descriptionList = Array.isArray(about.description)
      ? about.description
      : (about.description ? [about.description] : []);

    var descriptionHtml = descriptionList
      .map(function (paragraph) {
        return '<p class="about__description">' + escapeHTML(paragraph) + '</p>';
      })
      .join("");

    var valuesHtml = (about.values || [])
      .map(function (value) {
        return [
          '<article class="value-card">',
          '  <span class="value-card__icon">' + escapeHTML(value.icon || "") + "</span>",
          '  <div>',
          '    <h3 class="value-card__title">' + escapeHTML(value.title || "") + "</h3>",
          '    <p class="value-card__text">' + escapeHTML(value.description || "") + "</p>",
          "  </div>",
          "</article>"
        ].join("");
      })
      .join("");

    container.innerHTML = [
      '<div class="section-label">About</div>',
      '<section class="about-panel">',
      '  <div class="about-panel__profile">',
      '    <div class="profile-card">',
      '      <div class="profile-card__avatar">SK</div>',
      '      <div class="profile-card__copy">',
      '        <h2 class="profile-card__name">' + escapeHTML(about.title || about.name || "") + "</h2>",
      '        <p class="profile-card__role">' + escapeHTML(about.role || "Backend Developer") + "</p>",
      "      </div>",
      descriptionHtml,
      "    </div>",
      "  </div>",
      '  <div class="about-panel__values">',
      valuesHtml,
      "  </div>",
      "</section>"
    ].join("");
  }

  // 기술 스택 섹션을 렌더링한다.
  function renderTechStack(techStack) {
    var container = document.querySelector("#tech-stack-content");
    if (!container) return;

    var groupsHtml = (techStack || [])
      .map(function (group) {
        var items = Array.isArray(group.items) ? group.items : [];
        var tags = items
          .map(function (item) {
            return '<span class="tech-chip__tag">' + escapeHTML(item) + "</span>";
          })
          .join("");

        return [
          '<article class="tech-group">',
          '  <h3 class="tech-group__title">' + escapeHTML(group.category || "") + "</h3>",
          '  <div class="tech-group__items">',
          tags,
          "  </div>",
          "</article>"
        ].join("");
      })
      .join("");

    container.innerHTML = [
      '<div class="section-label">Tech Stack</div>',
      '<p class="section-copy">실무에 맞는 핵심 스택을 Frontend, Backend, Database, Infra, Tools 기준으로 정리했습니다.</p>',
      '<div class="tech-stack__groups">',
      groupsHtml,
      "</div>"
    ].join("");
  }

  // 프로젝트 섹션을 렌더링한다.
  function renderProjects(projects) {
    var container = document.querySelector("#projects-content");
    if (!container) return;

    var projectsHtml = (projects || [])
      .map(function (project) {
        var title = project.title || project.name || "Project";
        var description = project.description || project.summary || "";
        var role = project.role || project.category || "";
        var techList = project.tech || project.stack || [];
        var url = project.url || project.link || "";
        var slug = String(title).toLowerCase().replace(/\s+/g, "-");
        var tags = techList
          .map(function (tag) {
            return '<span class="project-card__tag">' + escapeHTML(tag) + "</span>";
          })
          .join("");

        return [
          '<article class="project-card' + (project.featured ? " project-card--featured" : "") + '">',
          '  <div class="project-card__media project-card__media--' + escapeHTML(slug) + '">',
          '    <span class="project-card__media-glow"></span>',
          '    <span class="project-card__media-window"></span>',
          "  </div>",
          '  <div class="project-card__meta">',
          '    <span>' + escapeHTML(role) + "</span>",
          project.featured ? '<span class="project-card__badge">Featured</span>' : "",
          "  </div>",
          '  <h3 class="project-card__title">' + escapeHTML(title) + "</h3>",
          '  <p class="project-card__description">' + escapeHTML(description) + "</p>",
          '  <div class="project-card__tags">' + tags + "</div>",
          url
            ? '  <a class="project-card__link" href="' + escapeHTML(safeHref(url)) + '"' + externalLinkAttrs() + '>사이트 보기</a>'
            : "",
          "</article>"
        ].join("");
      })
      .join("");

    container.innerHTML = [
      '<div class="section-label">Projects</div>',
      '<div class="projects-head">',
      '  <p class="section-copy">핵심 제작물을 중심으로, 역할과 기술 스택, 외부 사이트 연결이 보이도록 구성합니다.</p>',
      '  <a class="projects-head__link" href="#contact">전체 프로젝트 보기 →</a>',
      "</div>",
      '<div class="projects__grid">',
      projectsHtml,
      "</div>"
    ].join("");
  }

  // 경험 섹션을 렌더링한다.
  function renderExperience(experience) {
    var container = document.querySelector("#experience-content");
    if (!container) return;

    var timelineHtml = (experience || [])
      .map(function (item) {
        return [
          '<article class="timeline-card">',
          '  <div class="timeline-card__top">',
          '    <h3 class="timeline-card__title">' + escapeHTML(item.title || "") + "</h3>",
          '    <span class="timeline-card__period">' + escapeHTML(item.period || "") + "</span>",
          "  </div>",
          '  <p class="timeline-card__company">' + escapeHTML(item.company || "") + "</p>",
          '  <p class="timeline-card__text">' + escapeHTML(item.description || "") + "</p>",
          "</article>"
        ].join("");
      })
      .join("");

    container.innerHTML = [
      '<div class="section-label">Experience</div>',
      '<p class="section-copy">프로젝트와 학습 경험을 시간 순서로 정리해, 어떤 방향으로 성장해 왔는지 한눈에 볼 수 있게 구성합니다.</p>',
      '<div class="timeline">',
      timelineHtml,
      "</div>"
    ].join("");
  }

  // 연락처 섹션을 렌더링한다.
  function renderContact(contact) {
    var container = document.querySelector("#contact-content");
    if (!container || !contact) return;

    var githubHref = safeHref(contact.github || "#");
    var projectLinks = Array.isArray(contact.projectLinks) ? contact.projectLinks : [];

    var projectLinksHtml = projectLinks
      .map(function (item) {
        return [
          '<a class="contact-card__link" href="' + escapeHTML(safeHref(item.url)) + '"' + externalLinkAttrs() + '>',
          '  <span class="contact-card__value">' + escapeHTML(item.name || "") + "</span>",
          "</a>"
        ].join("");
      })
      .join("");

    container.innerHTML = [
      '<div class="section-label">Contact</div>',
      '<h2 class="contact__headline">' + escapeHTML(contact.title || "함께 성장하는 개발자가 되겠습니다.") + "</h2>",
      '<p class="contact__description">' + escapeHTML(contact.description || "") + "</p>",
      '<div class="contact__grid">',
      '  <article class="contact-card">',
      '    <span class="contact-card__label">GitHub</span>',
      '    <a class="contact-card__value contact-card__link" href="' + escapeHTML(githubHref) + '"' + externalLinkAttrs() + '>' + escapeHTML(githubHref) + "</a>",
      "  </article>",
      '  <article class="contact-card">',
      '    <span class="contact-card__label">Portfolio Projects</span>',
      '    <div class="contact-card__project-list">',
      projectLinksHtml,
      "    </div>",
      "  </article>",
      "</div>"
    ].join("");
  }

  // 렌더 함수를 전역에 노출한다.
  window.renderHero = renderHero;
  window.renderAbout = renderAbout;
  window.renderTechStack = renderTechStack;
  window.renderProjects = renderProjects;
  window.renderExperience = renderExperience;
  window.renderContact = renderContact;
})();
