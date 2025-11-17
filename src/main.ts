// Entry point for the Angular application.
// This file bootstraps the root standalone `App` component using the
// provided `appConfig` which typically contains router/providers setup.
// If bootstrap fails we log the error to the console.
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig).catch(err => console.error(err));
