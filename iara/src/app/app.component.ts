import { Component } from '@angular/core';
// O import do componente da feature está correto
import { TranscriptionComponent } from './features/transcription/1-presentation/components/transcription.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // CORREÇÃO 1: Removido o RouterOutlet que não é usado.
  imports: [TranscriptionComponent], 
  // CORREÇÃO 2: Ajustado o template para usar o seletor correto.
  template: `<app-transcription></app-transcription>`, 
})
export class AppComponent {}