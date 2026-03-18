let wakeLock = null;
let fallbackInterval = null;

const toggle = document.getElementById("cookModeToggle");

// If toggle doesn't exist on page, do nothing
if (toggle) {

toggle.checked = false;

toggle.addEventListener("change", async () => {
  if (toggle.checked) {
    enableCookMode();
  } else {
    disableCookMode();
  }
});

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

  async function disableCookMode() {
    if (wakeLock !== null) {
      await wakeLock.release();
      wakeLock = null;
    }

    clearInterval(fallbackInterval);
  }

  // Reapply when returning to tab
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
