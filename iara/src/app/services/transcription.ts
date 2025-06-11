import { Injectable } from '@angular/core';

// Simula uma API de reconhecimento de fala
const mockSpeechRecognitionAPI = {
  transcriptions: [
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
  fetchTranscription(segmentId: number): Promise<{ segmentId: number, text: string }> {
    return new Promise((resolve) => {
      const delay = Math.random() * 1200 + 200;
      setTimeout(() => {
        resolve({
          segmentId,
          text: this.transcriptions[segmentId] || "Fim da transcrição.",
        });
      }, delay);
    });
  },
};

@Injectable({
  providedIn: 'root'
})
export class TranscriptionService {

  constructor() { }

  // Retorna as palavras-chave médicas da API externa
  async getMedicalKeywords(): Promise<string[]> {
    const response = await fetch(
      "https://iara-interview-data-65704389243.southamerica-east1.run.app"
    );
    const data = await response.json();
    return data.keywords;
  }

  // Busca uma transcrição do mock
  fetchTranscription(segmentId: number) {
    return mockSpeechRecognitionAPI.fetchTranscription(segmentId);
  }
}