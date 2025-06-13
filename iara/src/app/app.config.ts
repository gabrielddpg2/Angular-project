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

    { provide: TranscriptionRepository, useClass: HttpTranscriptionRepository },

    GetMedicalKeywordsUseCase,
    StartTranscriptionSessionUseCase,
    TranscriptionFacade
  ]
};