/* =========================
   NAVIGATION
========================= */

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("show");

    const icon = menuBtn.querySelector("i");

    if (navMenu.classList.contains("show")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
    } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }
});

document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("show");

        const icon = menuBtn.querySelector("i");
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    });
});


/* =========================
   CART
========================= */

const cartBtn = document.getElementById("cartBtn");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

let cart = JSON.parse(localStorage.getItem("brewBeanCart")) || [];

function saveCart() {
    localStorage.setItem("brewBeanCart", JSON.stringify(cart));
}

function openCart() {
    cartSidebar.classList.add("show");
    cartOverlay.classList.add("show");
    document.body.classList.add("no-scroll");
}

function closeCartSidebar() {
    cartSidebar.classList.remove("show");
    cartOverlay.classList.remove("show");
    document.body.classList.remove("no-scroll");
}

cartBtn.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartSidebar);
cartOverlay.addEventListener("click", closeCartSidebar);


function addToCart(name, price, customization = null) {

    const itemId = customization
        ? `${name}-${customization.size}-${customization.milk}-${customization.extraShot}`
        : name;

    const existingItem = cart.find(item => (item.id || item.name) === itemId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: itemId,
            name: name,
            price: Number(price),
            quantity: 1,
            customization
        });
    }

    saveCart();
    renderCart();
    showToast(`${name} added to cart!`);
}


document.querySelectorAll(".add-cart-btn").forEach(button => {

    button.addEventListener("click", () => {

            openCustomizeModal(button.dataset.name, Number(button.dataset.price));

    });

});


function changeQuantity(id, change) {

    const item = cart.find(item => (item.id || item.name) === id);

    if (!item) {
        return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(cartItem => (cartItem.id || cartItem.name) !== id);
    }

    saveCart();
    renderCart();
}


function removeFromCart(id) {

    cart = cart.filter(item => (item.id || item.name) !== id);

    saveCart();
    renderCart();

}


