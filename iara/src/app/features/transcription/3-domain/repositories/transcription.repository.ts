import { Observable } from "rxjs";
import { TranscriptionSegment } from "../models/transcription.model";

/**
 * A Abstração (Contrato) do Repositório.
 * Define O QUE pode ser feito em termos de dados de transcrição, mas não COMO.
 * As camadas de aplicação e domínio dependem desta abstração, não de uma implementação concreta.
 */
export abstract class TranscriptionRepository {
    abstract getLiveSessionSegmentCount(): number;
    abstract getMedicalKeywords(): Observable<string[]>;
    abstract fetchTranscription(segmentId: number): Observable<TranscriptionSegment>;
}