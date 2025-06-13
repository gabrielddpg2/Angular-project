import { Observable } from "rxjs";
import { TranscriptionSegment } from "../models/transcription.model";

export abstract class TranscriptionRepository {
    abstract getLiveSessionSegmentCount(): number;
    abstract getMedicalKeywords(): Observable<string[]>;
    abstract fetchTranscription(segmentId: number): Observable<TranscriptionSegment>;
}