import { getCategories, PRODUCTS } from "../../../data/data";
import type { Product } from "../../../types/Product";
import type { Cart } from "../../../types/Cart";
import { addItemToCart } from "../../../utils/cartService";

const addProducts = (products: Product[]) => {
  const containerProductsEl = document.querySelector<HTMLElement>(
    ".main__products-list",
  );

  if (!containerProductsEl) return;
  containerProductsEl.textContent = "";

  const cardProductHtml = products
    .map(
      (p) =>
        `<article class="main__card-product">
    <div class="card__container-img">
    <img class="card__img" src=${p.imagen} alt="product-img" />
    </div>
    <div class="card__content">
    <div class="card__text">
    <p class="card__text-category">${p.categorias[0]?.nombre}</p>
    <h3 class="card__text-title">${p.nombre}</h3>
    <p class="card__text-description">
    ${p.descripcion}
    </p>
    </div>
    <div class="card__container-price">
    <span class="card__price">$ ${p.precio}</span>
    <button class="card__button" data-id=${p.id}>Agregar</button>
    </div>
    </div>
    </article>`,
    )
    .join("");

  if (containerProductsEl) containerProductsEl.innerHTML = cardProductHtml;
};

const addCategories = () => {
  const listCategories =
    document.querySelector<HTMLUListElement>(".categories__list");
  const liAll = document.createElement("li");
  liAll.textContent = "Todos";
  liAll.dataset.category = "all";
  liAll.classList.add("categories__list-item");
  listCategories?.appendChild(liAll);

  getCategories().forEach((c) => {
    const liElement = document.createElement("li");
    liElement.classList.add("categories__list-item");
    liElement.dataset.category = c.nombre;
    liElement.textContent = c.nombre;
    listCategories?.appendChild(liElement);
  });

  listCategories?.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    const item = target.closest(".categories__list-item") as HTMLLIElement;

    if (!item) return;
    const category = item.dataset.category || "all";

    filterByCategory(category);
  });
};

const filterByCategory = (category: string) => {
  const mainTitleEl = document.querySelector<HTMLElement>(
    ".main__products-title",
  );

  if (mainTitleEl) {
    mainTitleEl.textContent =
      category === "all" ? "Todos los productos" : category;
  }

  let productsSelected: Product[] =
    category === "all"
      ? PRODUCTS
      : PRODUCTS.filter((product) => product.categorias[0].nombre === category);

  addProducts(productsSelected);
};

const renderNumberCart = () => {
  const spanEl = document.querySelector<HTMLSpanElement>(".item__span-cart");
  if (!spanEl) return;
  const spanButtonEl = document.querySelector<HTMLSpanElement>(
    ".main__button-cart-number",
  );
  if (!spanButtonEl) return;

  const currentCart = localStorage.getItem("cart");
  const currentCartParsed: Cart = currentCart
    ? JSON.parse(currentCart)
    : { items: [] };

  const totalItems = currentCartParsed.items.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );

  if (totalItems > 0) {
    spanEl.style.display = "block";
    spanEl.textContent = totalItems.toString();
    spanButtonEl.textContent = totalItems.toString();
  } else {
    spanEl.style.display = "none";
  }
};

const containerProductsEl = document.querySelector<HTMLElement>(
  ".main__products-list",
);

containerProductsEl?.addEventListener("click", (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const button = target.closest(".card__button") as HTMLButtonElement;

  //evita que repita el comportamiento si se hace click varias veces rapido
  if (button.classList.contains("is-add")) return;

  const textButtonOriginal = button?.textContent;

  if (!button) return;
  button.textContent = "Agregado";
  button?.classList.add("is-add");

  setTimeout(() => {
    button.textContent = textButtonOriginal as string;
    button.classList.remove("is-add");
  }, 500);

  addItemToCart(parseInt(button.dataset.id as string));
  renderNumberCart();
});

const toggleMenu = () => {
  const nav = document.querySelector<HTMLElement>(".header__nav");
  const buttonMenu = document.querySelector<HTMLButtonElement>(
    ".header__menu-toggle",
  );

  buttonMenu?.addEventListener("click", () => {
    buttonMenu?.classList.toggle("active");
    nav?.classList.toggle("header__nav--active");
  });
};

const searchProducts = () => {
  const mainTitleEl = document.querySelector<HTMLElement>(
    ".main__products-title",
  );

  const searchInput =
    document.querySelector<HTMLInputElement>(".main__form-input");

  searchInput?.addEventListener("input", (e: InputEvent) => {
    const target = e.target as HTMLInputElement;
    const search = target.value;
    const searchLower = target.value.trim().toLocaleLowerCase();

    if (mainTitleEl) {
      mainTitleEl.textContent = search.trim()
        ? `Busqueda: ${search}`
        : "Todos los productos";
    }

    const filterProducts = PRODUCTS.filter((product) =>
      product.nombre.toLocaleLowerCase().includes(searchLower),
    );

    addProducts(filterProducts);
  });
};

addCategories();
filterByCategory("all");
toggleMenu();
searchProducts();
renderNumberCart();
