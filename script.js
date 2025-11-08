let cart = [];
const cartBtn = document.getElementById('cartBtn');
const cartPanel = document.getElementById('cartPanel');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');

// Toggle keranjang
function toggleCart() {
  cartPanel.classList.toggle('active');
}

cartBtn.addEventListener('click', toggleCart);

// Fungsi animasi keranjang kecil
function flyCartIcon(btn) {
  const miniCart = document.createElement('div');
  miniCart.textContent = '🛒';
  miniCart.style.position = 'fixed';
  miniCart.style.fontSize = '30px';
  miniCart.style.transition = 'transform 0.8s ease-in-out, opacity 0.8s ease-in-out';
  miniCart.style.zIndex = '9999';
  miniCart.style.pointerEvents = 'none';
  document.body.appendChild(miniCart);

  const btnRect = btn.getBoundingClientRect();
  const cartRect = cartBtn.getBoundingClientRect();

  miniCart.style.left = btnRect.left + btnRect.width / 2 - 15 + 'px';
  miniCart.style.top = btnRect.top + btnRect.height / 2 - 15 + 'px';

  const x = cartRect.left + cartRect.width / 2 - btnRect.left - 15;
  const y = cartRect.top + cartRect.height / 2 - btnRect.top - 15;

  requestAnimationFrame(() => {
    miniCart.style.transform = `translate(${x}px, ${y}px) scale(0.5)`;
    miniCart.style.opacity = '0';
  });

  setTimeout(() => miniCart.remove(), 800);
}

// Fungsi menambahkan ke keranjang
function addToCart(btn, name, price) {
  flyCartIcon(btn);

  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCart();
}

// Update isi keranjang
function updateCart() {
  cartItems.innerHTML = "";
  let total = 0, count = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    count += item.qty;

    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <p><strong>${item.name}</strong> (Rp${item.price.toLocaleString('id-ID')})</p>
      <div class="qty-controls">
        <button onclick="changeQty('${item.name}', -1)">-</button>
        <span>${item.qty}</span>
        <button onclick="changeQty('${item.name}', 1)">+</button>
      </div>
    `;
    cartItems.appendChild(div);
  });

  cartTotal.textContent = total.toLocaleString('id-ID');
  cartCount.textContent = count;
}

// Fungsi mengubah jumlah
function changeQty(name, delta) {
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.name !== name);
  updateCart();
}

// Checkout
function checkout() {
  if (cart.length === 0) {
    alert("Keranjang masih kosong!");
    return;
  }

  let message = "Halo, saya ingin memesan:\n";
  let total = 0;

  cart.forEach(item => {
    message += `- ${item.name} x${item.qty} = Rp${(item.price * item.qty).toLocaleString('id-ID')}\n`;
    total += item.price * item.qty;
  });

  message += `\nTotal: Rp${total.toLocaleString('id-ID')}`;
  const encoded = encodeURIComponent(message);
  const waUrl = `https://wa.me/6285171600209?text=${encoded}`;
  window.open(waUrl, '_blank');
}
