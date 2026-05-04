import type { IUser } from "./types/IUser";

const initRouter = () => {
  //se declara las rutas publicas
  const publicRoutes = [
    "/src/pages/auth/login/login.html",
    "/src/pages/auth/registro/signup.html",
  ];
  //rutas admin
  const adminRoutes = ["/src/pages/admin/home/home.html"];

  //se recupera la lista users de localStorage
  const usersData = localStorage.getItem("users");

  const users: IUser[] = usersData ? JSON.parse(usersData) : [];
  //se recupera el usuario logueado
  const isLoggedIn = localStorage.getItem("currentUser");

  //se recupera los datos guardados del usuario logueado
  const currentUser = users.find((u) => u.email === isLoggedIn);

  const currentPath = window.location.pathname;

  //se verifica si el path coincide con rutas publicas o de admin
  const isPublic = publicRoutes.includes(currentPath);
  const isAdmin = adminRoutes.includes(currentPath);

  //si el usuario intenta ingresar por la raíz por error o adrede,
  // lo redirigue al home dependiendo del rol
  if (currentPath === "/" || currentPath === "/index.html") {
    if (!isLoggedIn) {
      window.location.replace("/src/pages/auth/login/login.html");
    } else {
      const redirect =
        currentUser?.role === "admin"
          ? "/src/pages/admin/home/home.html"
          : "/src/pages/store/home/home.html";
      window.location.replace(redirect);
    }
  }

  //si no esta logueado ingresa al login
  if (!isLoggedIn && !isPublic) {
    window.location.replace("/src/pages/auth/login/login.html");
  }

  //intenta ingresar a una ruta protegida para rol admin
  if (isAdmin && currentUser?.role !== "admin") {
    alert("No tienes permiso de ingresar al panel de admin.");
    window.location.replace("/src/pages/store/home/home.html");
  }
};

initRouter();

const logoutEl = document.querySelector<HTMLAnchorElement>(".logout");

logoutEl?.addEventListener("click", (e: MouseEvent) => {
  e.preventDefault();
  localStorage.removeItem("currentUser");
  window.location.replace("/src/pages/auth/login/login.html");
});

const homeLink = document.querySelector<HTMLAnchorElement>(".item__home-link");

homeLink?.addEventListener("click", (e: MouseEvent) => {
  e.preventDefault();
  window.location.replace("/src/pages/store/home/home.html");
});

const homeLinkCart = document.querySelector<HTMLAnchorElement>(".main__button");

homeLinkCart?.addEventListener("click", (e: MouseEvent) => {
  e.preventDefault();
  window.location.replace("/src/pages/store/home/home.html");
});

const cartLink = document.querySelector<HTMLAnchorElement>(".item__cart-link");

cartLink?.addEventListener("click", (e: MouseEvent) => {
  e.preventDefault();
  window.location.replace("/src/pages/store/cart/cart.html");
});

const cartButtonHome =
  document.querySelector<HTMLButtonElement>(".main__button-cart");

cartButtonHome?.addEventListener("click", (e: MouseEvent) => {
  e.preventDefault();
  window.location.replace("/src/pages/store/cart/cart.html");
});
