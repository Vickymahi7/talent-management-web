import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue-next/dist/bootstrap-vue-next.css";
import "bootstrap";
import "vue-toastification/dist/index.css";
import "./assets/css/main.scss";
import "element-plus/dist/index.css";

import { createApp } from "vue";
import ElementPlus from "element-plus";
import App from "./App.vue";
import router from "./router";
import Toast from "vue-toastification";
import VueHtmlToPaper from "./plugins/VueHtmlToPaper";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faCog,
  faUser,
  faTrash,
  faPlusCircle,
  faUpload,
  faDownload,
  faPaperclip,
  faPencilAlt,
  faEnvelope,
  faPhone,
  faCheck,
  faXmark,
  faRepeat,
  faUserCheck,
  faUserXmark,
  faCamera,
  faShareFromSquare,
  faEye,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faCopy, faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import DialogComponent from "./components/modals/DialogComponent.vue";
import LoadingOverlay from "./components/LoadingOverlay.vue";
import { msalPlugin } from "./plugins/msalPlugin";
import { msalInstance } from "./utils/authConfig";
import { type AuthenticationResult, EventType } from "@azure/msal-browser";

library.add(
  faXmarkCircle,
  faXmark,
  faCog,
  faUser,
  faPlusCircle,
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
  faCopy
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

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);
app.component("loading-overlay", LoadingOverlay);
app.component("dialog-component", DialogComponent);
app.use(ElementPlus);
app.use(VueHtmlToPaper);
app.use(router);
app.use(msalPlugin, msalInstance);
app.use(Toast);

app.mount("#app");
