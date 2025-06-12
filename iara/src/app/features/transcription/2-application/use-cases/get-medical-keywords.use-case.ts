import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TranscriptionRepository } from "../../3-domain/repositories/transcription.repository";

@Injectable() // CORREÇÃO: Adicionado @Injectable()
export class GetMedicalKeywordsUseCase {
    constructor(private transcriptionRepository: TranscriptionRepository) {}

    execute(): Observable<string[]> {
        return this.transcriptionRepository.getMedicalKeywords();
    }
}