document.addEventListener("DOMContentLoaded", function () {

  if (!window.location.pathname.includes("/recipes/")) return;

  const fileName = window.location.pathname.split("/").pop();
  if (!fileName.endsWith(".html")) return;

  const baseName = fileName.replace(".html", "");
  const recipeContent = document.querySelector(".recipe-content");
  if (!recipeContent) return;

  // ===============================
  // IMAGE INJECTION
  // ===============================

  const formats = ["jpg", "png"];

  function tryNextFormat(index) {
    if (index >= formats.length) return;

    const imagePath = `/images/${baseName}.${formats[index]}`;
    const testImg = new Image();
    testImg.src = imagePath;

    testImg.onload = function () {
      injectImage(imagePath);
    };

    testImg.onerror = function () {
      tryNextFormat(index + 1);
    };
  }

  function injectImage(path) {
    const wrapper = document.createElement("div");
    wrapper.className = "recipe-image-wrapper";

    const img = document.createElement("img");
    img.className = "recipe-image";
    img.src = path;
    img.alt = document.title;
    img.loading = "lazy";

    wrapper.appendChild(img);

    const anchor = document.getElementById("recipeImageAnchor");

    if (anchor) {
      anchor.replaceWith(wrapper);
    } else {
      recipeContent.after(wrapper);
    }
  }

  tryNextFormat(0);

  // ===============================
  // PDF DOWNLOAD BUTTON
  // ===============================

  const pageName = fileName.replace(".html", ".pdf");

  const wrapper = document.createElement("div");
  wrapper.className = "download-recipe";

  const link = document.createElement("a");
  link.className = "accent-button";
  link.textContent = "DOWNLOAD THIS RECIPE (PDF)";
  link.href = "../pdfs/" + pageName;

  wrapper.appendChild(link);

  const anchor = document.getElementById("downloadAnchor");

  if (anchor) {
    anchor.replaceWith(wrapper);
  } else {
    document.body.appendChild(wrapper);
  }

});
