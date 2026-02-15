// Header Search Js

const searchWrap = document.querySelector(".searchWrap");
const searchBtn = document.querySelector(".searchBtn");
const searchInput = searchWrap.querySelector("input");

searchBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // 🔥 prevent bubbling
  searchWrap.classList.toggle("active");

  if (searchWrap.classList.contains("active")) {
    searchInput.focus();
  } else {
    searchInput.value = "";
  }
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    console.log("Search:", searchInput.value);
  }
});

document.addEventListener("click", () => {
  searchWrap.classList.remove("active");
});

const header = document.querySelector(".header");
const webBody = document.body;
const burger = document.querySelector(".burger");
const dropdownLinks = document.querySelectorAll(".navlist .dropdown > a");

burger.addEventListener("click", (e) => {
  e.stopPropagation(); // prevent immediate outside close

  const isOpen = header.classList.toggle("menu-open");
  webBody.classList.toggle("menu-open-body", isOpen);

  burger.setAttribute("aria-expanded", isOpen);
});

/* Mobile dropdown toggle */
dropdownLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    if (window.innerWidth <= 1199) {
      e.preventDefault();
      e.stopPropagation();

      const parent = link.parentElement;
      parent.classList.toggle("open");
    }
  });
});

/* Close menu on outside click */
document.addEventListener("click", (e) => {
  if (header.classList.contains("menu-open") && !e.target.closest(".header")) {
    header.classList.remove("menu-open");
    webBody.classList.remove("menu-open-body");
    burger.setAttribute("aria-expanded", false);
  }
});

// Count Section JS

const counters = document.querySelectorAll(".count");
let hasAnimated = false;

const animateCounter = (counter) => {
  const target = +counter.dataset.target;
  const duration = 1500; // ms
  const startTime = performance.now();

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(progress * target);

    counter.textContent = `${value}%`;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      counter.textContent = `${target}%`;
    }
  };

  requestAnimationFrame(update);
};

const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && !hasAnimated) {
      counters.forEach(animateCounter);
      hasAnimated = true;
      observer.disconnect();
    }
  },
  { threshold: 0.4 }
);

observer.observe(document.getElementById("countSection"));

//Accordian

const accordionItemHeaders = document.querySelectorAll(
  ".accordion-item-header"
);

accordionItemHeaders.forEach((accordionItemHeader) => {
  accordionItemHeader.addEventListener("click", (event) => {
    // Uncomment in case you only want to allow for the display of only one collapsed item at a time!

    //     const currentlyActiveAccordionItemHeader = document.querySelector(".accordion-item-header.active");
    //     if(currentlyActiveAccordionItemHeader && currentlyActiveAccordionItemHeader!==accordionItemHeader) {
    //        currentlyActiveAccordionItemHeader.classList.toggle("active");
    //        currentlyActiveAccordionItemHeader.nextElementSibling.style.maxHeight = 0;
    //      }

    accordionItemHeader.classList.toggle("active");
    const accordionItemBody = accordionItemHeader.nextElementSibling;
    if (accordionItemHeader.classList.contains("active")) {
      accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + "px";
    } else {
      accordionItemBody.style.maxHeight = 0;
    }
  });
});

// Product Slider JS

// Slider images including the main slider.png as first image
const sliderImages = [
  "./assets/slider.png",
  "./assets/scroll2.png",
  "./assets/scroll5.png",
  "./assets/scroll3.png",
  "./assets/scroll4.png",
  "./assets/scroll2.png",
  "./assets/scroll5.png",
  "./assets/scroll3.png",
  "./assets/scroll4.png",
];
let sliderIndex = 0;
const mainImage = document.getElementById("mainImage");
const dotsContainer = document.getElementById("dots");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const thumbnailsContainer = document.getElementById("thumbnails");
const thumbnailImgs = thumbnailsContainer
  ? thumbnailsContainer.querySelectorAll("img")
  : [];

