(function () {
  var KEY = "umami.disabled";
  var toggles = document.querySelectorAll("[data-umami-toggle]");
  if (!toggles.length) return;

  function sync() {
    var enabled = true;
    try {
      enabled = window.localStorage.getItem(KEY) !== "1";
    } catch (e) {}
    toggles.forEach(function (el) {
      el.checked = enabled;
    });
  }

  sync();

  toggles.forEach(function (el) {
    el.addEventListener("change", function () {
      try {
        if (el.checked) {
          window.localStorage.removeItem(KEY);
        } else {
          window.localStorage.setItem(KEY, "1");
        }
      } catch (e) {}
      sync();
    });
  });

  window.addEventListener("storage", function (e) {
    if (e.key === KEY || e.key === null) {
      sync();
    }
  });
})();
