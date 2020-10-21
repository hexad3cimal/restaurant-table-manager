import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import AuthLayout from "../layouts/LandinPage.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
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
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
