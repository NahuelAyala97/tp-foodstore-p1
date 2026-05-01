import type { IUser } from "../../../types/IUser";

const usersData = localStorage.getItem("users");
const users: IUser[] = usersData ? JSON.parse(usersData) : [];

const formEl = document.querySelector<HTMLFormElement>(".login__form");
const signupEl = document.querySelector<HTMLAnchorElement>(
  ".login__signup-link",
);

formEl?.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();

  const formData = new FormData(formEl);
  const data = Object.fromEntries(formData.entries());

  const user = users.find((u) => u.email === data.email);

  if (user && data.password === user.password) {
    window.location.href = "/src/pages/store/home/home.html";
    localStorage.setItem("currentUser", data.email as string);
  } else {
    alert("Email o contraseña incorrectos.");
  }
});

signupEl?.addEventListener("click", (e: MouseEvent) => {
  console.log("ok");
  e.preventDefault();
  window.location.href = "/src/pages/auth/registro/signup.html";
});
