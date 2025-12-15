import 'bootstrap/dist/js/bootstrap.bundle'; // Import Bootstrap JS so dropdowns, toggles and other components work
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
