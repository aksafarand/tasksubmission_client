import { createWebHistory, createRouter } from "vue-router";



import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Home from './components/Home.vue';


const routes = [
    {
        mode: "",
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/login",
        name: "Login",
        component: Login
    },
    {
        path: "/register",
        name: "Register",
        component: Register
    },
];

const router = createRouter({
    history: createWebHistory("/app"),
    routes,
});


router.beforeEach((to, from, next) => {
    // const { $cookies } = router.a.config.globalProperties
    const isLogged = localStorage.getItem('username');
    // to login but logged --> sent to home
    if (to.name === 'Login' && isLogged) {
        next({name:'Home'})
    // to register but logged --> sent to home
    } else if (to.name === 'Register' && isLogged) {
        next({name:'Home'})
    // to home but not logged --> do nothing
    } else if (to.name === 'Home' && !isLogged) {
    next({name:'Login'})
    }
    else next();    
});



export default router