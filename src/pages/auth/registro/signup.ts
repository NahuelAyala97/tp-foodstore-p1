import type { IUser } from "../../../types/IUser";

const usersData = localStorage.getItem("users");
const users: IUser[] = usersData ? JSON.parse(usersData) : [];

const formEl = document.querySelector<HTMLFormElement>(".login__form");
const signInEl = document.querySelector<HTMLAnchorElement>(
  ".login__signup-link",
);

formEl?.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();

  const formData = new FormData(formEl);
  const data = Object.fromEntries(formData.entries());
  console.log(data.email);

  if (users.some((u) => u.email === data.email)) {
    alert("El usuario ya existe");
    window.location.href = "/src/pages/auth/login/login.html";
    throw new Error("El usuario ya existe");
  }

  const newUser: IUser = {
    email: data.email as string,
    password: data.password as string,
    role: "user",
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", data.email as string);
  window.location.href = "/src/pages/store/home/home.html";
});

signInEl?.addEventListener("click", (e: MouseEvent) => {
  e.preventDefault();
  window.location.href = "/src/pages/auth/login/login.html";
});