function renderCart() {

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {

        cartItemsContainer.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;

    } else {

        cart.forEach(item => {

            const cartItem = document.createElement("div");

            cartItem.className = "cart-item";

            cartItem.innerHTML = `
                <div class="cart-item-info">

                    <h4>${escapeHTML(item.name)}</h4>

                    ${item.customization ? `
                        <small class="cart-customization">
                            ${escapeHTML(item.customization.size)} · ${escapeHTML(item.customization.milk)} milk${item.customization.extraShot ? " · Extra shot" : ""}
                        </small>
                    ` : ""}

                    <span class="cart-item-price">
                        ₹${item.price} × ${item.quantity}
                    </span>

                    <div class="quantity-controls">

                        <button class="minus-btn">−</button>

                        <span>${item.quantity}</span>

                        <button class="plus-btn">+</button>

                    </div>

                </div>

                <button class="remove-item">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;

            cartItem
                .querySelector(".minus-btn")
                .addEventListener("click", () => {
                    changeQuantity(item.id || item.name, -1);
                });

            cartItem
                .querySelector(".plus-btn")
                .addEventListener("click", () => {
                    changeQuantity(item.id || item.name, 1);
                });

            cartItem
                .querySelector(".remove-item")
                .addEventListener("click", () => {
                    removeFromCart(item.id || item.name);
                });

            cartItemsContainer.appendChild(cartItem);

        });

    }

    updateCartSummary();
}


function updateCartSummary() {

    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    cartCount.textContent = totalItems;
    cartTotal.textContent = `₹${totalPrice}`;
}


const checkoutModal = document.getElementById("checkoutModal");
const checkoutOverlay = document.getElementById("checkoutOverlay");
const closeCheckout = document.getElementById("closeCheckout");
const checkoutForm = document.getElementById("checkoutForm");
const orderSummary = document.getElementById("orderSummary");
const checkoutTotal = document.getElementById("checkoutTotal");
const addressGroup = document.getElementById("addressGroup");
const checkoutAddress = document.getElementById("checkoutAddress");
const orderConfirmation = document.getElementById("orderConfirmation");
const confirmationMessage = document.getElementById("confirmationMessage");
const continueShopping = document.getElementById("continueShopping");

function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderOrderSummary() {
    orderSummary.innerHTML = cart.map(item => `
        <div class="summary-item">
            <span>${escapeHTML(item.name)} × ${item.quantity}</span>
            <strong>₹${item.price * item.quantity}</strong>
        </div>
    `).join("");
    checkoutTotal.textContent = `₹${getCartTotal()}`;
}

function openCheckout() {
    if (cart.length === 0) {
        showToast("Your cart is empty.");
        return;
    }

    closeCartSidebar();
    checkoutForm.hidden = false;
    orderConfirmation.hidden = true;
    checkoutForm.reset();
    addressGroup.hidden = true;
    checkoutAddress.required = false;
    renderOrderSummary();
    checkoutModal.classList.add("show");
    checkoutOverlay.classList.add("show");
    document.body.classList.add("no-scroll");
}

function closeCheckoutModal() {
    checkoutModal.classList.remove("show");
    checkoutOverlay.classList.remove("show");
    document.body.classList.remove("no-scroll");
}

checkoutBtn.addEventListener("click", openCheckout);
closeCheckout.addEventListener("click", closeCheckoutModal);
checkoutOverlay.addEventListener("click", closeCheckoutModal);

document.querySelectorAll('input[name="fulfillment"]').forEach(option => {
    option.addEventListener("change", () => {
        const isDelivery = option.value === "delivery" && option.checked;
        addressGroup.hidden = !isDelivery;
        checkoutAddress.required = isDelivery;
        checkoutTotal.textContent = `₹${getCartTotal() + (isDelivery ? 40 : 0)}`;
    });
});

checkoutForm.addEventListener("submit", event => {
    event.preventDefault();

    const customerName = document.getElementById("checkoutName").value.trim();
    const fulfillment = document.querySelector('input[name="fulfillment"]:checked').value;
    const orderNumber = `BB-${Date.now().toString().slice(-6)}`;
    const total = getCartTotal() + (fulfillment === "delivery" ? 40 : 0);

    checkoutForm.hidden = true;
    confirmationMessage.textContent = `${customerName}, your ${fulfillment} order #${orderNumber} for ₹${total} has been received.`;
    orderConfirmation.hidden = false;
    cart = [];
    saveCart();
    renderCart();
});

continueShopping.addEventListener("click", closeCheckoutModal);


/* =========================
   MENU SEARCH & FILTER
========================= */

const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const menuGrid = document.getElementById("menuGrid");
const noResults = document.getElementById("noResults");

const coffeeMenu = [
    {
        name: "Cappuccino",
        category: "hot",
        label: "Hot",
        description: "Rich espresso topped with silky milk foam.",
        price: 180,
        badge: "Popular",
        image: "https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?auto=format&fit=crop&w=700&q=80"
    },
    {
        name: "Espresso",
        category: "espresso",
        label: "Hot",
        description: "Bold, rich and intense with a smooth finish.",
        price: 140,
        image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=700&q=80"
    },
    {
        name: "Latte",
        category: "hot",
        label: "Hot",
        description: "Smooth espresso blended with steamed milk.",
        price: 190,
        badge: "Popular",
        image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=700&q=80"
    },
    {
        name: "Mocha",
        category: "special",
        label: "Special",
        description: "Espresso, chocolate and steamed creamy milk.",
        price: 220,
        image: "https://images.unsplash.com/photo-1578314675249-a69141428ca8?auto=format&fit=crop&w=700&q=80"
    },
    {
        name: "Americano",
        category: "hot",
        label: "Hot",
        description: "Espresso combined with hot water for a clean taste.",
        price: 160,
        image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=700&q=80"
    },
    {
        name: "Cold Coffee",
        category: "cold",
        label: "Cold",
        description: "Chilled coffee blended with creamy milk and ice.",
        price: 210,
        image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=700&q=80"
    },
    {
        name: "Caramel Macchiato",
        category: "special",
        label: "Special",
        description: "Espresso, vanilla, milk and caramel drizzle.",
        price: 240,
        badge: "Chef's choice",
        image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=700&q=80"
    },
    {
        name: "Chocolate Frappe",
        category: "cold",
        label: "Cold",
        description: "Ice-blended chocolate coffee with whipped cream.",
        price: 250,
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=80"
    },
    {
        name: "Masala Chai",
        category: "tea",
        label: "Tea",
        description: "Fragrant black tea simmered with warming spices.",
        price: 120,
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=700&q=80"
    },
    {
        name: "Butter Croissant",
        category: "dessert",
        label: "Dessert",
        description: "A flaky, golden pastry baked fresh each morning.",
        price: 150,
        badge: "Fresh today",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=700&q=80"
    },
    {
        name: "Cinnamon Toast",
        category: "snack",
        label: "Snack",
        description: "Griddled sourdough with cinnamon butter and honey.",
        price: 160,
        image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=700&q=80"
    }
];

function renderMenu() {
    menuGrid.innerHTML = coffeeMenu.map(coffee => `
        <article class="coffee-card" data-name="${coffee.name}" data-category="${coffee.category}">
            <div class="coffee-image">
                <img src="${coffee.image}" alt="${coffee.name}" loading="lazy">
                <span class="category-tag">${coffee.label}</span>
                ${coffee.badge ? `<span class="menu-badge">${coffee.badge}</span>` : ""}
            </div>
            <div class="coffee-info">
                <h3>${coffee.name}</h3>
                <p>${coffee.description}</p>
                <div class="coffee-bottom">
                    <span class="price">₹${coffee.price}</span>
                    <button class="add-cart-btn" data-name="${coffee.name}" data-price="${coffee.price}">
                        Add to Cart
                    </button>
                </div>
            </div>
        </article>
    `).join("");

    menuGrid.querySelectorAll(".add-cart-btn").forEach(button => {
        button.addEventListener("click", () => {
            openCustomizeModal(button.dataset.name, Number(button.dataset.price));
        });
    });
}

const customizeModal = document.getElementById("customizeModal");
const customizeOverlay = document.getElementById("customizeOverlay");
const closeCustomize = document.getElementById("closeCustomize");
const customizeDrinkName = document.getElementById("customizeDrinkName");
const customizePrice = document.getElementById("customizePrice");
const addCustomizedBtn = document.getElementById("addCustomizedBtn");
const extraShot = document.getElementById("extraShot");
let selectedDrink = null;

function getSelectedOption(name) {
    return document.querySelector(`input[name="${name}"]:checked`);
}

function updateCustomizePrice() {
    if (!selectedDrink) {
        return;
    }

    const size = getSelectedOption("size");
    const milk = getSelectedOption("milk");
    const total = selectedDrink.price +
        Number(size.dataset.extra) +
        Number(milk.dataset.extra) +
        (extraShot.checked ? Number(extraShot.dataset.extra) : 0);

    customizePrice.textContent = `₹${total}`;
}

function openCustomizeModal(name, price) {
    selectedDrink = { name, price };
    customizeDrinkName.textContent = name;
    document.querySelector('input[name="size"][value="Small"]').checked = true;
    document.querySelector('input[name="milk"][value="Regular"]').checked = true;
    extraShot.checked = false;
    updateCustomizePrice();
    customizeModal.classList.add("show");
    customizeOverlay.classList.add("show");
    document.body.classList.add("no-scroll");
}

function closeCustomizeModal() {
    customizeModal.classList.remove("show");
    customizeOverlay.classList.remove("show");
    document.body.classList.remove("no-scroll");
    selectedDrink = null;
}

document.querySelectorAll('.customize-options input, #extraShot').forEach(input => {
    input.addEventListener("change", updateCustomizePrice);
});

addCustomizedBtn.addEventListener("click", () => {
    if (!selectedDrink) {
        return;
    }

    const size = getSelectedOption("size");
    const milk = getSelectedOption("milk");
    const customization = {
        size: size.value,
        milk: milk.value,
        extraShot: extraShot.checked
    };

    const total = Number(customizePrice.textContent.replace("₹", ""));
    addToCart(selectedDrink.name, total, customization);
    closeCustomizeModal();
});

closeCustomize.addEventListener("click", closeCustomizeModal);
customizeOverlay.addEventListener("click", closeCustomizeModal);

renderMenu();

const coffeeCards = document.querySelectorAll(".coffee-card");

let currentCategory = "all";

function filterMenu() {

    const searchText = searchInput.value.toLowerCase().trim();

    let visibleCards = 0;

    coffeeCards.forEach(card => {

        const name = card.dataset.name.toLowerCase();
        const category = card.dataset.category;

        const matchesSearch = name.includes(searchText);

        const matchesCategory =
            currentCategory === "all" ||
            category === currentCategory;

        if (matchesSearch && matchesCategory) {

            card.style.display = "";

            visibleCards++;

        } else {

            card.style.display = "none";

        }

    });

    noResults.style.display =
        visibleCards === 0 ? "block" : "none";
}


searchInput.addEventListener("input", filterMenu);


filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentCategory = button.dataset.category;

        filterMenu();

    });

});


