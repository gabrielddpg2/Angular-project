import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TranscriptionFacade } from './features/transcription/1-presentation/transcription.facade';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// Para este teste, só precisamos de um mock "vazio" para satisfazer a injeção de dependência.
const dummyFacade = {
  // Não precisa de implementação, a menos que o AppComponent interaja com ele.
};

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        // Fornecemos o mock do Facade aqui também.
        { provide: TranscriptionFacade, useValue: dummyFacade }
      ],
      // Usamos NO_ERRORS_SCHEMA para não precisar se preocupar com os componentes filhos
      // neste teste de unidade do AppComponent.
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});