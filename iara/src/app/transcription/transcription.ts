import { Component, OnInit } from '@angular/core';
import { TranscriptionService } from '../services/transcription';
import { CommonModule } from '@angular/common';

interface TranscriptionItem {
  segmentId: number;
  content: string;
}

@Component({
  selector: 'app-transcription',
  standalone: true,
  imports: [CommonModule], // Importe CommonModule para usar *ngFor
  templateUrl: './transcription.html',
  styleUrl: './transcription.css'
})
export class TranscriptionComponent implements OnInit {

  isTranscriptionActive = false;
  displayedTranscriptions: TranscriptionItem[] = [];

  private medicalKeywords: string[] = [];
  private segmentCounter = 0;
  private readonly maxSegments = 10;
  private intervalId: any = null;

  constructor(private transcriptionService: TranscriptionService) {}

  ngOnInit(): void {
    // Carrega as palavras-chave quando o componente é inicializado
    this.transcriptionService.getMedicalKeywords().then(keywords => {
      this.medicalKeywords = keywords;
    });
  }

  startTranscription(): void {
    this.isTranscriptionActive = true;
    this.displayedTranscriptions = [];
    this.segmentCounter = 0;

    this.intervalId = setInterval(() => {
      if (this.segmentCounter >= this.maxSegments) {
        clearInterval(this.intervalId);
        this.isTranscriptionActive = false;
        return;
      }

      this.transcriptionService.fetchTranscription(this.segmentCounter)
        .then(response => {
          this.display(response);
        });

      this.segmentCounter++;
    }, 100);
  }

  private display(response: { segmentId: number; text: string }): void {
    const processedHtml = `<b>Segmento ${response.segmentId + 1}:</b> ${this.processKeywords(response.text)}`;
    this.displayedTranscriptions.push({
      segmentId: response.segmentId,
      content: processedHtml
    });
  }

  private processKeywords(text: string): string {
    let processedText = text;
    this.medicalKeywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      processedText = processedText.replace(regex, `<span class="keyword">$1</span>`);
    });
    return processedText;
  }
}