import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withHashLocation, withInMemoryScrolling, withRouterConfig, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { EnvServiceProvider } from './env.service.provider';
import { UiAlertService } from './services/shared/ui-alert.service';
import { FormatPricePipe } from './shared/pipes';
import { ConfirmationService, MessageService } from 'primeng/api';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
import {vi_VN, provideNzI18n } from 'ng-zorro-antd/i18n';
import { DialogService } from 'primeng/dynamicdialog';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideClientHydration } from '@angular/platform-browser';

registerLocaleData(vi);
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [EnvServiceProvider,provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(TranslateModule.forRoot({
      defaultLanguage: 'vi',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })),
    provideRouter(routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withEnabledBlockingInitialNavigation(),
      withViewTransitions(),
      withHashLocation()
    ),
    provideAnimationsAsync(),
    provideHttpClient(),
    importProvidersFrom(FormsModule),
    provideNzI18n(vi_VN),
    provideAnimations(), // required animations providers
    provideToastr(), // Toastr providers
    FormatPricePipe,
    MessageService,
    ConfirmationService,
    DialogService, provideClientHydration(),
  ]
};

