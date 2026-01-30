async function loadComponent(id, file) {
  try {
    const response = await fetch(`${file}?v=${new Date().getTime()}`);
    if (!response.ok) throw new Error(`Failed to load ${file}`);
    const html = await response.text();
    document.getElementById(id).innerHTML = html;
  } catch (error) {
    console.error(error);
  }
}

loadComponent("header", "/components/header.html");

/* Lazy-load blur images */
document.addEventListener("DOMContentLoaded", () => {
  // FILTERING LOGIC
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".card-grid .card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove active class from all
      filterBtns.forEach(b => b.classList.remove("active"));
      // Add active class to clicked
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      cards.forEach(card => {
        // Assume category is in a hidden element or attribute. 
        // Current HTML doesn't explicitly store category on the .card element itself, 
        // but some have placeholder classes or links. 
        // Let's improve robustness by checking the link href or a custom attribute if added.
        // For existing structure: 
        // - Featured card has /movies/article.html -> Movies
        // - Cars placeholder -> Cars
        // - Watch card -> Watches
        // - Lifestyle placeholder -> Lifestyle
        // - Anime card -> Anime

        let category = "other";
        const link = card.querySelector("a")?.getAttribute("href") || "";
        const imgDiv = card.querySelector(".card-image");

        if (link.includes("movies") || imgDiv?.classList.contains("placeholder-movies")) category = "Movies";
        else if (link.includes("watches") || imgDiv?.classList.contains("placeholder-watches")) category = "Watches";
        else if (link.includes("cars") || imgDiv?.classList.contains("placeholder-cars")) category = "Cars";
        else if (link.includes("lifestyle") || imgDiv?.classList.contains("placeholder-lifestyle")) category = "Lifestyle";
        else if (link.includes("anime") || imgDiv?.classList.contains("placeholder-anime")) category = "Anime";

        if (filter === "all" || filter === category) {
          card.style.display = "flex";
          setTimeout(() => card.style.opacity = "1", 50);
        } else {
          card.style.display = "none";
          card.style.opacity = "0";
        }
      });
    });
  });

  // DARK MODE LOGIC
  const toggleBtn = document.getElementById("dark-mode-toggle");
  // Check local storage
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    if (toggleBtn) toggleBtn.textContent = "☀️";
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      toggleBtn.textContent = isDark ? "☀️" : "🌙";
    });
  }

  const images = document.querySelectorAll("img[data-src]");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.onload = () => {
          img.parentElement.classList.add("loaded");
        };
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => observer.observe(img));
});
