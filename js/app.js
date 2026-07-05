/*====================================
        AVAYE GHALAM
        app.js V4.0
====================================*/

"use strict";

// ===============================
// متغیرهای اصلی
// ===============================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const topBtn = document.getElementById("topBtn");
const loader = document.getElementById("loader");
const cartBadge = document.getElementById("cart-count");
const searchInput = document.getElementById("searchInput");

// ===============================
// Loader
// ===============================

window.addEventListener("load", () => {

    if (loader) {

        loader.classList.add("loader-hide");

        setTimeout(() => {

            loader.remove();

        }, 500);

    }

});

// ===============================
// Back To Top
// ===============================

if (topBtn) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 300) {

            topBtn.classList.add("active");

        } else {

            topBtn.classList.remove("active");

        }

    });

    topBtn.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}

// ===============================
// Smooth Scroll
// ===============================

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (e) {

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {

            e.preventDefault();

            target.scrollIntoView({

                behavior: "smooth"

            });

        }

    });

});

// ===============================
// Footer Year
// ===============================

const copyright = document.querySelector(".copyright");

if (copyright) {

    copyright.innerHTML =
        `© ${new Date().getFullYear()} تمامی حقوق متعلق به <strong>نوشت افزار آوای قلم</strong> می باشد.`;

}

// ===============================
// Toast
// ===============================

function showToast(message, type = "success") {

    const toast = document.createElement("div");

    toast.className = `toast-message ${type}`;

    toast.innerHTML = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("show");

    }, 100);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 2500);

}

// ===============================
// Scroll Animation
// ===============================

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

});

document.querySelectorAll(

".product-card,.feature-card,.category-card,.trust-box"

).forEach(item => {

    observer.observe(item);

});

// ===============================
// Cart Functions
// ===============================

function saveCart() {

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    renderCart();

}
function updateCartCount() {

    if (!cartBadge) return;

    let total = 0;

    cart.forEach(item => {

        total += item.qty;

    });

    cartBadge.textContent = total;

}

// ===============================
// پایان بخش اول
// ===============================
// ===============================
// Shopping Cart
// ===============================

function addToCart(product) {

    const existing = cart.find(item => item.id === product.id);

    if (existing) {

        existing.qty++;

        showToast("تعداد محصول افزایش یافت.");

    } else {

        cart.push({

            ...product,

            qty: 1

        });

        showToast("محصول به سبد خرید اضافه شد.");

    }

    saveCart();

}

document.querySelectorAll(".add-to-cart").forEach(button => {

    button.addEventListener("click", () => {

        addToCart({

            id: button.dataset.id,

            name: button.dataset.name,

            price: Number(button.dataset.price)

        });

    });

});

// ===============================
// Render Cart Sidebar
// ===============================

function renderCart() {

    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="text-center py-4">

                <i class="fa-solid fa-cart-shopping fs-1 text-secondary"></i>

                <p class="mt-3">

                    سبد خرید شما خالی است.

                </p>

            </div>

        `;

        cartTotal.innerHTML = "0 تومان";

        return;

    }

    let total = 0;

    cart.forEach(item => {

        total += item.price * item.qty;

        cartItems.innerHTML += `

        <div class="border rounded-4 p-3 mb-3">

            <div class="d-flex justify-content-between">

                <strong>${item.name}</strong>

                <button
                    class="btn btn-sm btn-danger remove-item"
                    data-id="${item.id}">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

            <div class="d-flex align-items-center justify-content-between mt-2">

    <span>تعداد:</span>

    <div class="btn-group">

        <button class="btn btn-sm btn-outline-secondary decrease-item"
                data-id="${item.id}">
            -
        </button>

        <span class="px-3 pt-1">
            ${item.qty}
        </span>

        <button class="btn btn-sm btn-outline-secondary increase-item"
                data-id="${item.id}">
            +
        </button>

    </div>

</div>

            <div>

                قیمت:
                ${item.price.toLocaleString()} تومان

            </div>

        </div>

        `;

    });

    cartTotal.innerHTML = total.toLocaleString() + " تومان";

    document.querySelectorAll(".remove-item").forEach(btn => {

        btn.addEventListener("click", () => {

            removeFromCart(btn.dataset.id);

        });

    });
    document.querySelectorAll(".increase-item").forEach(btn => {

    btn.addEventListener("click", () => {

        increaseQty(btn.dataset.id);

    });

});

document.querySelectorAll(".decrease-item").forEach(btn => {

    btn.addEventListener("click", () => {

        decreaseQty(btn.dataset.id);

    });

});

}

// ===============================
// Remove Product
// ===============================

function removeFromCart(id) {

    cart = cart.filter(item => item.id !== id);

    showToast("محصول حذف شد.","warning");

    saveCart();

}
function increaseQty(id){

    const item = cart.find(p => p.id === id);

    if(item){

        item.qty++;

        saveCart();

    }

}

function decreaseQty(id){

    const item = cart.find(p => p.id === id);

    if(!item) return;

    item.qty--;

    if(item.qty <= 0){

        cart = cart.filter(p => p.id !== id);

    }

    saveCart();

}

// ===============================
// Initial Load
// ===============================

updateCartCount();

renderCart();

// ===============================
// پایان بخش دوم
// ===============================
// ===============================
// Live Product Search
// ===============================

if (searchInput) {

    searchInput.addEventListener("keyup", function () {

        const value = this.value.trim().toLowerCase();

        document.querySelectorAll("#products .col-lg-3").forEach(col => {

            const title =
                col.querySelector("h4")?.textContent.toLowerCase() || "";

            const category =
                col.querySelector(".product-category")?.textContent.toLowerCase() || "";

            if (title.includes(value) || category.includes(value)) {

                col.style.display = "";

            } else {

                col.style.display = "none";

            }

        });

    });

}

// ===============================
// Reset Search
// ===============================

function resetSearch(){

    document.querySelectorAll("#products .col-lg-3").forEach(col=>{

        col.style.display="";

    });

}

// ===============================
// Keyboard Shortcut
// Ctrl + K
// ===============================

document.addEventListener("keydown",function(e){

    if(e.ctrlKey && e.key.toLowerCase()=="k"){

        e.preventDefault();

        if(searchInput){

            searchInput.focus();

            searchInput.select();

        }

    }

});

// ===============================
// Number Formatter
// ===============================

function formatPrice(price){

    return Number(price).toLocaleString("fa-IR")+" تومان";

}

// ===============================
// Welcome
// ===============================

console.log("%cAVAYE GHALAM V4.0","color:#d4af37;font-size:18px;font-weight:bold");

console.log("JavaScript Loaded Successfully");

// ===============================
// Initialize
// ===============================

document.addEventListener("DOMContentLoaded",()=>{


    resetSearch();

});

// ===============================
// END FILE
// ===============================