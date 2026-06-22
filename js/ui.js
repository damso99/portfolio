/* 사이드바 내비게이션, 모바일 메뉴, 페이드인 효과를 관리한다. */
(function () {
  // 현재 화면 기준으로 활성 섹션을 계산하고 nav 상태를 갱신한다.
  function initActiveNavigation() {
    var sections = Array.prototype.slice.call(document.querySelectorAll(".section[id]"));
    var links = Array.prototype.slice.call(document.querySelectorAll(".sidebar__nav-link"));
    if (!sections.length || !links.length) return;

    var linkById = links.reduce(function (acc, link) {
      var id = link.getAttribute("href") || "";
      acc[id.replace("#", "")] = link;
      return acc;
    }, {});

    var activeId = "";
    var ticking = false;

    function setActiveLink(id) {
      if (!id || activeId === id) {
        return;
      }

      activeId = id;

      links.forEach(function (link) {
        link.classList.remove("is-active");
      });

      if (linkById[id]) {
        linkById[id].classList.add("is-active");
      }
    }

    function getSectionAtFocusLine() {
      var focusLine = window.innerHeight * 0.35;
      var fallbackId = sections[0].getAttribute("id") || "";

      for (var i = 0; i < sections.length; i += 1) {
        var section = sections[i];
        var rect = section.getBoundingClientRect();
        var sectionId = section.getAttribute("id") || "";

        if (!sectionId) {
          continue;
        }

        if (rect.top <= focusLine && rect.bottom >= focusLine) {
          return sectionId;
        }

        if (rect.top <= focusLine) {
          fallbackId = sectionId;
        }
      }

      return fallbackId;
    }

    function updateActiveNavigation() {
      setActiveLink(getSectionAtFocusLine());
    }

    function requestActiveNavigationUpdate() {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(function () {
        ticking = false;
        updateActiveNavigation();
      });
    }

    links.forEach(function (link) {
      link.addEventListener("click", function () {
        var id = (link.getAttribute("href") || "").replace("#", "");
        setActiveLink(id);
      });
    });

    window.addEventListener("scroll", requestActiveNavigationUpdate, { passive: true });
    window.addEventListener("resize", requestActiveNavigationUpdate);

    updateActiveNavigation();
  }

  // 모바일 사이드바 메뉴의 열림/닫힘 상태를 제어한다.
  function initMobileMenu() {
    var sidebar = document.querySelector(".sidebar");
    var button = document.querySelector(".mobile-menu-button");
    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".sidebar__nav-link"));
    if (!sidebar || !button) return;

    function closeMenu() {
      sidebar.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    }

    button.addEventListener("click", function () {
      var isOpen = sidebar.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu();
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768) {
        closeMenu();
      }
    });
  }

  // 화면에 들어오는 요소에 fade-in 효과를 적용한다.
  function initFadeInObserver() {
    var elements = Array.prototype.slice.call(document.querySelectorAll(".fade-in"));
    if (!elements.length) return;

    var observer = new IntersectionObserver(
      function (entries, observerInstance) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observerInstance.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    elements.forEach(function (element) {
      observer.observe(element);
    });

    // 첫 화면에서 바로 보여야 하는 섹션은 즉시 visible 상태로 만든다.
    window.requestAnimationFrame(function () {
      elements.forEach(function (element) {
        element.classList.add("is-visible");
      });
    });
  }

  // DOM이 준비되면 UI 기능을 초기화한다.
  document.addEventListener("DOMContentLoaded", function () {
    initActiveNavigation();
    initMobileMenu();
    initFadeInObserver();
  });
})();