/* =========================
   TOAST
========================= */

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

let toastTimer;

function showToast(message) {

    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);

}


/* =========================
   CONTACT FORM
========================= */

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const reservationForm = document.getElementById("reservationForm");
const reservationDate = document.getElementById("reservationDate");
const reservationMessage = document.getElementById("reservationMessage");

const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
reservationDate.min = localToday;

reservationForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("reservationName").value.trim();
    const date = reservationDate.value;
    const time = document.getElementById("reservationTime").value;
    const guests = document.getElementById("reservationGuests").value;

    if (date < localToday) {
        reservationMessage.textContent = "Please choose today or a future date.";
        reservationMessage.style.color = "var(--danger)";
        return;
    }

    reservationMessage.textContent = `Thanks, ${name}. Your table for ${guests} on ${date} at ${time} is reserved.`;
    reservationMessage.style.color = "var(--coffee)";
    reservationForm.reset();
    reservationDate.min = localToday;
});

contactForm.addEventListener("submit", event => {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {

        formMessage.textContent =
            "Please fill in all fields.";

        formMessage.style.color = "#c95d4b";

        return;
    }

    if (!validateEmail(email)) {

        formMessage.textContent =
            "Please enter a valid email address.";

        formMessage.style.color = "#c95d4b";

        return;
    }

    formMessage.textContent =
        "Thank you! Your message has been sent.";

    formMessage.style.color = "#6f4e37";

    contactForm.reset();

});


function validateEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}


/* =========================
   COUNTDOWN
========================= */

const targetDate = new Date();

targetDate.setDate(targetDate.getDate() + 3);
targetDate.setHours(23, 59, 59, 0);

function updateCountdown() {

    const now = new Date();

    const difference = targetDate - now;

    if (difference <= 0) {

        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";

        return;
    }

    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
        (difference / 1000) % 60
    );

    document.getElementById("days").textContent =
        String(days).padStart(2, "0");

    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");
}

updateCountdown();

setInterval(updateCountdown, 1000);


/* =========================
   ORDER BUTTONS
========================= */

const heroOrderBtn = document.getElementById("heroOrderBtn");
const offerOrderBtn = document.getElementById("offerOrderBtn");

function goToMenu() {

    document.getElementById("menu").scrollIntoView({
        behavior: "smooth"
    });

}

heroOrderBtn.addEventListener("click", goToMenu);
offerOrderBtn.addEventListener("click", goToMenu);


/* =========================
   BACK TO TOP
========================= */

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }

});


backToTop.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


/* =========================
   PREMIUM INTERACTIONS
========================= */

const header = document.querySelector(".header");
const hero = document.querySelector(".hero");

window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 40);

    if (window.scrollY < hero.offsetHeight) {
        hero.style.setProperty("--hero-shift", `${window.scrollY * 0.12}px`);
    }
}, { passive: true });

document.querySelectorAll("main > section").forEach(section => {
    section.classList.add("reveal");
});

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(section => {
    revealObserver.observe(section);
});

const navLinks = document.querySelectorAll(".nav-link");
const sectionLinks = document.querySelectorAll("main section[id]");

const activeSectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        }

        navLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
    });
}, { rootMargin: "-35% 0px -55% 0px" });

sectionLinks.forEach(section => activeSectionObserver.observe(section));

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeLightbox = document.getElementById("closeLightbox");

function closeGalleryLightbox() {
    lightbox.classList.remove("show");
    document.body.classList.remove("no-scroll");
}

document.querySelectorAll(".gallery-item").forEach(item => {
    item.addEventListener("click", () => {
        const image = item.querySelector("img");
        const caption = item.querySelector("span");
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightboxCaption.textContent = caption.textContent;
        lightbox.classList.add("show");
        document.body.classList.add("no-scroll");
    });
});

closeLightbox.addEventListener("click", closeGalleryLightbox);
lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
        closeGalleryLightbox();
    }
});

const reviewsTrack = document.querySelector(".reviews-grid");
const reviewCards = document.querySelectorAll(".review-card");
const reviewPosition = document.getElementById("reviewPosition");
const previousReview = document.getElementById("previousReview");
const nextReview = document.getElementById("nextReview");
let currentReview = 0;

function updateReviewCarousel() {
    const visibleReviews = window.innerWidth <= 650 ? 1 : window.innerWidth <= 1000 ? 2 : 3;
    const maxReview = Math.max(0, reviewCards.length - visibleReviews);
    currentReview = Math.min(currentReview, maxReview);
    const cardWidth = reviewCards[0].getBoundingClientRect().width;
    const gap = 25;
    reviewsTrack.style.transform = `translateX(-${currentReview * (cardWidth + gap)}px)`;
    reviewPosition.textContent = `${String(currentReview + 1).padStart(2, "0")} / ${String(maxReview + 1).padStart(2, "0")}`;
    previousReview.disabled = currentReview === 0;
    nextReview.disabled = currentReview === maxReview;
}

previousReview.addEventListener("click", () => {
    currentReview--;
    updateReviewCarousel();
});

nextReview.addEventListener("click", () => {
    currentReview++;
    updateReviewCarousel();
});

window.addEventListener("resize", updateReviewCarousel);
updateReviewCarousel();

document.querySelectorAll("img").forEach(image => {
    if (!image.closest(".hero")) {
        image.loading = "lazy";
    }
});


/* =========================
   HELPER
========================= */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* =========================
   INITIAL LOAD
========================= */

renderCart();