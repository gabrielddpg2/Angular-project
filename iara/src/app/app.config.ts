import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { TranscriptionRepository } from './features/transcription/3-domain/repositories/transcription.repository';
import { HttpTranscriptionRepository } from '../core/infrastructure/services/http-transcription.repository';
import { GetMedicalKeywordsUseCase } from './features/transcription/2-application/use-cases/get-medical-keywords.use-case';
import { StartTranscriptionSessionUseCase } from './features/transcription/2-application/use-cases/start-transcription-session.use-case';
import { TranscriptionFacade } from './features/transcription/1-presentation/transcription.facade';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),

    // --- INJEÇÃO DE DEPENDÊNCIA CENTRALIZADA ---

    // 1. Diz ao Angular para usar a classe concreta quando a abstração for injetada.
    { provide: TranscriptionRepository, useClass: HttpTranscriptionRepository },

    // 2. Provê os Casos de Uso e o Facade para que sejam injetáveis em toda a aplicação.
    GetMedicalKeywordsUseCase,
    StartTranscriptionSessionUseCase,
    TranscriptionFacade
  ]
};