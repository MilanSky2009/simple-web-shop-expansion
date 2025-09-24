let allProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentPage = 1;
const itemsPerPage = 5;

function displayProducts(products) {
  const container = document.getElementById('product-list');
  container.innerHTML = '';
  const start = (currentPage - 1) * itemsPerPage;
  const paginated = products.slice(start, start + itemsPerPage);

  paginated.forEach(product => {
    const item = document.createElement('div');
    item.innerHTML = `
      <h3>${product.name}</h3>
      <p>Price: $${product.price}</p>
      <p>Category: ${product.category}</p>
      ${product.image ? `<img src="images/${product.image}" alt="${product.name}">` : ''}
      <button onclick='addToCart(${JSON.stringify(product)})'>Add to Cart</button>
    `;
    container.appendChild(item);
  });

  document.getElementById('page-info').textContent = `Page ${currentPage} of ${Math.ceil(products.length / itemsPerPage)}`;
}

function displayCart() {
  const cartContainer = document.getElementById('cart');
  cartContainer.innerHTML = '';
  cart.forEach(item => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h4>${item.name}</h4>
      <p>$${item.price}</p>
      <button onclick="removeFromCart(${item.id})">Remove</button>
    `;
    cartContainer.appendChild(div);
  });
  updateTotal();
}

function addToCart(product) {
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
}

function updateTotal() {
  const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  document.getElementById('cart-total').textContent = total;
}

function clearCart() {
  cart = [];
  localStorage.removeItem('cart');
  displayCart();
}

function applyFilters() {
  let filtered = [...allProducts];
  const searchTerm = document.getElementById('search-box').value.toLowerCase();
  const category = document.getElementById('category-filter').value;
  const sort = document.getElementById('sort').value;

  if (searchTerm) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
  }

  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }

  if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  if (sort === 'name-asc') filtered.sort((a, b) => a.name.localeCompare(b.name));

  displayProducts(filtered);
}

document.getElementById('search-box').addEventListener('input', () => {
  currentPage = 1;
  applyFilters();
});

document.getElementById('category-filter').addEventListener('change', () => {
  currentPage = 1;
  applyFilters();
});

document.getElementById('sort').addEventListener('change', () => {
  currentPage = 1;
  applyFilters();
});

document.getElementById('prev').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    applyFilters();
  }
});

document.getElementById('next').addEventListener('click', () => {
  const maxPage = Math.ceil(allProducts.length / itemsPerPage);
  if (currentPage < maxPage) {
    currentPage++;
    applyFilters();
  }
});

document.getElementById('clear-cart').addEventListener('click', clearCart);

fetch('products.json')
  .then(res => res.json())
  .then(data => {
    allProducts = data;
    applyFilters();
    displayCart();
  });
