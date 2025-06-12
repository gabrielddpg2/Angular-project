import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranscriptionComponent } from './transcription.component';
import { TranscriptionFacade } from '../transcription.facade';
import { BehaviorSubject, of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// Mock do Facade com BehaviorSubjects para podermos emitir valores durante o teste.
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
      // Não precisamos mais dos providers aqui, pois o componente usa o Facade
      schemas: [NO_ERRORS_SCHEMA] // Ignora elementos desconhecidos no template (como cdk-virtual-scroll-viewport)
    })
    // Sobrescrevemos o provider do Facade para usar nosso mock.
    .overrideComponent(TranscriptionComponent, {
      set: {
        providers: [{ provide: TranscriptionFacade, useValue: mockFacade }]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranscriptionComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(TranscriptionFacade);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call facade.startTranscription when start button is clicked', () => {
    // Arrange
    const button = fixture.nativeElement.querySelector('#startButton');
    
    // Act
    button.click();
    
    // Assert
    expect(facade.startTranscription).toHaveBeenCalled();
  });

  it('should display an error message when error$ emits a value', () => {
    // Arrange
    const errorMessage = 'Ocorreu um erro!';
    mockFacade.error$.next(errorMessage);
    
    // Act
    fixture.detectChanges();
    
    // Assert
    const errorElement = fixture.nativeElement.querySelector('[role="alert"]');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent).toContain(errorMessage);
  });

  it('should display the transcription list', () => {
    // Arrange
    const transcriptions = [
      { segmentId: 0, parts: [{ text: 'Olá', isKeyword: false }], isLoading: false },
      { segmentId: 1, parts: [{ text: 'Doutor', isKeyword: true }], isLoading: false },
    ];
    mockFacade.filteredTranscriptions$.next(transcriptions);

    // Act
    fixture.detectChanges();

    // Assert
    const items = fixture.nativeElement.querySelectorAll('.p-4.border-b'); // Seletor simplificado para os itens
    expect(items.length).toBe(2);
  });
});