/* KeyOne – anonyme Seitenstatistik: keine Cookies, keine Kennung, keine IP-Speicherung */
(function () {
  try {
    var path = location.pathname.replace(/index(\.[a-z]{2})?\.html$/, "");
    if (/^\/admin/.test(path) || window.KEYONE_PREVIEW || navigator.webdriver) return;
    var lang = (new URLSearchParams(location.search).get("lang")) || document.documentElement.lang || "";
    var ref = "";
    try { if (document.referrer) { var r = new URL(document.referrer); if (r.host !== location.host) ref = r.host; } } catch (e) {}
    function send(type, target) {
      var body = JSON.stringify({ t: type, p: path, k: (target || "").slice(0, 80), l: lang.slice(0, 5), r: ref });
      if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      else fetch("/api/track", { method: "POST", body: body, keepalive: true, headers: { "content-type": "application/json" } });
    }
    send("view", "");
    function label(el) {
      if (el.dataset && el.dataset.track) return el.dataset.track;
      var card = el.closest && el.closest(".project-card");
      if (card) {
        var d = card.querySelector('a[href^="#project/"]');
        var id = d ? d.getAttribute("href").split("/")[1] : (card.querySelector('a[href*="/projects/"]') || {}).pathname || "";
        id = String(id).replace(/^\/projects\/|\/$/g, "") || "?";
        return "project:" + id + (el.classList.contains("demo-link") ? " · demo" : " · details");
      }
      var href = el.getAttribute && el.getAttribute("href");
      if (href) {
        if (/^mailto:/.test(href)) return "mailto";
        if (/^tel:/.test(href)) return "tel";
        try { var u = new URL(href, location.href); return u.host === location.host ? (u.pathname + u.hash) : u.host; } catch (e) { return href; }
      }
      var txt = (el.getAttribute("aria-label") || el.textContent || "").replace(/\s+/g, " ").trim();
      return (el.id ? "#" + el.id + " " : "") + txt.slice(0, 40);
    }
    document.addEventListener("click", function (e) {
      var el = e.target.closest && e.target.closest("a,button,[data-track],select");
      if (el && el.tagName !== "SELECT") send("click", label(el));
    }, true);
    document.addEventListener("change", function (e) {
      if (e.target && e.target.id === "language-select") send("click", "lang → " + e.target.value);
    }, true);
  } catch (e) {}
})();
