import type { Cart } from "../../../types/Cart";
import {
  addItemToCart,
  deleteCart,
  deleteProductToCart,
  removeItemToCart,
} from "../../../utils/cartService";

//funcion para el menu movil(igual a home)
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

//funcion para renderizar el carrito
const renderCart = (cart: Cart) => {
  const containerProductsEl =
    document.querySelector<HTMLElement>(".main__container");

  if (!containerProductsEl) return;
  //se limpia el contenedor para evitar duplicados
  containerProductsEl.textContent = "";

  //se combina en cada producto con su cantidad
  const products = cart.items.map(({ product, quantity }) => ({
    ...product,
    quantity,
  }));

  //si no existe ningun producto en el carrito
  // se elimina el carrito y se renderiza el layout de carrito vacio
  if (!cart.items || cart.items.length === 0) {
    deleteCart();
    renderEmptyCart(containerProductsEl);
    return;
  }

  //si hay productos se crea el html para cada card
  const cardProductHtml = products
    .map(
      (p) =>
        ` <article class="main__card-product">
            <div class="card__container-img">
              <img
                class="card__img"
                src=${p.imagen}
                alt="product-img"
              />
            </div>
            <div class="card__content">
              <div class="card__text">
                <h3 class="card__text-title">${p.nombre}</h3>
                <p class="card__text-category">${p.categorias[0]?.nombre}</p>
                <span class="card__price">Subtotal: $${p.precio * p.quantity}</span>
              </div>
              <div class="card__content-right">
                <div class="card__container-button">
                  <button class="card__button button--minus" data-id=${p.id}>-</button>
                  <span class="card__button-quantity">${p.quantity}</span>
                  <button class="card__button button--plus" data-id=${p.id}>+</button>
                </div>
                <a href="" class="card__link-delete" data-id=${p.id}>Eliminar</a>
              </div>
            </div>
          </article>`,
    )
    .join("");

  //se crea el HTML para la card de resumen de compra
  const resumeCart = `<div class="main__container-card-resume">
           <article class="main__card-resume">
             <div class="main__card-resume-content">
               <h3 class="main__card-resume-title">Resumen</h3>
               <p class="main__card-resume-subtitle">
                 Subtotal
                 <span class="main__card-resume-subtitle-span">$ ${cart.totalAmount}</span>
               </p>
               <div class="main__card-resume-separator"></div>
               <h3 class="main__card-resume-total">
                 Total <span class="main__card-resume-total-span">$ ${cart.totalAmount}</span>
               </h3>
             </div>
             <div class="main__container-card-resume-buttons">
               <button disabled class="main__card-resume-checkout">
                 Finalizar compra
               </button>
               <p class="main__card-resume-text-disabled">
                ⚠️ El checkout no está disponible en esta versión
              </p>
              <button class="main__card-resume-delete">Vaciar carrito</button>
             </div>
           </article>
         </div>`;

  //se crea el layout completo con las card de products y resumen
  const layout = `<div class="main__container-cart">
                    <div class="main__container-items">
                      ${cardProductHtml}
                    </div>
                      ${resumeCart}
                    </div>`;

  //se inyecta el layout al contenedor
  if (containerProductsEl) containerProductsEl.innerHTML = layout;
};

//funcion para renderizar layout de carrito vacio
const renderEmptyCart = (container: HTMLElement) => {
  container.innerHTML = `
          <div class="main__icon-cart">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
              <!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
              <path
                d="M0 8C0-5.3 10.7-16 24-16l45.3 0c27.1 0 50.3 19.4 55.1 46l.4 2 187.2 0 0 102.1-31-31c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l72 72c9.4 9.4 24.6 9.4 33.9 0l72-72c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-31 31 0-102.1 177.4 0c20 0 35.1 18.2 31.4 37.9L537.8 235.8c-5.7 30.3-32.1 52.2-62.9 52.2l-303.6 0 5.1 28.3c2.1 11.4 12 19.7 23.6 19.7L456 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-255.9 0c-34.8 0-64.6-24.9-70.8-59.1L77.2 38.6c-.7-3.8-4-6.6-7.9-6.6L24 32C10.7 32 0 21.3 0 8zM160 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm224 0a48 48 0 1 1 96 0 48 48 0 1 1 -96 0z"
              />
            </svg>
          </div>
          <p class="main__text-description">Tu carrito está vacio</p>
          <div class="main__container-button">
            <button class="main__button">Ver catálogo</button>
          </div>
  `;

  const homeButtonCart =
    document.querySelector<HTMLButtonElement>(".main__button");
  //se escucha el evento para volver al catalogo cuando el carrito este vacio
  homeButtonCart?.addEventListener("click", (e: MouseEvent) => {
    e.preventDefault();
    window.location.replace("/src/pages/store/home/home.html");
  });
};

//se recupera el carrito al cargar la página
const cart = localStorage.getItem("cart");
const cartParsed: Cart = cart ? JSON.parse(cart) : { items: [] };
const currentUser = localStorage.getItem("currentUser");

//se valida que el carrito corresponda con el usuario logueado y se renderiza
if (currentUser === cartParsed.user) {
  renderCart(cartParsed);
}

//se recupera el contenedor principal, para escuchar el clic
//delegando el evento para poder recuperar con closest el elemento clickeado
const containerProducts =
  document.querySelector<HTMLElement>(".main__container");

containerProducts?.addEventListener("click", (e: Event) => {
  const target = e.target as HTMLElement;
  //se identifica en que button hizo clic el usuario
  const buttonPlus = target.closest(".button--plus") as HTMLButtonElement;
  const buttonMinus = target.closest(".button--minus") as HTMLButtonElement;
  const linkDeleteItem = target.closest(
    ".card__link-delete",
  ) as HTMLAnchorElement;

  const buttonDeleteCart = target.closest(
    ".main__card-resume-delete",
  ) as HTMLButtonElement;

  //obtenemos el id en dataset del buton clickeado si existe
  const id = parseInt(
    buttonPlus?.dataset.id ||
      buttonMinus?.dataset.id ||
      linkDeleteItem?.dataset.id ||
      "0",
  );

  if (buttonPlus) {
    //se suma un item del producto
    addItemToCart(id);
    //actualiza el carrito
    const updateCart = JSON.parse(localStorage.getItem("cart") || "{}");
    renderCart(updateCart); //se renderiza el nuevo carrito
  } else if (buttonMinus) {
    //Se disminuye un item del producto
    removeItemToCart(id);
    const updateCart = JSON.parse(localStorage.getItem("cart") || "{}");
    renderCart(updateCart);
  } else if (linkDeleteItem) {
    //se elimina del carrito el producto completo
    e.preventDefault();
    deleteProductToCart(id);
    const updateCart = JSON.parse(localStorage.getItem("cart") || "{}");
    renderCart(updateCart);
  } else if (buttonDeleteCart) {
    //se elimina todo el carrito
    deleteCart();
    renderEmptyCart(containerProducts);
  }
});

toggleMenu(); //prepara el menu movil
