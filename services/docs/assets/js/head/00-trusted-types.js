(function () {
  if (typeof window !== "undefined" && window.trustedTypes && window.trustedTypes.createPolicy) {
    try {
      window.trustedTypes.createPolicy("default", {
        createHTML: function (s) { return s; },
        createScript: function (s) { return s; },
        createScriptURL: function (u) { return u; }
      });
    } catch (e) {}
  }
})();
