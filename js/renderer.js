(function () {
  function escapeHTML(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function safeHref(value) {
    if (typeof value !== "string") {
      return "#";
    }

    var trimmed = value.trim();
    if (!trimmed) {
      return "#";
    }

    if (/^(https?:|mailto:|tel:|\/|\.\/|\.\.\/|#)/i.test(trimmed)) {
      return trimmed;
    }

    return "#";
  }

  function slugify(value) {
    return String(value == null ? "" : value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .trim();
  }

  function formatDisplayUrl(url, title) {
    if (typeof url !== "string" || !url.trim()) {
      return title || "";
    }

    var trimmed = url.trim();

    try {
      var parsed = new URL(trimmed, window.location.origin);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        return parsed.host + parsed.pathname.replace(/\/$/, "");
      }
    } catch (error) {
      // URL 파싱이 실패하면 원본 문자열을 그대로 표시한다.
    }

    return trimmed.replace(/^https?:\/\//i, "");
  }

  function getProjectImage(project) {
    var title = slugify(project && project.title);
    var imageMap = {
      moodcast: "./assets/projects/moodcast.png",
      greencarry: "./assets/projects/greencarry.png",
      stickoverflow: "./assets/projects/stickoverflow.png"
    };

    if (project && typeof project.image === "string" && project.image.trim()) {
      return project.image.trim();
    }

    return imageMap[title] || "";
  }

  function renderHero(hero) {
    var container = document.getElementById("hero-content");
    if (!container || !hero) {
      return;
    }

    var primaryHref = safeHref(hero.ctaPrimary && hero.ctaPrimary.href);
    var secondaryHref = safeHref(hero.ctaSecondary && hero.ctaSecondary.href);

    container.innerHTML = [
      '<div class="hero__inner">',
      '  <div class="hero__copy">',
      '    <div class="hero__eyebrow">Portfolio</div>',
      '    <h1 class="hero__name">',
      '      <span class="hero__highlight">' + escapeHTML(hero.name || "") + "</span>",
      "      <br />" + escapeHTML(hero.nameEn || ""),
      "    </h1>",
      '    <p class="hero__tagline">' + escapeHTML(hero.tagline || "") + "</p>",
      '    <p class="hero__sub-tagline">' + escapeHTML(hero.subTagline || "") + "</p>",
      '    <div class="hero__actions">',
      '      <a class="hero__button hero__button--primary" href="' + escapeHTML(primaryHref) + '">' + escapeHTML(hero.ctaPrimary && hero.ctaPrimary.label ? hero.ctaPrimary.label : "Resume") + "</a>",
      '      <a class="hero__button hero__button--secondary" href="' + escapeHTML(secondaryHref) + '" target="_blank" rel="noopener noreferrer">' + escapeHTML(hero.ctaSecondary && hero.ctaSecondary.label ? hero.ctaSecondary.label : "GitHub") + "</a>",
      "    </div>",
      "  </div>",
      '  <div class="hero__visual" aria-hidden="true">',
      '    <div class="hero__orb hero__orb--primary"></div>',
      '    <div class="hero__orb hero__orb--secondary"></div>',
      '    <div class="hero__device hero__device--laptop">',
      '      <div class="hero__device-screen">',
      '        <div class="hero__screen-top"></div>',
      '        <div class="hero__screen-grid">',
      "          <span></span>",
      "          <span></span>",
      "          <span></span>",
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
      hero.scrollIndicator
        ? '  <div class="hero__scroll"><span class="hero__scroll-text">Scroll</span><span class="hero__scroll-arrow">↓</span></div>'
        : "",
      "</div>"
    ].join("");
  }

  function renderAbout(about) {
    var container = document.getElementById("about-content");
    if (!container || !about) {
      return;
    }

    var description = Array.isArray(about.description) ? about.description : [];
    var values = Array.isArray(about.values) ? about.values : [];

    container.innerHTML = [
      '<div class="section-label">About</div>',
      '<div class="about-panel">',
      '  <div class="about-panel__profile">',
      '    <div class="profile-card">',
      '      <div class="profile-card__avatar">SK</div>',
      '      <div class="profile-card__copy">',
      '        <div class="profile-card__name">' + escapeHTML(about.name || "") + "</div>",
      '        <div class="profile-card__role">' + escapeHTML(about.role || "") + "</div>",
      "      </div>",
      '      <div class="about__description">' + description.map(function (line) {
        return "<p>" + escapeHTML(line) + "</p>";
      }).join("") + "</div>",
      "    </div>",
      "  </div>",
      '  <div class="about-panel__values">',
      values.map(function (value) {
        return [
          '<article class="value-card">',
          '  <div class="value-card__icon">' + escapeHTML(value.icon || "") + "</div>",
          '  <div class="value-card__body">',
          '    <h3 class="value-card__title">' + escapeHTML(value.title || "") + "</h3>",
          '    <p class="value-card__text">' + escapeHTML(value.description || "") + "</p>",
          "  </div>",
          "</article>"
        ].join("");
      }).join(""),
      "  </div>",
      "</div>"
    ].join("");
  }

  function renderTechStack(techStack) {
    var container = document.getElementById("tech-stack-content");
    if (!container || !Array.isArray(techStack)) {
      return;
    }

    container.innerHTML = [
      '<div class="section-label">Tech Stack</div>',
      '<div class="tech-stack__groups">',
      techStack.map(function (group) {
        var items = Array.isArray(group.items) ? group.items : [];
        return [
          '<section class="tech-group">',
          '  <h3 class="tech-group__title">' + escapeHTML(group.category || "") + "</h3>",
          '  <div class="tech-group__items">',
          items.map(function (item) {
            return '<span class="tech-chip__tag">' + escapeHTML(item) + "</span>";
          }).join(""),
          "  </div>",
          "</section>"
        ].join("");
      }).join(""),
      "</div>"
    ].join("");
  }

  function renderExperience(experience) {
    var container = document.getElementById("experience-content");
    if (!container || !Array.isArray(experience)) {
      return;
    }

    container.innerHTML = [
      '<div class="section-label">Experience</div>',
      '<div class="timeline">',
      experience.map(function (item) {
        return [
          '<article class="timeline-card">',
          '  <div class="timeline-card__top">',
          '    <h3 class="timeline-card__title">' + escapeHTML(item.title || "") + "</h3>",
          '    <span class="timeline-card__period">' + escapeHTML(item.period || "") + "</span>",
          "  </div>",
          '  <div class="timeline-card__company">' + escapeHTML(item.company || "") + "</div>",
          '  <p class="timeline-card__text">' + escapeHTML(item.description || "") + "</p>",
          "</article>"
        ].join("");
      }).join(""),
      "</div>"
    ].join("");
  }

  function renderProjects(projects) {
    var container = document.getElementById("projects-content");
    if (!container || !Array.isArray(projects)) {
      return;
    }

    container.innerHTML = [
      '<div class="section-label">Projects</div>',
      '<p class="section-copy">프로젝트를 큰 쇼케이스 카드로 정리해, 미리보기와 상세 설명을 한 화면에서 바로 읽을 수 있도록 구성했습니다.</p>',
      '<div class="projects-showcase">',
      projects.map(function (project) {
        var tech = Array.isArray(project.tech) ? project.tech : [];
        var features = Array.isArray(project.features) ? project.features : [];
        var imageSrc = getProjectImage(project);
        var displayUrl = formatDisplayUrl(project.url, project.title);
        var fallbackText = project.title ? escapeHTML(project.title) : "Preview";

        return [
          '<article class="project-showcase-card">',
          '  <div class="project-showcase-card__preview">',
          '    <div class="project-browser">',
          '      <div class="project-browser__bar">',
          '        <div class="project-browser__dots" aria-hidden="true"><span></span><span></span><span></span></div>',
          '        <div class="project-browser__url">' + escapeHTML(displayUrl) + "</div>",
          "      </div>",
          '      <div class="project-browser__screen">',
          imageSrc
            ? '        <img class="project-browser__image" src="' + escapeHTML(imageSrc) + '" alt="' + escapeHTML(project.title || "") + ' 사이트 스크린샷" loading="lazy" decoding="async" data-project-image="true" />'
            : "",
          '        <div class="project-browser__fallback" hidden><span>' + fallbackText + '</span><span>이미지 미리보기 없음</span></div>',
          "      </div>",
          "    </div>",
          "  </div>",
          '  <div class="project-showcase-card__content">',
          '    <div class="project-showcase-card__eyebrow">' + escapeHTML(project.type || "") + " · " + escapeHTML(project.role || "") + " · " + escapeHTML(project.period || "") + "</div>",
          '    <h3 class="project-showcase-card__title">' + escapeHTML(project.title || "") + "</h3>",
          project.subtitle ? '    <p class="project-showcase-card__subtitle">' + escapeHTML(project.subtitle) + "</p>" : "",
          '    <p class="project-showcase-card__description">' + escapeHTML(project.description || "") + "</p>",
          '    <div class="project-showcase-card__meta">',
          '      <span>' + escapeHTML(project.type || "Project") + "</span>",
          '      <span>' + escapeHTML(project.role || "") + "</span>",
          '      <span>' + escapeHTML(project.period || "") + "</span>",
          "    </div>",
          features.length
            ? [
                '    <ul class="project-showcase-card__features">',
                features
                  .map(function (feature) {
                    return "<li>" + escapeHTML(feature) + "</li>";
                  })
                  .join(""),
                "    </ul>"
              ].join("")
            : "",
          tech.length
            ? [
                '    <div class="project-showcase-card__tech">',
                tech
                  .map(function (item) {
                    return "<span>" + escapeHTML(item) + "</span>";
                  })
                  .join(""),
                "    </div>"
              ].join("")
            : "",
          '    <div class="project-showcase-card__actions">',
          '      <a class="project-showcase-card__link" ' + 'href="' + escapeHTML(safeHref(project.url)) + '" target="_blank" rel="noopener noreferrer">' + "사이트 보기" + "</a>",
          "    </div>",
          "  </div>",
          "</article>"
        ].join("");
      }).join(""),
      "</div>"
    ].join("");

    var images = container.querySelectorAll(".project-browser__image");
    Array.prototype.forEach.call(images, function (image) {
      var screen = image.closest(".project-browser__screen");
      var fallback = screen ? screen.querySelector(".project-browser__fallback") : null;

      function showFallback() {
        image.style.display = "none";
        if (fallback) {
          fallback.hidden = false;
        }
      }

      if (image.complete && image.naturalWidth === 0) {
        showFallback();
        return;
      }

      image.addEventListener("error", showFallback, { once: true });
    });
  }

  function renderContact(contact) {
    var container = document.getElementById("contact-content");
    if (!container || !contact) {
      return;
    }

    var projectLinks = Array.isArray(contact.projectLinks) ? contact.projectLinks : [];
    var emailHref = safeHref(contact.email);
    var emailLabel = contact.email ? String(contact.email).replace(/^mailto:/i, "") : "";

    container.innerHTML = [
      '<div class="section-label">Contact</div>',
      '<div class="contact__grid">',
      '  <div class="contact__headline">' + escapeHTML(contact.title || "") + "</div>",
      '  <p class="contact__description">' + escapeHTML(contact.description || "") + "</p>",
      '  <div class="contact-card">',
      '    <div class="contact-card__label">GitHub</div>',
      '    <a class="contact-card__link" href="' + escapeHTML(safeHref(contact.github)) + '" target="_blank" rel="noopener noreferrer">' + escapeHTML(contact.github || "") + "</a>",
      "  </div>",
      '  <div class="contact-card">',
      '    <div class="contact-card__label">Email</div>',
      '    <a class="contact-card__link" href="' + escapeHTML(emailHref) + '">' + escapeHTML(emailLabel) + "</a>",
      "  </div>",
      '  <div class="contact-card">',
      '    <div class="contact-card__label">Projects</div>',
      '    <div class="contact-card__project-list">',
      projectLinks
        .map(function (projectLink) {
          return '<a class="contact-card__link" href="' + escapeHTML(safeHref(projectLink.url)) + '" target="_blank" rel="noopener noreferrer">' + escapeHTML(projectLink.name || "") + "</a>";
        })
        .join(""),
      "    </div>",
      "  </div>",
      "  <div class=\"contact-card\">",
      "    <div class=\"contact-card__label\">Status</div>",
      "    <div class=\"contact-card__value\">협업 및 채용 문의 가능</div>",
      "  </div>",
      "</div>"
    ].join("");
  }

  window.escapeHTML = escapeHTML;
  window.renderHero = renderHero;
  window.renderAbout = renderAbout;
  window.renderTechStack = renderTechStack;
  window.renderProjects = renderProjects;
  window.renderExperience = renderExperience;
  window.renderContact = renderContact;
})();
