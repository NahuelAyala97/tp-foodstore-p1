import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        //d:aplicaion/dist/
        index: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "src/pages/auth/login/login.html"),
        registro: resolve(__dirname, "src/pages/auth/registro/signup.html"),
        adminHome: resolve(__dirname, "src/pages/admin/home/home.html"),
        clientHome: resolve(__dirname, "src/pages/store/home/home.html"),
        cart: resolve(__dirname, "src/pages/store/cart/cart.html"),
      },
    },
  },
  base: "./",
});
