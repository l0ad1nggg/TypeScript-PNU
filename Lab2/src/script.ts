let isCatalogOpen: boolean = false;

document.addEventListener('DOMContentLoaded', function() {
  const homeLink: HTMLElement | null = document.getElementById('homeLink');
  const catalogLink: HTMLElement | null = document.getElementById('catalogLink');

  if (homeLink) {
    homeLink.addEventListener('click', function(event: Event) {
      event.preventDefault();
      // with click on "Home" load home page
      loadCategories();
    });
  }

  if (catalogLink) {
    catalogLink.addEventListener('click', function(event: Event) {
      event.preventDefault();
      // with click on "Catalog" load catalog
      loadCategories();
    });
  }

  loadHomePage();
});

function loadHomePage(): void {
  // clear the categories container
  const categoriesContainer: HTMLElement | null = document.getElementById('categories');
  if (categoriesContainer) {
    categoriesContainer.innerHTML = '';
  }

  // clear the products container
  const productsContainer: HTMLElement | null = document.getElementById('products');
  if (productsContainer) {
    productsContainer.innerHTML = '';
  }
}

function loadCategories(): void {
  const categoriesContainer: HTMLElement | null = document.getElementById('categories');
  if (!categoriesContainer) return;

  categoriesContainer.innerHTML = '';

  fetch('./api/categories.json')
    .then(response => response.json())
    .then((data: { name: string }[]) => {
      data.forEach((category: { name: string }) => {
        const categoryLink: HTMLAnchorElement = document.createElement('a');
        categoryLink.href = '#';
        categoryLink.textContent = category.name;
        categoriesContainer.appendChild(categoryLink);

        categoryLink.addEventListener('click', function(event: Event) {
          event.preventDefault();
          isCatalogOpen = true;
          loadCategory(category.name);
        });
      });

      // add specials link
      const specialsLink: HTMLAnchorElement = document.createElement('a');
      specialsLink.href = '#';
      specialsLink.textContent = 'Specials';
      categoriesContainer.appendChild(specialsLink);

      specialsLink.addEventListener('click', function(event: Event) {
        event.preventDefault();
        isCatalogOpen = true;
        loadSpecials();
      });
    });
}

function loadCategory(categoryName: string): void {
  const productsContainer: HTMLElement | null = document.getElementById('products');
  if (!productsContainer) return;

  productsContainer.innerHTML = '';

  fetch(`./api/categories/${categoryName}.json`)
    .then(response => response.json())
    .then((data: { image: string; name: string; description: string; price: string }[]) => {
      data.forEach((product: { image: string; name: string; description: string; price: string }) => {
        const productDiv: HTMLDivElement = document.createElement('div');
        productDiv.classList.add('product');

        const productImg: HTMLImageElement = document.createElement('img');
        productImg.src = product.image;
        productImg.alt = product.name;
        productDiv.appendChild(productImg);

        const productName: HTMLHeadingElement = document.createElement('h3');
        productName.textContent = product.name;
        productDiv.appendChild(productName);

        const productDescription: HTMLParagraphElement = document.createElement('p');
        productDescription.textContent = product.description;
        productDiv.appendChild(productDescription);

        const productPrice: HTMLParagraphElement = document.createElement('p');
        productPrice.textContent = `Price: ${product.price}`;
        productDiv.appendChild(productPrice);

        productsContainer.appendChild(productDiv);
      });
    });
}

function loadSpecials(): void {
  const productsContainer: HTMLElement | null = document.getElementById('products');
  if (!productsContainer) return;

  productsContainer.innerHTML = '';

  const categories: string[] = ['electronics', 'clothes', 'music'];
  const randomCategory: string = categories[Math.floor(Math.random() * categories.length)];
  loadCategory(randomCategory);
}

function loadCatalog(): void {
  isCatalogOpen = true;
  // loads first category
  const categories: string[] = ['electronics', 'clothes', 'music'];
  categories.forEach((category: string) => {
    loadCategory(category);
  });
}
