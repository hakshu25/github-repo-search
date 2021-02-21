import { createApp } from 'vue';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import App from './App.vue';

const app = createApp(App).mount('#app');
app.config.productionTip = false;
app.use(Buefy);
