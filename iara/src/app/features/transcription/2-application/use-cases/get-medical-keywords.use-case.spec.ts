import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { GetMedicalKeywordsUseCase } from './get-medical-keywords.use-case';
import { TranscriptionRepository } from '../../3-domain/repositories/transcription.repository';

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
    const keywords = ['dor de cabeça', 'febre'];
    mockTranscriptionRepository.getMedicalKeywords.and.returnValue(of(keywords));

    useCase.execute().subscribe(result => {
      expect(result).toEqual(keywords);
      expect(repository.getMedicalKeywords).toHaveBeenCalled();
      done(); 
    });
  });

  it('should propagate an error if repository fails', (done: DoneFn) => {
    const error = new Error('API Error');
    mockTranscriptionRepository.getMedicalKeywords.and.returnValue(throwError(() => error));

    useCase.execute().subscribe({
      error: (err) => {
        expect(err).toEqual(error);
        expect(repository.getMedicalKeywords).toHaveBeenCalled();
        done();
      }
    });
  });
});