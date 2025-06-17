let cachedProducts = []; // Global variable to hold fetched products

async function searchProduct() {
  const query = document.getElementById('searchInput').value.trim();
  const errorMsg = document.getElementById('errorMsg');
  const resultBox = document.getElementById('productResults');

  errorMsg.textContent = "";
  resultBox.innerHTML = "";
  cachedProducts = [];

  if (query === "") {
    errorMsg.textContent = "Search field cannot be empty.";
    return;
  }

  try {
    const response = await fetch(`https:dummyjson.com/products/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (!data.products || data.products.length === 0) {
      resultBox.innerHTML = "<p>No products found.</p>";
      return;
    }

    cachedProducts = data.products;
    renderProducts(cachedProducts);
  } catch (err) {
    errorMsg.textContent = "Error fetching products.";
  }
}

function renderProducts(products) {
  const resultBox = document.getElementById('productResults');
  resultBox.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.thumbnail}" alt="${product.title}">
      <div class="product-title">${product.title}</div>
      <div class="product-price">₹${product.price}</div>
      <div class="product-rating">⭐ ${product.rating}</div>
    `;

    resultBox.appendChild(card);
  });
}

function sortProducts() {
  const sortValue = document.getElementById('sortSelect').value;
  let sorted = [...cachedProducts];

  switch (sortValue) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "rating-asc":
      sorted.sort((a, b) => a.rating - b.rating);
      break;
    case "rating-desc":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
  }

  renderProducts(sorted);
}