dotsContainer.innerHTML = "";
sliderImages.forEach((_, index) => {
  const dot = document.createElement("span");
  dot.addEventListener("click", () => setSlider(index));
  dotsContainer.appendChild(dot);
});
const dots = dotsContainer.querySelectorAll("span");

function setSlider(index) {
  sliderIndex = index % sliderImages.length; // Handle circular scrolling
  mainImage.src = sliderImages[sliderIndex];
  mainImage.alt = `Product image ${sliderIndex + 1}`;
  dots.forEach((dot, i) => dot.classList.toggle("active", i === sliderIndex));

  // Update thumbnail visual indicator (only for actual thumbnails, not slider.png)
  thumbnailImgs.forEach((img, i) =>
    img.classList.toggle("active", i === sliderIndex - 1)
  );
}

// Thumbnail click functionality
thumbnailImgs.forEach((thumbnail, index) => {
  thumbnail.addEventListener("click", (e) => {
    e.preventDefault();
    setSlider(index + 1); // +1 because slider.png is at index 0
  });
});

if (prevBtn && nextBtn) {
  prevBtn.addEventListener("click", () => {
    sliderIndex = sliderIndex === 0 ? sliderImages.length - 1 : sliderIndex - 1;
    setSlider(sliderIndex);
  });
  nextBtn.addEventListener("click", () => {
    sliderIndex = sliderIndex === sliderImages.length - 1 ? 0 : sliderIndex + 1;
    setSlider(sliderIndex);
  });
}
setSlider(0);

//Subscription

const plans = document.querySelectorAll(".plan");
const radios = document.querySelectorAll('input[name="plan"]');

radios.forEach((radio, index) => {
  radio.addEventListener("change", () => {
    plans.forEach((plan) => plan.classList.remove("active", "show-double"));

    const selectedPlan = plans[index];
    selectedPlan.classList.add("active");

    if (selectedPlan.dataset.plan === "double") {
      selectedPlan.classList.add("show-double");
    }
  });
});

// Fragrance selection
document.querySelectorAll(".fragranceGrid").forEach((grid) => {
  grid.addEventListener("click", (e) => {
    const item = e.target.closest(".fragrance");
    if (!item) return;

    grid
      .querySelectorAll(".fragrance")
      .forEach((f) => f.classList.remove("active"));

    item.classList.add("active");
  });
});

// Add to Cart Functionality - Update link based on selection
function updateAddToCartLink() {
  const addBtn = document.querySelector(".addBtn");
  if (!addBtn) return;

  const selectedPlanRadio = document.querySelector(
    'input[name="plan"]:checked'
  );
  if (!selectedPlanRadio) return;

  const selectedPlan = selectedPlanRadio.closest(".plan");
  const planType = selectedPlan.dataset.plan || "single";

  // Get selected fragrances
  let selectedFragrances = [];
  const activeFragrances = selectedPlan.querySelectorAll(".fragrance.active");
  activeFragrances.forEach((fragrance) => {
    const fragranceText = fragrance.querySelector("p");
    if (fragranceText) {
      selectedFragrances.push(fragranceText.textContent.toLowerCase());
    }
  });

  // Create unique link based on selections
  const fragmentString = selectedFragrances.join("-");
  const cartLink = `https://example.com/cart/${planType}-${fragmentString}`;

  // Update button attributes for tracking
  addBtn.href = cartLink;
  addBtn.setAttribute("data-cart-link", cartLink);
  addBtn.setAttribute("data-plan", planType);
  addBtn.setAttribute("data-fragrances", fragmentString);
}

// Listen to all changes
document.querySelectorAll('input[name="plan"]').forEach((radio) => {
  radio.addEventListener("change", updateAddToCartLink);
});

document.querySelectorAll('input[type="radio"]').forEach((radio) => {
  radio.addEventListener("change", updateAddToCartLink);
});

// Initialize on page load
updateAddToCartLink();
