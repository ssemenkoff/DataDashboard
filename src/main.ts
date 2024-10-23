import './assets/main.css'
import { initVendors } from "./vendor";
import { initData } from "./data";
import { initWidgets } from './widgets';
import { initVariables } from './variables';
import { createApp } from 'vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import './scss/main.scss'

import App from './App.vue'

const app = createApp(App)

app.component('VueJsonPretty', VueJsonPretty);
initVendors(app);
const { datasourceRepository } = initData(app);
initWidgets(app, { datasourceRepository });
initVariables(app);

app.mount('#app')
