/* 내비게이션, 모바일 메뉴, 페이드 인 애니메이션을 관리한다. */
(function () {
  // 현재 활성 섹션을 계산하고 nav 상태를 갱신한다.
  function initActiveNavigation() {
    var sections = Array.prototype.slice.call(document.querySelectorAll(".section[id]"));
    var links = Array.prototype.slice.call(document.querySelectorAll(".sidebar__nav-link"));
    if (!sections.length || !links.length) return;

    var linkById = links.reduce(function (acc, link) {
      var id = link.getAttribute("href") || "";
      acc[id.replace("#", "")] = link;
      return acc;
    }, {});

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          var id = entry.target.getAttribute("id");
          links.forEach(function (link) {
            link.classList.remove("is-active");
          });

          if (linkById[id]) {
            linkById[id].classList.add("is-active");
          }
        });
      },
      {
        root: null,
        threshold: 0.45,
        rootMargin: "-15% 0px -40% 0px"
      }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // 모바일 햄버거 메뉴의 열림/닫힘 상태를 제어한다.
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

    // 첫 화면에서도 섹션이 바로 보이도록 안전망을 둔다.
    window.requestAnimationFrame(function () {
      elements.forEach(function (element) {
        element.classList.add("is-visible");
      });
    });
  }

  // DOM 준비 후 UI 기능을 시작한다.
  document.addEventListener("DOMContentLoaded", function () {
    initActiveNavigation();
    initMobileMenu();
    initFadeInObserver();
  });
})();
