"use strict";
let isCatalogOpen = false;
document.addEventListener('DOMContentLoaded', function () {
    const homeLink = document.getElementById('homeLink');
    const catalogLink = document.getElementById('catalogLink');
    if (homeLink) {
        homeLink.addEventListener('click', function (event) {
            event.preventDefault();
            // with click on "Home" load home page
            loadCategories();
        });
    }
    if (catalogLink) {
        catalogLink.addEventListener('click', function (event) {
            event.preventDefault();
            // with click on "Catalog" load catalog
            loadCategories();
        });
    }
    loadHomePage();
});
function loadHomePage() {
    // clear the categories container
    const categoriesContainer = document.getElementById('categories');
    if (categoriesContainer) {
        categoriesContainer.innerHTML = '';
    }
    // clear the products container
    const productsContainer = document.getElementById('products');
    if (productsContainer) {
        productsContainer.innerHTML = '';
    }
}
function loadCategories() {
    const categoriesContainer = document.getElementById('categories');
    if (!categoriesContainer)
        return;
    categoriesContainer.innerHTML = '';
    fetch('./api/categories.json')
        .then(response => response.json())
        .then((data) => {
        data.forEach((category) => {
            const categoryLink = document.createElement('a');
            categoryLink.href = '#';
            categoryLink.textContent = category.name;
            categoriesContainer.appendChild(categoryLink);
            categoryLink.addEventListener('click', function (event) {
                event.preventDefault();
                isCatalogOpen = true;
                loadCategory(category.name);
            });
        });
        // add specials link
        const specialsLink = document.createElement('a');
        specialsLink.href = '#';
        specialsLink.textContent = 'Specials';
        categoriesContainer.appendChild(specialsLink);
        specialsLink.addEventListener('click', function (event) {
            event.preventDefault();
            isCatalogOpen = true;
            loadSpecials();
        });
    });
}
function loadCategory(categoryName) {
    const productsContainer = document.getElementById('products');
    if (!productsContainer)
        return;
    productsContainer.innerHTML = '';
    fetch(`./api/categories/${categoryName}.json`)
        .then(response => response.json())
        .then((data) => {
        data.forEach((product) => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');
            const productImg = document.createElement('img');
            productImg.src = product.image;
            productImg.alt = product.name;
            productDiv.appendChild(productImg);
            const productName = document.createElement('h3');
            productName.textContent = product.name;
            productDiv.appendChild(productName);
            const productDescription = document.createElement('p');
            productDescription.textContent = product.description;
            productDiv.appendChild(productDescription);
            const productPrice = document.createElement('p');
            productPrice.textContent = `Price: ${product.price}`;
            productDiv.appendChild(productPrice);
            productsContainer.appendChild(productDiv);
        });
    });
}
function loadSpecials() {
    const productsContainer = document.getElementById('products');
    if (!productsContainer)
        return;
    productsContainer.innerHTML = '';
    const categories = ['electronics', 'clothes', 'music'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    loadCategory(randomCategory);
}
function loadCatalog() {
    isCatalogOpen = true;
    // loads first category
    const categories = ['electronics', 'clothes', 'music'];
    categories.forEach((category) => {
        loadCategory(category);
    });
}
