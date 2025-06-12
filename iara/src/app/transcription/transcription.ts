import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Subject } from 'rxjs';

import { TranscriptionService } from '../services/transcription';

// Interfaces (sem alterações)
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
    FormsModule,
    ScrollingModule
  ],
  templateUrl: './transcription.html',
  styleUrl: './transcription.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranscriptionComponent implements OnInit, OnDestroy {

  isTranscriptionActive = false;
  displayedTranscriptions: DisplayedTranscription[] = [];
  keywordError: string | null = null;
  filterText: string = '';

  private medicalKeywordSet = new Set<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private transcriptionService: TranscriptionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.transcriptionService.getMedicalKeywords().then(keywords => {
      this.medicalKeywordSet = new Set(keywords.map(k => k.toLowerCase()));
    }).catch(error => {
      this.keywordError = "Falha ao carregar palavras-chave. O destaque não funcionará.";
      console.error(error);
    }).finally(() => {
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    
    // --- INÍCIO DA CORREÇÃO ---
    // Pega dinamicamente o número de segmentos do serviço. Adeus, número mágico!
    const liveSessionSegments = this.transcriptionService.getLiveSessionSegmentCount();
    // --- FIM DA CORREÇÃO ---

    this.displayedTranscriptions = Array.from({ length: liveSessionSegments }, (_, i) => ({ 
      segmentId: i, 
      parts: [], 
      isLoading: true 
    }));
    
    this.cdr.markForCheck();

    for (let i = 0; i < liveSessionSegments; i++) {
        if (!this.isTranscriptionActive) break;

        try {
            const response = await this.transcriptionService.fetchTranscription(i);
            const index = i;
            
            const newItem = { 
                segmentId: response.segmentId, 
                parts: this.processKeywords(response.text), 
                isLoading: false 
            };

            const newTranscriptions = [...this.displayedTranscriptions];
            newTranscriptions[index] = newItem;
            this.displayedTranscriptions = newTranscriptions;
            
            this.cdr.markForCheck();
        } catch (error) {
            console.error(`Falha ao buscar segmento ${i}:`, error);
        }
    }

    this.isTranscriptionActive = false;
    this.cdr.markForCheck();
  }
  
  exportToTxt(): void {
    if (this.displayedTranscriptions.every(t => !t || t.isLoading)) return;

    const content = this.displayedTranscriptions
      .filter(item => item && !item.isLoading)
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

  trackBySegmentId(index: number, item: DisplayedTranscription): number { 
    return item ? item.segmentId : index; 
  }
  
  private processKeywords(text: string): TranscriptionPart[] {
    if (this.medicalKeywordSet.size === 0 || text.trim() === '') {
      return [{ text, isKeyword: false }];
    }
  
    const wordSplitRegex = /([a-zA-ZÀ-ú0-9]+)|([.,;!?\s]+)/g;
    const parts = text.match(wordSplitRegex) || [];
  
    return parts.map(part => {
      const isKeyword = this.medicalKeywordSet.has(part.toLowerCase());
      return { text: part, isKeyword };
    });
  }
}