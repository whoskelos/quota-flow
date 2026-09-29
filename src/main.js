import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import App from './App.vue'

import './style.css'

const pinia = createPinia()
pinia.use(createPersistedState)

createApp(App).use(pinia).mount('#app')
