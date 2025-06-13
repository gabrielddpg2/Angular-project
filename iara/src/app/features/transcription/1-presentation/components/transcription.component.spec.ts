import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranscriptionComponent } from './transcription.component';
import { TranscriptionFacade } from '../transcription.facade';
import { BehaviorSubject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const mockFacade = {
  isLoading$: new BehaviorSubject<boolean>(false),
  filteredTranscriptions$: new BehaviorSubject<any[]>([]),
  error$: new BehaviorSubject<string | null>(null),
  startTranscription: jasmine.createSpy('startTranscription'),
  exportToTxt: jasmine.createSpy('exportToTxt'),
  setFilter: jasmine.createSpy('setFilter')
};

describe('TranscriptionComponent', () => {
  let component: TranscriptionComponent;
  let fixture: ComponentFixture<TranscriptionComponent>;
  let facade: TranscriptionFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranscriptionComponent],
      providers: [
        { provide: TranscriptionFacade, useValue: mockFacade }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TranscriptionComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(TranscriptionFacade);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call facade.startTranscription when start button is clicked', () => {
    const button = fixture.nativeElement.querySelector('#startButton');
    button.click();
    expect(facade.startTranscription).toHaveBeenCalled();
  });

  it('should display an error message when error$ emits a value', () => {
    const errorMessage = 'Ocorreu um erro!';
    mockFacade.error$.next(errorMessage);
    
    fixture.detectChanges();
    
    const errorElement = fixture.nativeElement.querySelector('[role="alert"]');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent).toContain(errorMessage);
  });

  it('should display the transcription list', () => {
    const transcriptions = [
      { segmentId: 0, parts: [{ text: 'Olá', isKeyword: false }], isLoading: false },
      { segmentId: 1, parts: [{ text: 'Doutor', isKeyword: true }], isLoading: false },
    ];
    mockFacade.filteredTranscriptions$.next(transcriptions);

    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.p-4.border-b');
    expect(items.length).toBe(2);
  });
});