import { TestBed } from '@angular/core/testing';
import { TranscriptionFacade } from './transcription.facade';
import { GetMedicalKeywordsUseCase } from '../2-application/use-cases/get-medical-keywords.use-case';
import { StartTranscriptionSessionUseCase } from '../2-application/use-cases/start-transcription-session.use-case';
import { of, throwError, Subject, firstValueFrom } from 'rxjs';
import { TranscriptionSegment } from '../3-domain/models/transcription.model';

// Mocks para os casos de uso
const mockGetKeywordsUseCase = {
  execute: jasmine.createSpy('execute').and.returnValue(of(['dor', 'febre']))
};

const mockStartSessionUseCase = {
  execute: jasmine.createSpy('execute'),
  // Adicionamos uma referência ao repositório para o mock
  transcriptionRepository: {
    getLiveSessionSegmentCount: () => 2
  }
};

describe('TranscriptionFacade', () => {
  let facade: TranscriptionFacade;
  let startSessionUseCase: StartTranscriptionSessionUseCase;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TranscriptionFacade,
        { provide: GetMedicalKeywordsUseCase, useValue: mockGetKeywordsUseCase },
        { provide: StartTranscriptionSessionUseCase, useValue: mockStartSessionUseCase },
      ],
    });
    facade = TestBed.inject(TranscriptionFacade);
    startSessionUseCase = TestBed.inject(StartTranscriptionSessionUseCase);
  });

  it('should be created and load initial keywords', () => {
    expect(facade).toBeTruthy();
    expect(mockGetKeywordsUseCase.execute).toHaveBeenCalled();
  });

  describe('startTranscription', () => {
    let segments$: Subject<TranscriptionSegment>;

    beforeEach(() => {
      // Usamos um Subject para ter controle total sobre o stream de dados
      segments$ = new Subject<TranscriptionSegment>();
      mockStartSessionUseCase.execute.and.returnValue(segments$.asObservable());
    });

    it('should set isLoading to true and initialize skeletons', async () => {
      // Act
      facade.startTranscription();
      
      // Assert
      const isLoading = await firstValueFrom(facade.isLoading$);
      const transcriptions = await firstValueFrom(facade.transcriptions$);
      
      expect(isLoading).toBe(true);
      expect(transcriptions.length).toBe(2);
      expect(transcriptions[0].isLoading).toBe(true);
    });

    it('should update transcriptions as segments arrive', async () => {
      // Arrange
      facade.startTranscription();
      const segment1: TranscriptionSegment = { segmentId: 0, text: 'tenho dor' };

      // Act
      segments$.next(segment1);
      
      // Assert
      const transcriptions = await firstValueFrom(facade.transcriptions$);
      expect(transcriptions[0].isLoading).toBe(false);
      expect(transcriptions[0].parts.some(p => p.text === 'dor' && p.isKeyword)).toBe(true);
      expect(transcriptions[1].isLoading).toBe(true);
    });

    it('should set isLoading to false when session completes', async () => {
        // Arrange
        facade.startTranscription();
  
        // Act
        segments$.complete(); // Simula o fim da transmissão
  
        // Assert
        const isLoading = await firstValueFrom(facade.isLoading$);
        expect(isLoading).toBe(false);
    });
  });

  describe('filteredTranscriptions$', () => {
    it('should filter transcriptions based on filterText', async () => {
      // Arrange: Coloca um estado inicial no Facade
      const segment1: TranscriptionSegment = { segmentId: 0, text: 'segmento um' };
      const segment2: TranscriptionSegment = { segmentId: 1, text: 'segmento dois' };
      const segments$ = new Subject<TranscriptionSegment>();
      mockStartSessionUseCase.execute.and.returnValue(segments$.asObservable());
      facade.startTranscription();
      segments$.next(segment1);
      segments$.next(segment2);
      segments$.complete();

      // Act
      facade.setFilter('dois');

      // Assert
      const filtered = await firstValueFrom(facade.filteredTranscriptions$);
      expect(filtered.length).toBe(1);
      expect(filtered[0].segmentId).toBe(1);
    });
  });
});