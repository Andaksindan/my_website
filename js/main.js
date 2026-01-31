/**
 * Now & Noticed - Main JavaScript
 * 
 * Core functionality:
 * 1. Component loading (header/footer)
 * 2. Card filtering on home page
 * 3. Lazy-loading images with blur effect
 * 4. Reading progress bar
 */

// =========================
// GLOBAL ELEMENTS & STATE
// =========================
let progressBar;

// =========================
// COMPONENT LOADER
// =========================
async function loadComponent(id, file) {
  try {
    const response = await fetch(`${file}?v=${new Date().getTime()}`);
    if (!response.ok) throw new Error(`Failed to load ${file}`);
    const html = await response.text();
    const target = document.getElementById(id);
    if (target) {
      target.innerHTML = html;
    }
  } catch (error) {
    console.error("Error loading component:", error);
  }
}

// =========================
// PROGRESS BAR
// =========================
function updateProgressBar() {
  if (!progressBar) {
    progressBar = document.querySelector('.reading-progress');
  }
  if (!progressBar) return;

  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight - windowHeight;
  const scrollTop = window.scrollY;
  const scrollPercentage = (scrollTop / (documentHeight || 1)) * 100;

  progressBar.style.width = Math.min(scrollPercentage, 100) + '%';
  if (scrollTop > 100) progressBar.classList.add('visible');
  else progressBar.classList.remove('visible');
}

// =========================
// DOM CONTENT LOADED
// =========================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Filtering logic for cards
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".card-grid .card");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      cards.forEach(card => {
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

  // 2. Setup progress bar
  if (!document.querySelector('.reading-progress')) {
    progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.prepend(progressBar);
  }
  window.addEventListener('scroll', updateProgressBar);
  window.addEventListener('resize', updateProgressBar);
  updateProgressBar();

  // 3. Load header
  loadComponent("header", "/components/header.html");

  // 4. Image lazy loading
  const images = document.querySelectorAll("img[data-src]");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.onload = () => img.parentElement.classList.add("loaded");
        observer.unobserve(img);
      }
    });
  });
  images.forEach(img => observer.observe(img));
});
