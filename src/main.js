import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import './assets/styles/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCog, faUser, faTrash, faPlusCircle, faUpload, faDownload, faPaperclip } from '@fortawesome/free-solid-svg-icons'
// import { } from '@fortawesome/free-brands-svg-icons'
import { faXmarkCircle } from '@fortawesome/free-regular-svg-icons'

library.add(faCog, faUser, faPlusCircle, faTrash, faXmarkCircle, faUpload, faDownload, faPaperclip)
const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router)

app.mount('#app')
