import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranscriptionFacade } from '../transcription.facade';
import { DisplayedTranscription } from '../../3-domain/models/transcription.model';

@Component({
  selector: 'app-transcription', // CORREÇÃO: Seletor ajustado
  standalone: true,
  imports: [ CommonModule, FormsModule, ScrollingModule ],
  templateUrl: './transcription.component.html',
  styleUrls: ['./transcription.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // CORREÇÃO: providers removido daqui e centralizado no app.config.ts
})
export class TranscriptionComponent {
  
  // CORREÇÃO: Acessamos o facade diretamente no template,
  // não precisamos mais redeclarar os observables aqui.
  // Isso resolve o erro "property used before initialization".
  
  // Mantém o ngModel para o filtro
  _filterText: string = '';

  // Injeta o Facade como uma propriedade pública para que o template possa acessá-lo.
  constructor(public facade: TranscriptionFacade) {}

  onFilterChange(text: string): void {
    this.facade.setFilter(text);
  }

  trackBySegmentId(index: number, item: DisplayedTranscription): number { 
    return item ? item.segmentId : index; 
  }
}