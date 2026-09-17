/* =====================================================================
   ASTRAVOLT — AD MANAGER (Google AdMob)

   Works in two modes:
     * Android app (Capacitor)  -> real AdMob ads via @capacitor-community/admob
     * Browser / preview        -> a simulated 5 second ad overlay so every
                                    reward button stays testable

   App ID and Ad Unit IDs are live (testing disabled).
   ===================================================================== */

window.ADMOB_CONFIG = {
  appId: "ca-app-pub-8410044991900164~9097362980",
  rewardedId: "ca-app-pub-8410044991900164/8821643779",
  interstitialId: "ca-app-pub-8410044991900164/6052010204",
  /* real ad unit ids are in place */
  testing: false,
};

(function () {
  var C = window.ADMOB_CONFIG;

  function isNative() {
    return !!(window.Capacitor &&
      (typeof window.Capacitor.isNativePlatform === "function"
        ? window.Capacitor.isNativePlatform()
        : window.Capacitor.isNative));
  }

  function plugin() {
    return window.Capacitor &&
      window.Capacitor.Plugins &&
      window.Capacitor.Plugins.AdMob;
  }

  var ready = false;

  function init() {
    var AdMob = plugin();
    if (!isNative() || !AdMob) return Promise.resolve(false);
    if (ready) return Promise.resolve(true);
    return AdMob.initialize({
      initializeForTesting: !!C.testing,
    })
      .then(function () {
        ready = true;
        return true;
      })
      .catch(function () {
        return false;
      });
  }

  /* ---------- simulated ad overlay (browser / preview) ---------- */

  function fakeAd(label) {
    return new Promise(function (resolve) {
      var wrap = document.createElement("div");
      wrap.style.cssText =
        "position:fixed;inset:0;z-index:99999;background:#05070f;" +
        "display:flex;flex-direction:column;align-items:center;" +
        "justify-content:center;gap:14px;font-family:inherit;color:#e2e8f0;text-align:center;padding:24px;";
      wrap.innerHTML =
        '<div style="font-size:11px;letter-spacing:2px;color:#64748b">ADVERTISEMENT</div>' +
        '<div style="font-size:19px;letter-spacing:1px;color:#00f2fe">' + label + "</div>" +
        '<div style="font-size:13px;color:#94a3b8">demo ad — real ads show in the Android app</div>' +
        '<div id="adCountdown" style="font-size:30px;color:#fbbf24;font-weight:700">5</div>';
      document.body.appendChild(wrap);
      var left = 5;
      var t = setInterval(function () {
        left--;
        var c = wrap.querySelector("#adCountdown");
        if (c) c.innerText = String(left);
        if (left <= 0) {
          clearInterval(t);
          wrap.remove();
          resolve(true);
        }
      }, 1000);
    });
  }

  /* ---------- rewarded ad ---------- */

  function showRewarded(label) {
    var AdMob = plugin();
    if (!isNative() || !AdMob) return fakeAd(label || "REWARD AD");

    return init()
      .then(function () {
        return AdMob.prepareRewardVideoAd({
          adId: C.rewardedId,
          isTesting: !!C.testing,
        });
      })
      .then(function () {
        return AdMob.showRewardVideoAd();
      })
      .then(function (reward) {
        /* a reward object means the user watched it through */
        return !!reward;
      })
      .catch(function () {
        return false;
      });
  }

  /* ---------- interstitial ad ---------- */

  var interstitialBusy = false;

  function showInterstitial() {
    var AdMob = plugin();
    if (!isNative() || !AdMob) return Promise.resolve(false);
    if (interstitialBusy) return Promise.resolve(false);
    interstitialBusy = true;

    return init()
      .then(function () {
        return AdMob.prepareInterstitial({
          adId: C.interstitialId,
          isTesting: !!C.testing,
        });
      })
      .then(function () {
        return AdMob.showInterstitial();
      })
      .then(function () {
        interstitialBusy = false;
        return true;
      })
      .catch(function () {
        interstitialBusy = false;
        return false;
      });
  }

  window.Ads = {
    init: init,
    isNative: isNative,
    showRewarded: showRewarded,
    showInterstitial: showInterstitial,
  };

  if (isNative()) {
    document.addEventListener("deviceready", init, { once: true });
    setTimeout(init, 1200);
  }
})();
