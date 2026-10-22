// KeyX 官网：中英文切换 + 「KeyX 知道你什么」划线动画
(function () {
  var root = document.documentElement;

  // 语言：用户选过的优先，否则按浏览器语言（中文显示中文，其余显示英文）
  function storedLang() {
    try { return localStorage.getItem("keyx-lang"); } catch (e) { return null; }
  }
  function saveLang(lang) {
    try { localStorage.setItem("keyx-lang", lang); } catch (e) { /* 隐私模式下忽略 */ }
  }
  function applyLang(lang) {
    root.setAttribute("data-lang", lang);
    root.setAttribute("lang", lang === "zh" ? "zh-Hans" : "en");
    var title = document.querySelector('meta[name="title-' + lang + '"]');
    if (title) document.title = title.getAttribute("content");
  }

  var initial = storedLang();
  if (initial !== "zh" && initial !== "en") {
    var browser = (navigator.language || "en").toLowerCase();
    initial = browser.indexOf("zh") === 0 ? "zh" : "en";
  }
  applyLang(initial);

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".lang-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var next = root.getAttribute("data-lang") === "zh" ? "en" : "zh";
        applyLang(next);
        saveLang(next);
      });
    }

    // 划线：滚动到这一段时依次划掉，只播放一次
    var ledger = document.querySelector(".ledger");
    if (!ledger) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      ledger.classList.add("is-struck");
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          ledger.classList.add("is-struck");
          observer.disconnect();
        }
      });
    }, { threshold: 0.45 });
    observer.observe(ledger);
  });
})();
