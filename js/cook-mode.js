let wakeLock = null;
let fallbackInterval = null;

const toggle = document.getElementById("cookModeToggle");

// If toggle doesn't exist on page, do nothing
if (toggle) {

  // ===============================
  // STATE HANDLING (SMART DEFAULT)
  // ===============================

  const hasPreference = localStorage.getItem("cookMode") !== null;

  if (!hasPreference) {
    // First visit → default OFF
    toggle.checked = false;
  } else {
    // Returning user → restore saved state
    const savedState = localStorage.getItem("cookMode") === "true";
    toggle.checked = savedState;

    if (savedState) {
      enableCookMode();
    }
  }

  // ===============================
  // TOGGLE LISTENER
  // ===============================

  toggle.addEventListener("change", async () => {
    if (toggle.checked) {
      enableCookMode();
      localStorage.setItem("cookMode", "true");
    } else {
      disableCookMode();
      localStorage.setItem("cookMode", "false");
    }
  });

  // ===============================
  // ENABLE COOK MODE
  // ===============================

  async function enableCookMode() {
    try {
      if ("wakeLock" in navigator) {
        wakeLock = await navigator.wakeLock.request("screen");
        console.log("Wake Lock active");
      }
    } catch (err) {
      console.log("Wake Lock failed:", err);
    }

    // iOS fallback
    fallbackInterval = setInterval(() => {
      console.log("Keeping screen awake...");
    }, 20000);
  }

  // ===============================
  // DISABLE COOK MODE
  // ===============================

  async function disableCookMode() {
    if (wakeLock !== null) {
      await wakeLock.release();
      wakeLock = null;
    }

    clearInterval(fallbackInterval);
  }

  // ===============================
  // REAPPLY ON TAB RETURN
  // ===============================

  document.addEventListener("visibilitychange", async () => {
    if (toggle.checked && document.visibilityState === "visible") {
      try {
        if ("wakeLock" in navigator) {
          wakeLock = await navigator.wakeLock.request("screen");
        }
      } catch {}
    }
  });

}
