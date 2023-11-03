import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import './assets/css/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCog, faUser, faTrash, faPlusCircle, faUpload, faDownload, faPaperclip, faPencilAlt, faEnvelope, faPhone, faCheck } from '@fortawesome/free-solid-svg-icons'
import { faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { faXmarkCircle } from '@fortawesome/free-regular-svg-icons'

const faPropIcon = faLinkedin as IconDefinition;
library.add(faXmarkCircle, faCog, faUser, faPlusCircle, faTrash, faUpload, faDownload, faPaperclip, faPencilAlt, faEnvelope, faPhone, faPropIcon, faCheck)
const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router)

app.mount('#app')
