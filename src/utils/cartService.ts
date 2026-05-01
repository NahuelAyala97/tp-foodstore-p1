//archivo creado para separar la logica del carrito
//para actualizar el localstorage

import { PRODUCTS } from "../data/data";
import type { Cart } from "../types/Cart";

//funcion para eliminar todo el carrito
export function deleteCart() {
  localStorage.removeItem("cart");
}

//funcion para eliminar un producto completo del carrito
export function deleteProductToCart(productId: number): void {
  const currentCart = localStorage.getItem("cart");
  if (!currentCart) return;

  const cart: Cart = JSON.parse(currentCart);
  //se busca si el producto existe
  const product = cart.items.find((p) => p.product.id === productId);

  //si existe se utiliza filter para obtener un nuevo array
  //sin el producto recibido
  if (product) {
    cart.items = cart.items.filter((p) => p.product.id !== product.product.id);
  }

  //se guarda el carrito actualizado
  saveCart(cart);
}

//funcion para agregar un item al producto del carrito
export function addItemToCart(productId: number): void {
  const currentCart = localStorage.getItem("cart");
  //se recupera el usuario logueado
  const currrenUser = localStorage.getItem("currentUser");

  //si no existe el carrito, se crea uno nuevo con el usuario actual
  let cart: Cart = currentCart
    ? JSON.parse(currentCart)
    : { user: currrenUser, items: [], totalAmount: 0 };

  //se verifica si el producto ya existia en el carrito
  const existingProduct = cart.items.find((p) => p.product.id === productId);

  if (existingProduct) {
    //si existe solo se agrega uno
    existingProduct.quantity += 1;
  } else {
    //si es un producto nuevo, se busca en el array PRODUCTS de data.ts
    const product = PRODUCTS.find((p) => p.id === productId);
    //si existe se pushea el nuevo producto al carrito con cantidad 1
    if (product) cart.items.push({ product, quantity: 1 });
  }

  //se guarda el nuevo carrito
  saveCart(cart);
}

//funcion para elimitar un item del producto en carrito
export function removeItemToCart(productId: number): void {
  const currentCart = localStorage.getItem("cart");
  if (!currentCart) return;

  let cart: Cart = JSON.parse(currentCart);

  //se busca si el producto existe en el carrito
  const existingProduct = cart.items.find((p) => p.product.id === productId);
  if (!existingProduct) return;
  //si tiene mas de un item solo se resta una unidad
  if (existingProduct?.quantity > 1) {
    existingProduct.quantity -= 1;
  } else {
    //si tiene solo un item, se usa filter para obtener un nuevo array
    //sin el producto informado
    cart.items = cart.items.filter(
      (p) => p.product.id !== existingProduct.product.id,
    );
  }

  //Se guarda el carrito actualizado
  saveCart(cart);
}

//funcion auxiliar para evitar codigo duplicado
// cada vez que se tiene que guardar el carrito
function saveCart(cart: Cart): void {
  //se recorre todo los productos para calcular el precio total
  cart.totalAmount = cart.items.reduce(
    (acc, item) => acc + item.product.precio * item.quantity,
    0,
  );
  localStorage.setItem("cart", JSON.stringify(cart));
}
