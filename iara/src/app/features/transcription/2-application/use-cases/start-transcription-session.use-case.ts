import { Injectable } from "@angular/core";
import { Observable, range, concatMap, from } from "rxjs";
import { TranscriptionRepository } from "../../3-domain/repositories/transcription.repository";
import { TranscriptionSegment } from "../../3-domain/models/transcription.model";

@Injectable() // CORREÇÃO: Adicionado @Injectable()
export class StartTranscriptionSessionUseCase {
    constructor(private transcriptionRepository: TranscriptionRepository) {}

    execute(): Observable<TranscriptionSegment> {
        const segmentCount = this.transcriptionRepository.getLiveSessionSegmentCount();
        return range(0, segmentCount).pipe(
            concatMap(i => from(this.transcriptionRepository.fetchTranscription(i)))
        );
    }
}