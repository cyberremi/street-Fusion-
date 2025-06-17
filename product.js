let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItemsList = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartUI() {
  cartItemsList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - ${item.price} x ${item.quantity}
      <button onclick="changeQuantity(${index}, -1)">-</button>
      <button onclick="changeQuantity(${index}, 1)">+</button>
      <button onclick="removeFromCart(${index})">Remove</button>
    `;
    cartItemsList.appendChild(li);

    total += item.price * item.quantity;
  });

  cartTotal.textContent = total.toFixed(2);
  saveCart();
}

function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartUI();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function changeQuantity(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    removeFromCart(index);
  } else {
    updateCartUI();
  }
}

document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    const parent = btn.closest(".product-card");
    const product = {
      id: parent.dataset.id,
      name: parent.dataset.name,
      price: parseFloat(parent.dataset.price),
    };
    addToCart(product);
  });
});

document.getElementById("checkout-whatsapp").addEventListener("click", () => {
  if (cart.length === 0) return alert("Cart is empty");

  let message = "🛍 *Street Fashion Order:*\n";
  cart.forEach(item => {
    message += `- ${item.name} x ${item.quantity} = ₦${item.price * item.quantity}\n`;
  });
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  message += `\n*Total: ₦${total.toFixed(2)}*`;

  const phoneNumber = "2349012008514"; // Replace with your WhatsApp number
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
});

document.getElementById("checkout-email").addEventListener("click", () => {
  if (cart.length === 0) return alert("Cart is empty");

  const message = cart.map(item =>
    `${item.name} x ${item.quantity} = ₦${item.price * item.quantity}`
  ).join("\n");

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  emailjs.send("your_service_id", "your_template_id", {
    cart_message: `${message}\nTotal: ₦${total.toFixed(2)}`
  }).then(() => {
    alert("Order sent via email successfully!");
  }, (error) => {
    alert("Email failed: " + error.text);
  });
});

// Initialize cart UI
updateCartUI();
