import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { GetMedicalKeywordsUseCase } from './get-medical-keywords.use-case';
import { TranscriptionRepository } from '../../3-domain/repositories/transcription.repository';

// Criamos um mock do repositório. Ele simula o comportamento do repositório real.
const mockTranscriptionRepository = {
  getMedicalKeywords: jasmine.createSpy('getMedicalKeywords')
};

describe('GetMedicalKeywordsUseCase', () => {
  let useCase: GetMedicalKeywordsUseCase;
  let repository: TranscriptionRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GetMedicalKeywordsUseCase,
        // Quando o teste pedir por TranscriptionRepository, nós entregamos nosso mock.
        { provide: TranscriptionRepository, useValue: mockTranscriptionRepository }
      ]
    });
    useCase = TestBed.inject(GetMedicalKeywordsUseCase);
    repository = TestBed.inject(TranscriptionRepository);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  it('should call getMedicalKeywords from repository and return keywords on success', (done: DoneFn) => {
    // Arrange: Preparamos o cenário
    const keywords = ['dor de cabeça', 'febre'];
    mockTranscriptionRepository.getMedicalKeywords.and.returnValue(of(keywords));

    // Act: Executamos o caso de uso
    useCase.execute().subscribe(result => {
      // Assert: Verificamos o resultado
      expect(result).toEqual(keywords);
      expect(repository.getMedicalKeywords).toHaveBeenCalled();
      done(); // Informa ao Jasmine que o teste assíncrono terminou
    });
  });

  it('should propagate an error if repository fails', (done: DoneFn) => {
    // Arrange
    const error = new Error('API Error');
    mockTranscriptionRepository.getMedicalKeywords.and.returnValue(throwError(() => error));

    // Act & Assert
    useCase.execute().subscribe({
      error: (err) => {
        expect(err).toEqual(error);
        expect(repository.getMedicalKeywords).toHaveBeenCalled();
        done();
      }
    });
  });
});