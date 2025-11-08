document.addEventListener("DOMContentLoaded", () => {
  let cart = [];

  const cartBtn = document.getElementById('cartBtn');
  const cartPanel = document.getElementById('cartPanel');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const cartCount = document.getElementById('cartCount');

  // safety checks
  if (!cartBtn || !cartPanel || !cartItems || !cartTotal || !cartCount) {
    console.warn('Beberapa elemen keranjang tidak ditemukan. Pastikan ID: cartBtn, cartPanel, cartItems, cartTotal, cartCount ada di HTML.');
  }

  // Toggle panel keranjang
  function toggleCart() {
    if (!cartPanel) return;
    cartPanel.classList.toggle('active');
  }

  if (cartBtn) cartBtn.addEventListener('click', toggleCart);

  // Animasi ikon keranjang kecil
  function flyCartIcon(btn) {
    if (!btn || !cartBtn) return;

    const miniCart = document.createElement('div');
    miniCart.textContent = '🛒';
    miniCart.style.position = 'fixed';
    miniCart.style.fontSize = '30px';
    miniCart.style.transition = 'transform 0.8s ease-in-out, opacity 0.8s ease-in-out';
    miniCart.style.zIndex = '9999';
    miniCart.style.pointerEvents = 'none';
    miniCart.style.willChange = 'transform, opacity';
    document.body.appendChild(miniCart);

    const btnRect = btn.getBoundingClientRect();
    const cartRect = cartBtn.getBoundingClientRect();

    // posisi awal (di tengah tombol)
    miniCart.style.left = (btnRect.left + btnRect.width / 2 - 15) + 'px';
    miniCart.style.top = (btnRect.top + btnRect.height / 2 - 15) + 'px';

    // hitung jarak translate (relatif terhadap posisi awal)
    const x = (cartRect.left + cartRect.width / 2) - (btnRect.left + btnRect.width / 2);
    const y = (cartRect.top + cartRect.height / 2) - (btnRect.top + btnRect.height / 2);

    // jalankan animasi pada frame berikutnya
    requestAnimationFrame(() => {
      miniCart.style.transform = `translate(${x}px, ${y}px) scale(0.5)`;
      miniCart.style.opacity = '0';
    });

    // hapus setelah animasi selesai
    setTimeout(() => {
      miniCart.remove();
    }, 800);
  }

  // Tambah ke keranjang
  function addToCart(btn, nama, harga) {
    try {
      flyCartIcon(btn);
    } catch (e) {
      // jika animasi gagal, lanjutkan tanpa menghentikan proses
      console.warn('flyCartIcon error:', e);
    }

    const existing = cart.find(item => item.nama === nama);
    if (existing) {
      existing.jumlah++;
    } else {
      cart.push({ nama, harga, jumlah: 1 });
    }
    updateCart();
  }

  // Update isi keranjang
  function updateCart() {
    if (!cartItems || !cartTotal || !cartCount) return;

    cartItems.innerHTML = "";
    let total = 0, count = 0;

    cart.forEach(item => {
      total += item.harga * item.jumlah;
      count += item.jumlah;

      const div = document.createElement('div');
      div.classList.add('cart-item');
      // escape nama untuk aman dalam atribut onclick
      const safeName = item.nama.replace(/'/g, "\\'");
      div.innerHTML = `
        <p><strong>${item.nama}</strong> (Rp${item.harga.toLocaleString('id-ID')})</p>
        <div class="qty-controls">
          <button onclick="ubahJumlah('${safeName}', -1)">-</button>
          <span>${item.jumlah}</span>
          <button onclick="ubahJumlah('${safeName}', 1)">+</button>
        </div>
      `;
      cartItems.appendChild(div);
    });

    cartTotal.textContent = total.toLocaleString('id-ID');
    cartCount.textContent = count;
  }

  // Ubah jumlah item
  function ubahJumlah(nama, delta) {
    const item = cart.find(i => i.nama === nama);
    if (!item) return;
    item.jumlah += delta;
    if (item.jumlah <= 0) cart = cart.filter(i => i.nama !== nama);
    updateCart();
  }

  // Checkout ke WhatsApp (format yang diinginkan)
  function checkout() {
    if (cart.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }

    let pesan = "Nama: \nAlamat: \nDaftar pesanan:\n";

    cart.forEach(item => {
      pesan += `- ${item.nama} x${item.jumlah} = Rp${(item.harga * item.jumlah).toLocaleString('id-ID')}\n`;
    });

    const total = cart.reduce((sum, item) => sum + item.harga * item.jumlah, 0);
    pesan += `\nTotal: Rp${total.toLocaleString('id-ID')}`;

    const encoded = encodeURIComponent(pesan);
    const waNumber = "6285171600209"; // ganti dengan nomor toko
    const waUrl = `https://wa.me/${waNumber}?text=${encoded}`;
    window.open(waUrl, '_blank');
  }

  // Expose fungsi yang dipanggil dari HTML (onclick inline)
  window.addToCart = addToCart;
  window.ubahJumlah = ubahJumlah;
  window.checkout = checkout;
  window.toggleCart = toggleCart;

  // Jika halaman sudah punya item awal, update tampilan
  updateCart();
});
