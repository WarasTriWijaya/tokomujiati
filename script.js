let cart = [];
const cartBtn = document.getElementById('cartBtn');
const cartPanel = document.getElementById('cartPanel');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');

function toggleCart() {
  cartPanel.classList.toggle('active');
}

cartBtn.addEventListener('click', toggleCart);

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0, count = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    count += item.qty;

    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <p><strong>${item.name}</strong> (Rp${item.price})</p>
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

function changeQty(name, delta) {
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.name !== name);
  updateCart();
}

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
