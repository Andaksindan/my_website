async function loadComponent(id, file) {
  const response = await fetch(file);
  const html = await response.text();
  document.getElementById(id).innerHTML = html;
}

loadComponent("header", "/components/header.html");
loadComponent("footer", "/components/footer.html");

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
