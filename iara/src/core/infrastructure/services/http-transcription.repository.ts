import { Injectable } from "@angular/core";
import { Observable, from } from "rxjs";
import { TranscriptionRepository } from "../../../app/features/transcription/3-domain/repositories/transcription.repository";
import { TranscriptionSegment } from "../../../app/features/transcription/3-domain/models/transcription.model";

const mockSpeechRecognitionAPI = {
    sampleSentences: [
        "Olá, doutor. Tenho sentido uma dor de cabeça persistente.",
        "A dor se concentra na parte de trás da minha cabeça e às vezes irradia para o meu pescoço.",
        "Começou há cerca de três dias.",
        "Não, não tive febre nem outros sintomas.",
        "Sim, tomei um analgésico, mas não ajudou muito.",
        "A dor piora quando fico muito tempo em frente ao computador.",
        "Certo, doutor. Farei os exames que o senhor pediu.",
        "Muito obrigado pela sua ajuda.",
        "Vou marcar o retorno assim que tiver os resultados.",
        "Tenha um bom dia.",
      ],

    fetchTranscription(segmentId: number): Promise<TranscriptionSegment> {
        return new Promise((resolve) => {
            const delay = Math.random() * 50 + 50;
            setTimeout(() => {
                const text = this.sampleSentences[segmentId % this.sampleSentences.length];
                resolve({ segmentId, text });
            }, delay);
        });
    },
};

@Injectable() 
export class HttpTranscriptionRepository extends TranscriptionRepository {

    override getLiveSessionSegmentCount(): number {
        return mockSpeechRecognitionAPI.sampleSentences.length;
    }

    override getMedicalKeywords(): Observable<string[]> {
        const promise = fetch("https://iara-interview-data-65704389243.southamerica-east1.run.app")
            .then(response => {
                if (!response.ok) throw new Error(`Erro na API: Status ${response.status}`);
                return response.json();
            })
            .then(data => data.keywords || [])
            .catch(error => {
                console.error("Falha ao buscar palavras-chave médicas:", error);
                throw new Error("Não foi possível carregar os dados das palavras-chave.");
            });
        
        return from(promise);
    }

    override fetchTranscription(segmentId: number): Observable<TranscriptionSegment> {
        return from(mockSpeechRecognitionAPI.fetchTranscription(segmentId));
    }
}