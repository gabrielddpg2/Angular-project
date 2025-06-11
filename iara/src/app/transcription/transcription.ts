import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { TranscriptionService } from '../services/transcription';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  templateUrl: './transcription.html',
  styleUrl: './transcription.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranscriptionComponent implements OnInit {

  isTranscriptionActive = false;
  displayedTranscriptions: DisplayedTranscription[] = [];
  
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
    });
  }

  async startTranscription(): Promise<void> {
    this.isTranscriptionActive = true;
    
    this.displayedTranscriptions = Array.from({ length: this.maxSegments }, (_, i) => ({
      segmentId: i,
      parts: [],
      isLoading: true
    }));
    this.cdr.markForCheck();

    for (let i = 0; i < this.maxSegments; i++) {
      try {
        const response = await this.transcriptionService.fetchTranscription(i);
        const transcriptionIndex = this.displayedTranscriptions.findIndex(t => t.segmentId === response.segmentId);
        
        if (transcriptionIndex !== -1) {
          this.displayedTranscriptions[transcriptionIndex] = {
            segmentId: response.segmentId,
            parts: this.processKeywords(response.text),
            isLoading: false
          };
          this.cdr.markForCheck();
        }
      } catch (error) {
        console.error(`Failed to fetch segment ${i}:`, error);
        const transcriptionIndex = this.displayedTranscriptions.findIndex(t => t.segmentId === i);
        if (transcriptionIndex !== -1) {
          this.displayedTranscriptions[transcriptionIndex].isLoading = false;
          this.displayedTranscriptions[transcriptionIndex].parts = [{ text: "Erro ao carregar este segmento.", isKeyword: false }];
          this.cdr.markForCheck();
        }
      }
    }

    this.isTranscriptionActive = false;
    this.cdr.markForCheck();
  }
  
  trackBySegmentId(index: number, item: DisplayedTranscription): number {
    return item.segmentId;
  }

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