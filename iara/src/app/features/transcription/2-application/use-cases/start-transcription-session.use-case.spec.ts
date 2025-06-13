import { TestBed } from '@angular/core/testing';
import { StartTranscriptionSessionUseCase } from './start-transcription-session.use-case';
import { TranscriptionRepository } from '../../3-domain/repositories/transcription.repository';
import { of } from 'rxjs';
import { TranscriptionSegment } from '../../3-domain/models/transcription.model';

const mockRepository = {
  getLiveSessionSegmentCount: jasmine.createSpy('getLiveSessionSegmentCount').and.returnValue(2),
  fetchTranscription: jasmine.createSpy('fetchTranscription')
};

describe('StartTranscriptionSessionUseCase', () => {
  let useCase: StartTranscriptionSessionUseCase;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StartTranscriptionSessionUseCase,
        { provide: TranscriptionRepository, useValue: mockRepository }
      ]
    });
    useCase = TestBed.inject(StartTranscriptionSessionUseCase);
  });

  it('should fetch segments sequentially up to the segment count', (done: DoneFn) => {
    const segment1: TranscriptionSegment = { segmentId: 0, text: 'Segmento 0' };
    const segment2: TranscriptionSegment = { segmentId: 1, text: 'Segmento 1' };

    mockRepository.fetchTranscription.withArgs(0).and.returnValue(of(segment1));
    mockRepository.fetchTranscription.withArgs(1).and.returnValue(of(segment2));
    
    const emittedSegments: TranscriptionSegment[] = [];

    useCase.execute().subscribe({
      next: (segment) => emittedSegments.push(segment),
      complete: () => {
        expect(mockRepository.getLiveSessionSegmentCount).toHaveBeenCalled();
        expect(mockRepository.fetchTranscription).toHaveBeenCalledWith(0);
        expect(mockRepository.fetchTranscription).toHaveBeenCalledWith(1);
        expect(mockRepository.fetchTranscription).toHaveBeenCalledTimes(2);
        expect(emittedSegments).toEqual([segment1, segment2]);
        done();
      }
    });
  });
});