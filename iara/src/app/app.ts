import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranscriptionComponent } from './transcription/transcription';

@Component({
  selector: 'app-root',
  standalone: true,
  // Importe seu novo componente aqui
  imports: [RouterOutlet, TranscriptionComponent], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'meu-projeto-angular';
}