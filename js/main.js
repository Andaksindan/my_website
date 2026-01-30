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
