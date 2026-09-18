/* =========================================================
   CLOUD SAVE — Firebase Realtime Database (REST) + local

   Coins/credits and progress are ALWAYS written to
   localStorage first (works fully offline). When a Firebase
   databaseURL is configured, the same snapshot is mirrored to
   the cloud under /players/<userKey> so the balance follows the
   player to another device / after a reinstall.

   Public API (used by index.html):
     CloudSave.enabled
     CloudSave.setUser(key)
     CloudSave.pull()            -> snapshot object | null
     CloudSave.queue(snapshot)   -> debounced write
     CloudSave.onStatus(cb)      -> "local" | "syncing" | "online" | "error"
========================================================= */

window.CloudSave = (function () {
  var cfg = window.FIREBASE_CONFIG || {};
  var base = (cfg.databaseURL || "").replace(/\/+$/, "");
  var enabled = !!base;

  var userKey = null;
  var timer = null;
  var pending = null;
  var statusCbs = [];
  var status = enabled ? "syncing" : "local";

  function setStatus(s) {
    status = s;
    statusCbs.forEach(function (cb) {
      try {
        cb(s);
      } catch (e) {}
    });
  }

  function onStatus(cb) {
    statusCbs.push(cb);
    cb(status);
  }

  function safeKey(k) {
    return String(k || "guest")
      .toLowerCase()
      .replace(/[.#$/\[\]]/g, "_")
      .slice(0, 120);
  }

  function deviceId() {
    var id = localStorage.getItem("cyberDeviceId");
    if (!id) {
      id =
        "dev_" +
        Math.random().toString(36).slice(2, 10) +
        Math.random().toString(36).slice(2, 6);
      localStorage.setItem("cyberDeviceId", id);
    }
    return id;
  }

  function url() {
    return base + "/players/" + userKey + ".json";
  }

  function setUser(key) {
    userKey = safeKey(key || deviceId());
    return userKey;
  }

  async function pull() {
    if (!enabled) return null;
    if (!userKey) setUser(null);
    try {
      setStatus("syncing");
      /* offline devices can hang a fetch for a long time — cap it so the
         game never stalls on the loading screen waiting for the cloud */
      var ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
      var to = ctrl ? setTimeout(function () { try { ctrl.abort(); } catch (e) {} }, 4000) : null;
      var res = await fetch(url(), { cache: "no-store", signal: ctrl ? ctrl.signal : undefined });
      if (to) clearTimeout(to);
      if (!res.ok) throw new Error("http " + res.status);
      var data = await res.json();
      setStatus("online");
      return data && typeof data === "object" ? data : null;
    } catch (e) {
      setStatus("error");
      return null;
    }
  }

  async function flush() {
    if (!enabled || !pending) return;
    if (!userKey) setUser(null);
    var body = pending;
    pending = null;
    /* offline right now? keep the snapshot and wait for the network */
    if (navigator.onLine === false) {
      pending = body;
      setStatus("local");
      return;
    }
    try {
      setStatus("syncing");
      var res = await fetch(url(), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("http " + res.status);
      setStatus("online");
    } catch (e) {
      /* failed (no network / server hiccup): retry automatically when
         the connection comes back so nothing is ever lost */
      pending = body;
      setStatus("error");
    }
  }

  function queue(snapshot) {
    if (!enabled) return;
    pending = snapshot;
    clearTimeout(timer);
    timer = setTimeout(flush, 900);
  }

  /* retry as soon as the device is back online */
  window.addEventListener("online", function () {
    if (pending) flush();
    else setStatus("online");
  });

  /* best-effort final write when the app goes to background / closes */
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") flush();
  });
  window.addEventListener("pagehide", flush);

  return {
    enabled: enabled,
    setUser: setUser,
    pull: pull,
    queue: queue,
    flush: flush,
    onStatus: onStatus,
    deviceId: deviceId,
  };
})();
