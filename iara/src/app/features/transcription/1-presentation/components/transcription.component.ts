import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranscriptionFacade } from '../transcription.facade';
import { DisplayedTranscription } from '../../3-domain/models/transcription.model';

@Component({
  selector: 'app-transcription', 
  standalone: true,
  imports: [ CommonModule, FormsModule, ScrollingModule ],
  templateUrl: './transcription.component.html',
  styleUrls: ['./transcription.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranscriptionComponent {
  
  _filterText: string = '';

  constructor(public facade: TranscriptionFacade) {}

  onFilterChange(text: string): void {
    this.facade.setFilter(text);
  }

  trackBySegmentId(index: number, item: DisplayedTranscription): number { 
    return item ? item.segmentId : index; 
  }
}