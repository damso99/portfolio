/* 데이터를 불러와 각 섹션 렌더 함수를 호출한다. */
(function () {
  // 페이지 초기화가 끝난 뒤 데이터를 요청한다.
  function initPortfolio() {
    fetch("./data/portfolio.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("데이터를 불러오지 못했습니다.");
        }
        return response.json();
      })
      .then(function (data) {
        // 렌더 함수는 renderer.js에서 전역으로 제공한다.
        window.renderHero && window.renderHero(data.hero);
        window.renderAbout && window.renderAbout(data.about);
        window.renderTechStack && window.renderTechStack(data.techStack);
        window.renderProjects && window.renderProjects(data.projects);
        window.renderExperience && window.renderExperience(data.experience);
        window.renderContact && window.renderContact(data.contact);
      })
      .catch(function (error) {
        // 콘솔과 화면 모두에 실패 상태를 알려준다.
        console.error("포트폴리오 데이터 로딩 실패:", error);

        var mainContent = document.querySelector(".main-content");
        if (mainContent) {
          var errorBox = document.createElement("div");
          errorBox.className = "fetch-error";
          errorBox.textContent = "포트폴리오 데이터를 불러오지 못했습니다. data/portfolio.json 파일을 확인해 주세요.";
          mainContent.prepend(errorBox);
        }
      });
  }

  // DOM이 준비되면 렌더링을 시작한다.
  document.addEventListener("DOMContentLoaded", initPortfolio);
})();
