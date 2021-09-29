import { createApp } from 'vue'
import App from './App.vue'
import Router from './routes'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"



createApp(App)
    .use(Router)
    .mount('#app')
