/* ============================================================
   Wellness After 40 — shared site script
   ------------------------------------------------------------
   >>> THIS IS THE ONLY FILE YOU NEED TO EDIT TO GO LIVE. <<<
   Fill in the three values in CONFIG below. Nothing else.
   ============================================================ */

const CONFIG = {

  // ---- 1. GOOGLE ANALYTICS 4 -------------------------------
  // Get this from analytics.google.com → Admin → Data Streams.
  // Looks like "G-ABC1234XYZ". Leave as "" to disable analytics.
  GA4_ID: "G-22HEE9F1DR",

  // ---- 2. GETRESPONSE CAMPAIGN TOKEN -----------------------
  // In GetResponse: Menu → Lists → (your list) → Settings.
  // The token is the short code in the list's web-form URL,
  // e.g. for ".../add_subscriber.html?u=ABCd" the token is "ABCd".
  // Every bridge page posts to this one list; the lead magnet is
  // passed as a custom field so your automation knows which PDF
  // to send. See README.md, section "Wiring GetResponse".
  GR_CAMPAIGN_TOKEN: "PrZmQ",

  // ---- 3. SITE ROOT ----------------------------------------
  // Used to build the thank-you URL. No trailing slash.
  SITE: "https://optimagain.net"
};

/* ============================================================
   Nothing below here needs editing.
   ============================================================ */

(function () {
  "use strict";

  /* ---- footer year ---------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- capture UTM params so we can attribute a signup ----- */
  function captureUtms() {
    var q = new URLSearchParams(location.search);
    var found = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(function (k) {
      if (q.get(k)) found[k] = q.get(k);
    });
    if (Object.keys(found).length) {
      try { sessionStorage.setItem("wa40_utm", JSON.stringify(found)); } catch (e) {}
      return found;
    }
    try { return JSON.parse(sessionStorage.getItem("wa40_utm") || "{}"); } catch (e) { return {}; }
  }
  var utms = captureUtms();

  /* ---- Google Analytics 4 --------------------------------- */
  if (CONFIG.GA4_ID && CONFIG.GA4_ID.indexOf("G-") === 0) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + CONFIG.GA4_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", CONFIG.GA4_ID);
  }
  function track(name, params) {
    if (typeof window.gtag === "function") window.gtag("event", name, params || {});
  }

  /* ---- wire up every GetResponse form on the page ---------- */
  document.querySelectorAll("form[data-optin]").forEach(function (form) {
    var magnet = form.getAttribute("data-magnet") || "unknown";

    form.action = "https://app.getresponse.com/add_subscriber.html";
    form.method = "post";
    form.setAttribute("accept-charset", "utf-8");

    function hidden(n, v) {
      var i = document.createElement("input");
      i.type = "hidden"; i.name = n; i.value = v;
      form.appendChild(i);
    }

    hidden("campaign_token", CONFIG.GR_CAMPAIGN_TOKEN);
    hidden("start_day", "0");
    hidden("thankyou_url", CONFIG.SITE + "/thank-you/?lm=" + encodeURIComponent(magnet));

    // Tells your GetResponse automation which PDF to deliver.
    hidden("custom_leadmagnet", magnet);

    // Attribution — which Pin sent this subscriber.
    hidden("custom_source", utms.utm_source || "direct");
    hidden("custom_campaignname", utms.utm_campaign || magnet);
    hidden("custom_pin", utms.utm_content || "");

    form.addEventListener("submit", function () {
      track("lead_submit", { magnet: magnet, source: utms.utm_source || "direct" });
    });

    if (CONFIG.GR_CAMPAIGN_TOKEN === "PASTE_TOKEN_HERE") {
      console.warn("[Wellness After 40] GetResponse token not set — see assets/site.js CONFIG.");
    }
  });

  /* ---- track clicks out to the offer ---------------------- */
  document.querySelectorAll('a[data-offer]').forEach(function (a) {
    a.addEventListener("click", function () {
      track("offer_click", {
        placement: a.getAttribute("data-offer"),
        page: document.body.getAttribute("data-page") || location.pathname
      });
    });
  });

  /* ---- thank-you page: hand over the right download ------- */
  var dl = document.getElementById("download-slot");
  if (dl) {
    var MAGNETS = {
      "meal-prep":      { name: "5-Day Meal Prep Shopping List & Prep Timeline",   file: "/downloads/meal-prep-shopping-list.pdf" },
      "plate-formula":  { name: "Plate Formula Guide + 20 Meals",                  file: "/downloads/plate-formula-guide.pdf" },
      "protein":        { name: "Protein Tracker + 30 Meals",                      file: "/downloads/protein-tracker.pdf" },
      "evening":        { name: "Evening Routine Checklist",                       file: "/downloads/evening-routine-checklist.pdf" },
      "natural-helpers":{ name: "Natural Helpers Quick Reference Card",            file: "/downloads/natural-helpers-card.pdf" },
      "early-signs":    { name: "Early Awareness Self-Check",                      file: "/downloads/early-awareness-check.pdf" },
      "numbers":        { name: "Doctor Visit Prep Kit",                           file: "/downloads/doctor-visit-prep-kit.pdf" },
      "90-day":         { name: "90-Day Habit Builder Workbook",                   file: "/downloads/90-day-habit-builder.pdf" }
    };
    var key = new URLSearchParams(location.search).get("lm");
    var m = MAGNETS[key];
    if (m) {
      dl.innerHTML =
        '<div class="cta"><a class="btn alt" href="' + m.file + '" download>Download ' + m.name + ' →</a>' +
        '<span class="sub">A copy is also on its way to your inbox</span></div>';
      track("lead_delivered", { magnet: key });
    } else {
      dl.innerHTML = '<p class="note">Your download link is in your inbox — check your email ' +
        '(and your promotions or spam folder if it has not arrived within a few minutes).</p>';
    }
  }
})();
