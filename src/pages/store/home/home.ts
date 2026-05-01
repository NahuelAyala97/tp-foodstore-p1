import { getCategories, PRODUCTS } from "../../../data/data";
import type { Product } from "../../../types/Product";
import type { Cart } from "../../../types/Cart";
import { addItemToCart } from "../../../utils/cartService";

//funcion para renderizar los productos en pantalla
const addProducts = (products: Product[]) => {
  //se selecciona el contenedor para renderizar la lista
  const containerProductsEl = document.querySelector<HTMLElement>(
    ".main__products-list",
  );

  if (!containerProductsEl) return;
  //limpiamos el contenedor antes de proseguir, para evitar duplicados
  containerProductsEl.textContent = "";

  //cada producto lo convertimos en una card con HTML
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

  //se inyecta el HTML creado dentro del contenedor
  if (containerProductsEl) containerProductsEl.innerHTML = cardProductHtml;
};

//funcion para crear la lista de categorias
const addCategories = () => {
  const listCategories =
    document.querySelector<HTMLUListElement>(".categories__list");
  //la categoria principal (Todos) se crea explicitamente para ver todos los productos
  const liAll = document.createElement("li");
  liAll.textContent = "Todos";
  liAll.dataset.category = "all";
  liAll.classList.add("categories__list-item");
  listCategories?.appendChild(liAll);

  //las demas categorias se crean a partir del metodo getCategories de data.ts
  //devuelva una array que se recorre para crear li por cada una
  getCategories().forEach((c) => {
    const liElement = document.createElement("li");
    liElement.classList.add("categories__list-item");
    //se utiliza dataset para tener un facil acceso al nombre de la categoria
    //cuando se selecciona
    liElement.dataset.category = c.nombre;
    liElement.textContent = c.nombre;
    listCategories?.appendChild(liElement);
  });

  //escuchamos el evento de la lista, para delegar en cual li se hizo click
  listCategories?.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    //se obtiene el li con closest, para verificar en cual disparo el evento
    const item = target.closest(".categories__list-item") as HTMLLIElement;

    if (!item) return;
    //se obtiene el nombre de la categoria con dataset
    const category = item.dataset.category || "all";

    //se pasa el nombre de la categoria al filtro
    filterByCategory(category);
  });
};

//función para filtrar por categoria
const filterByCategory = (category: string) => {
  const mainTitleEl = document.querySelector<HTMLElement>(
    ".main__products-title",
  );

  //se cambia el titulo principal de la home, dependiendo el nombre de la categoria
  if (mainTitleEl) {
    mainTitleEl.textContent =
      category === "all" ? "Todos los productos" : category;
  }

  //se filtra el array de PRODUCTS obtenido de data.ts
  //all se muestra todos directamente, o con filter segun coincida el nombre de la categoria
  let productsSelected: Product[] =
    category === "all"
      ? PRODUCTS
      : PRODUCTS.filter((product) => product.categorias[0].nombre === category);

  //el array resultante se pasa a addProducts para renderizarlo
  addProducts(productsSelected);
};

//funcion para actualizar el número de items en el carrito
const renderNumberCart = (): void => {
  //se obtienen los dos span para renderizar el número
  const spanEl = document.querySelector<HTMLSpanElement>(".item__span-cart");
  const spanButtonEl = document.querySelector<HTMLSpanElement>(
    ".main__button-cart-number",
  );
  if (!spanEl || !spanButtonEl) return;

  //se recupera el carrito de localStorage
  const currentCart = localStorage.getItem("cart");
  const currentCartParsed: Cart = currentCart
    ? JSON.parse(currentCart)
    : { items: [] };

  //se suma la cantidad de cada item para obtener el total
  const totalItems = currentCartParsed.items.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );

  //si existe almenos un item se renderiza, sino se oculta
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

//se escucha los clics de los botones de las card products
//nuevamente se utiliza delegación de eventos en el contenedor
// para poder obtener el boton dentro de la card con closest
containerProductsEl?.addEventListener("click", (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const button = target.closest(".card__button") as HTMLButtonElement;

  //si el buton ya dice 'Agregado', no se hace nada, para evitar clics repetidos rapidos
  if (button.classList.contains("is-add")) return;
  if (!button) return;

  const textButtonOriginal = button?.textContent;

  //se modifica el texto y visualmente para informar que fue agregado
  button.textContent = "Agregado";
  button?.classList.add("is-add");

  //el cambio visual dura medio segundo y vuelve a la visual original
  setTimeout(() => {
    button.textContent = textButtonOriginal as string;
    button.classList.remove("is-add");
  }, 500);

  //se guarda el producto al carrito obteniendo el id guardado en dataset
  addItemToCart(parseInt(button.dataset.id as string));
  //se actualiza el número de items en el carrito
  renderNumberCart();
});

//función para abrir y cerra el menu en dispositivos moviles
const toggleMenu = () => {
  const nav = document.querySelector<HTMLElement>(".header__nav");
  const buttonMenu = document.querySelector<HTMLButtonElement>(
    ".header__menu-toggle",
  );

  //se agrega o se elimina con toggle la clase active
  buttonMenu?.addEventListener("click", () => {
    buttonMenu?.classList.toggle("active");
    nav?.classList.toggle("header__nav--active");
  });
};

//función para buscar productos en la barra de busqueda
const searchProducts = () => {
  const mainTitleEl = document.querySelector<HTMLElement>(
    ".main__products-title",
  );

  const searchInput =
    document.querySelector<HTMLInputElement>(".main__form-input");

  //se escucha el evento input para obtene lo que escribe el usuario
  searchInput?.addEventListener("input", (e: InputEvent) => {
    const target = e.target as HTMLInputElement;
    const search = target.value;
    //se elimina espacios y lo colocamos en minuscula para facilitar el filtrado
    const searchLower = target.value.trim().toLocaleLowerCase();

    //se actualiza el texto del titulo segun lo que escribe el usuario
    if (mainTitleEl) {
      mainTitleEl.textContent = search.trim()
        ? `Busqueda: ${search}`
        : "Todos los productos";
    }
    //se utilizar filter para obtener los productos
    // que coincidan con las letras ingresadas al input
    const filterProducts = PRODUCTS.filter((product) =>
      product.nombre.toLocaleLowerCase().includes(searchLower),
    );

    //se renderizan solamente los productos filtrados
    addProducts(filterProducts);
  });
};

//metodos que se inician cuando se carga la página
addCategories(); //crea la lista de las categorias
filterByCategory("all"); //se filtra por defecto todos los productos
toggleMenu(); //prepara el menu movil
searchProducts(); //perpara el buscador
renderNumberCart(); //muestra la cantidad de actual de items en el carrito
