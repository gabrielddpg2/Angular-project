import { Component } from '@angular/core';
import { TranscriptionComponent } from './features/transcription/1-presentation/components/transcription.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TranscriptionComponent], 
  template: `<app-transcription></app-transcription>`, 
})
export class AppComponent {}