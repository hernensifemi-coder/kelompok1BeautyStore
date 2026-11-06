const products = [
  {
    id: 1,
    name: "Serum Vitamin C",
    price: 129000,
    image: "images/Serum_VitaaminC.jpeg",
    category: "skincare"
  },
  {
    id: 2,
    name: "Moisturizer Hyaluronic",
    price: 99000,
    image: "images/Moisturizer.jpeg",
    category: "skincare"
  },
  {
    id: 3,
    name: "Sunscreen SPF 50",
    price: 89000,
    image: "images/Sunscreen.jpeg",
    category: "skincare"
  },
  {
    id: 4,
    name: "Lip Tint Natural",
    price: 65000,
    image: "images/Lip_Tint.jpeg",
    category: "makeup"
  },
  {
    id: 5,
    name: "Facial Cleanser",
    price: 75000,
    image: "images/Facial_Cleanser.jpeg",
    category: "skincare"
  },
  {
    id: 6,
    name: "Eye Cream",
    price: 110000,
    image: "images/Eye_Cream.jpeg",
    category: "skincare"
  }
];

let cart = [];

const productList = document.getElementById("product-list");
const cartCount = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartBtn = document.getElementById("cart-btn");
const closeCart = document.getElementById("close-cart");
const checkoutBtn = document.getElementById("checkout-btn");

const paymentModal = document.getElementById("payment-modal");
const closePayment = document.getElementById("close-payment");
const paymentTotal = document.getElementById("payment-total");
const paymentForm = document.getElementById("payment-form");

const successModal = document.getElementById("success-modal");
const closeSuccessBtn = document.getElementById("close-success-btn");
const orderReceipt = document.getElementById("order-receipt");

const searchInput = document.getElementById("search-input");
const filterBtns = document.querySelectorAll(".filter-btn");

let currentCategory = "all";
let currentSearch = "";

document.addEventListener("DOMContentLoaded", () => {
  loadCartFromStorage();
  renderProducts();
});

function renderProducts() {
  productList.innerHTML = "";
  
  const filtered = products.filter(product => {
    const matchesCategory = currentCategory === "all" || product.category === currentCategory;
    const matchesSearch = product.name.toLowerCase().includes(currentSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    productList.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888;">Produk tidak ditemukan.</p>`;
    return;
  }

  filtered.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <div class="price">Rp ${product.price.toLocaleString("id-ID")}</div>
        <button class="add-to-cart" data-id="${product.id}">+ Keranjang</button>
      </div>
    `;
    productList.appendChild(card);
  });

  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", function() {
      const id = parseInt(this.dataset.id);
      const product = products.find(p => p.id === id);
      
      const existing = cart.find(item => item.id === id);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ ...product, qty: 1 });
      }
      
      updateCart();
      
      this.textContent = "Ditambahkan ✓";
      this.style.background = "#4caf50";
      setTimeout(() => {
        this.textContent = "+ Keranjang";
        this.style.background = "#e91e63";
      }, 1200);
    });
  });
}

function updateCart() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  
  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="empty-cart">Keranjang masih kosong</p>`;
    cartTotal.textContent = "Rp 0";
    saveCartToStorage();
    return;
  }
  
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>Rp ${item.price.toLocaleString("id-ID")}</p>
        <div class="cart-qty-control">
          <button class="qty-btn btn-minus" data-id="${item.id}">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn btn-plus" data-id="${item.id}">+</button>
        </div>
      </div>
      <button class="remove-item" data-id="${item.id}">🗑</button>
    </div>
  `).join("");
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  cartTotal.textContent = `Rp ${total.toLocaleString("id-ID")}`;
  
  document.querySelectorAll(".btn-minus").forEach(btn => {
    btn.addEventListener("click", function() {
      const id = parseInt(this.dataset.id);
      const item = cart.find(i => i.id === id);
      if (item.qty > 1) {
        item.qty -= 1;
      } else {
        cart = cart.filter(i => i.id !== id);
      }
      updateCart();
    });
  });

  document.querySelectorAll(".btn-plus").forEach(btn => {
    btn.addEventListener("click", function() {
      const id = parseInt(this.dataset.id);
      const item = cart.find(i => i.id === id);
      item.qty += 1;
      updateCart();
    });
  });

  document.querySelectorAll(".remove-item").forEach(btn => {
    btn.addEventListener("click", function() {
      const id = parseInt(this.dataset.id);
      cart = cart.filter(item => item.id !== id);
      updateCart();
    });
  });

  saveCartToStorage();
}

function saveCartToStorage() {
  localStorage.setItem("beauty_store_cart", JSON.stringify(cart));
}

function loadCartFromStorage() {
  const savedCart = localStorage.getItem("beauty_store_cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCart();
  }
}

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value;
    renderProducts();
  });
}

filterBtns.forEach(btn => {
  btn.addEventListener("click", function() {
    filterBtns.forEach(b => b.classList.remove("active"));
    this.classList.add("active");
    currentCategory = this.dataset.category;
    renderProducts();
  });
});

cartBtn.addEventListener("click", () => {
  cartModal.classList.add("active");
});

closeCart.addEventListener("click", () => {
  cartModal.classList.remove("active");
});

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Keranjang kamu masih kosong!");
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  paymentTotal.textContent = `Rp ${total.toLocaleString("id-ID")}`;
  
  cartModal.classList.remove("active");
  paymentModal.classList.add("active");
});

closePayment.addEventListener("click", () => {
  paymentModal.classList.remove("active");
});

paymentForm.addEventListener("submit", function(e) {
  e.preventDefault();
  
  const name = document.getElementById("cust-name").value;
  const phone = document.getElementById("cust-phone").value;
  const address = document.getElementById("cust-address").value;
  const method = document.querySelector('input[name="payment_method"]:checked').value;
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  const orderId = "BST-" + Math.floor(100000 + Math.random() * 900000);

  orderReceipt.innerHTML = `
    <p><strong>No. Pesanan:</strong> ${orderId}</p>
    <p><strong>Nama:</strong> ${name} (${phone})</p>
    <p><strong>Alamat:</strong> ${address}</p>
    <p><strong>Metode Pembayaran:</strong> ${method}</p>
    <p><strong>Total Pembayaran:</strong> Rp ${total.toLocaleString("id-ID")}</p>
  `;

  cart = [];
  updateCart();

  this.reset();

  paymentModal.classList.remove("active");
  successModal.classList.add("active");
});

closeSuccessBtn.addEventListener("click", () => {
  successModal.classList.remove("active");
});

document.getElementById("contact-form").addEventListener("submit", function(e) {
  e.preventDefault();
  alert("Pesan berhasil dikirim!");
  this.reset();
});