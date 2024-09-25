import './assets/main.css'
import { initVendors } from "./vendor";
import { initData } from "./data";
import { initWidgets } from './widgets';
import { createApp } from 'vue'

import App from './App.vue'

const app = createApp(App)

initVendors(app);
const { datasourceRepository } = initData(app);
initWidgets(app, { datasourceRepository });

app.mount('#app')
