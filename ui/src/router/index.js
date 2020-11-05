import Vue from "vue";
import VueRouter from "vue-router";
import AuthLayout from "../layouts/LandinPage.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "login",
    component: AuthLayout,
    children: [
      {
        path: "/login",
        name: "login",
        component: () => import(/* webpackChunkName: "demo" */ "../views/Login.vue")
      },
      {
        path: "/register",
        name: "register",
        component: () => import(/* webpackChunkName: "demo" */ "../views/Register.vue")
      },
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
