import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranscriptionService } from '../services/transcription';

interface TranscriptionPart {
  text: string;
  isKeyword: boolean;
}

interface DisplayedTranscription {
  segmentId: number;
  parts: TranscriptionPart[];
  isLoading: boolean;
}

@Component({
  selector: 'app-transcription',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './transcription.html',
  styleUrl: './transcription.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranscriptionComponent implements OnInit {

  isTranscriptionActive = false;
  displayedTranscriptions: DisplayedTranscription[] = [];
  keywordError: string | null = null;
  filterText: string = '';

  private medicalKeywords: string[] = [];
  private medicalKeywordsRegex: RegExp | null = null;
  private readonly maxSegments = 10;

  constructor(
    private transcriptionService: TranscriptionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.transcriptionService.getMedicalKeywords().then(keywords => {
      this.medicalKeywords = keywords;
      if (this.medicalKeywords.length > 0) {
        const pattern = this.medicalKeywords.map(k => k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|');
        this.medicalKeywordsRegex = new RegExp(`(${pattern})`, 'gi');
      }
    }).catch(error => {
      this.keywordError = "Falha ao carregar palavras-chave. O destaque não funcionará.";
      console.error(error);
    }).finally(() => {
      this.cdr.markForCheck();
    });
  }

  get filteredTranscriptions(): DisplayedTranscription[] {
    if (!this.filterText) {
      return this.displayedTranscriptions;
    }
    const filter = this.filterText.toLowerCase();
    return this.displayedTranscriptions.filter(item => 
      !item.isLoading && item.parts.some(part => part.text.toLowerCase().includes(filter))
    );
  }

  async startTranscription(): Promise<void> {
    this.isTranscriptionActive = true;
    this.filterText = '';
    
    this.displayedTranscriptions = Array.from({ length: this.maxSegments }, (_, i) => ({ segmentId: i, parts: [], isLoading: true }));
    this.cdr.markForCheck();

    for (let i = 0; i < this.maxSegments; i++) {
        const response = await this.transcriptionService.fetchTranscription(i);
        const index = this.displayedTranscriptions.findIndex(t => t.segmentId === response.segmentId);
        if (index !== -1) {
            this.displayedTranscriptions[index] = { segmentId: response.segmentId, parts: this.processKeywords(response.text), isLoading: false };
            this.cdr.markForCheck();
        }
    }

    this.isTranscriptionActive = false;
    this.cdr.markForCheck();
  }
  
  exportToTxt(): void {
    if (this.displayedTranscriptions.every(t => t.isLoading)) return;

    const content = this.displayedTranscriptions
      .filter(item => !item.isLoading)
      .map(item => {
        const text = item.parts.map(part => part.text).join('');
        return `Segmento ${item.segmentId + 1}: ${text}`;
      })
      .join('\n\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transcricao.txt';
    link.click();
    URL.revokeObjectURL(url);
  }

  trackBySegmentId(index: number, item: DisplayedTranscription): number { return item.segmentId; }
  
  private processKeywords(text: string): TranscriptionPart[] {
    if (!this.medicalKeywordsRegex || text.trim() === '') {
      return [{ text, isKeyword: false }];
    }
    const keywordSet = new Set(this.medicalKeywords);
    const parts = text.split(this.medicalKeywordsRegex).filter(part => part);
    return parts.map(part => ({
      text: part,
      isKeyword: keywordSet.has(part)
    }));
  }
}