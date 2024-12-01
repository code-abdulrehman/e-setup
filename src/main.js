import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import { createPinia } from 'pinia';
import TabComponent from '@/components/Commons/TabsComponent.vue';
import Panel from 'primevue/panel';
import RadioButton from 'primevue/radiobutton';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';

import '@/assets/styles.scss';
import '@/assets/tailwind.css';

const app = createApp(App);
// Create Pinia instance
const pinia = createPinia();

// Use Pinia in the Vue app
app.use(pinia);

app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    },
    ripple: true, 
});
app.use(ToastService);
app.component('TabComponent', TabComponent);
app.use(ConfirmationService);

// Register the components globally
app.component('Panel', Panel);
app.component('RadioButton', RadioButton);
app.component('Dialog', Dialog);
app.component('ProgressSpinner', ProgressSpinner);


app.mount('#app');
