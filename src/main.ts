// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap";
import "element-plus/dist/index.css";
import "vue-toastification/dist/index.css";
import "./assets/css/main.scss";

import { EventType, type AuthenticationResult } from "@azure/msal-browser";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faLinkedin, faHireAHelper } from "@fortawesome/free-brands-svg-icons";
import { faCopy, faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import {
  faCamera,
  faCaretDown,
  faCaretRight,
  faCheck,
  faCog,
  faDownload,
  faEllipsisVertical,
  faEnvelope,
  faEye,
  faPaperclip,
  faPencilAlt,
  faPhone,
  faPlusCircle,
  faPlus,
  faRepeat,
  faRightFromBracket,
  faShareFromSquare,
  faToolbox,
  faTrash,
  faUpload,
  faUser,
  faUserCheck,
  faUserXmark,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import ElementPlus from "element-plus";
import { createPinia } from 'pinia'
import { createApp } from "vue";
import Toast from "vue-toastification";
import App from "./App.vue";
import LoadingOverlay from "./components/LoadingOverlay.vue";
import DialogComponent from "./components/modals/DialogComponent.vue";
import VueHtmlToPaper from "./plugins/VueHtmlToPaper";
import { msalPlugin } from "./plugins/msalPlugin";
import router from "./router";
import { msalInstance } from "./utils/authConfig";

library.add(
  faXmarkCircle,
  faXmark,
  faCog,
  faUser,
  faPlusCircle,
  faPlus,
  faTrash,
  faUpload,
  faDownload,
  faPaperclip,
  faPencilAlt,
  faEnvelope,
  faPhone,
  faLinkedin,
  faCheck,
  faUserCheck,
  faRepeat,
  faUserXmark,
  faCamera,
  faShareFromSquare,
  faEnvelope,
  faEye,
  faEllipsisVertical,
  faCopy,
  faRightFromBracket,
  faToolbox,
  faCaretRight,
  faCaretDown,
  faHireAHelper,
);
const accounts = msalInstance.getAllAccounts();
if (accounts.length > 0) {
  msalInstance.setActiveAccount(accounts[0]);
}
msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    const payload = event.payload as AuthenticationResult;
    const account = payload.account;
    msalInstance.setActiveAccount(account);
  }
});

const pinia = createPinia()
const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);
app.component("loading-overlay", LoadingOverlay);
app.component("dialog-component", DialogComponent);
app.use(ElementPlus);
app.use(VueHtmlToPaper);
app.use(router);
app.use(msalPlugin, msalInstance);
app.use(Toast);
app.use(pinia);

app.mount("#app");
