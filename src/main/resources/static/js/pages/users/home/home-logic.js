const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".dot");

const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const slider = document.querySelector(".hero-slider");

let currentSlide = 0;
let autoSlide;

function showSlide(index) {
  if (index >= slides.length) {
    currentSlide = 0;
  }

  if (index < 0) {
    currentSlide = slides.length - 1;
  }

  slides.forEach((slide) => {
    slide.classList.remove("active");
  });

  dots.forEach((dot) => {
    dot.classList.remove("active");
  });

  slides[currentSlide].classList.add("active");
  dots[currentSlide].classList.add("active");
}

function nextSlide() {
  currentSlide++;

  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide--;

  showSlide(currentSlide);
}

/* nút */

nextBtn.addEventListener("click", nextSlide);

prevBtn.addEventListener("click", prevSlide);

/* dot */

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentSlide = index;

    showSlide(currentSlide);
  });
});

/* tự động chạy */

function startAutoSlide() {
  autoSlide = setInterval(nextSlide, 4000);
}

/* hover thì dừng */

function stopAutoSlide() {
  clearInterval(autoSlide);
}

slider.addEventListener("mouseenter", stopAutoSlide);

slider.addEventListener("mouseleave", startAutoSlide);

/* bắt đầu */
function setupProductSlider(
  productsSelector,
  nextSelector,
  prevSelector,
  delay = 3000,
) {
  const products = document.querySelector(productsSelector);
  const next = document.querySelector(nextSelector);
  const prev = document.querySelector(prevSelector);

  if (!products || !next || !prev) return;

  // NEXT
  next.addEventListener("click", () => {
    products.scrollBy({
      left: products.clientWidth,
      behavior: "smooth",
    });
  });

  // PREVIOUS
  prev.addEventListener("click", () => {
    products.scrollBy({
      left: -products.clientWidth,
      behavior: "smooth",
    });
  });

  // TỰ ĐỘNG TRƯỢT
  setInterval(() => {
    const maxScroll = products.scrollWidth - products.clientWidth;

    if (products.scrollLeft < maxScroll - 10) {
      products.scrollBy({
        left: products.clientWidth,
        behavior: "smooth",
      });
    } else {
      products.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }
  }, delay);
}

// EVENT
setupProductSlider(".event-products", ".event-next", ".event-prev", 3000);

let categoryNumber = document.querySelectorAll(".category-products").length;
for (let i = 0; i < categoryNumber; i++) {
  // CATEGORY
  setupProductSlider(
    ".category-products",
    ".category-next",
    ".category-prev",
    3500,
  );
}

startAutoSlide();
