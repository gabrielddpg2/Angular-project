import { Injectable } from '@angular/core';

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

  fetchTranscription(segmentId: number): Promise<{ segmentId: number, text: string }> {
    return new Promise((resolve) => {
      const delay = Math.random() * 50 + 50;
      
      setTimeout(() => {
        // A lógica de repetição com o módulo (%) continua aqui, mas o componente
        // não vai mais solicitar índices que causem a repetição.
        const text = this.sampleSentences[segmentId % this.sampleSentences.length];
        
        resolve({
          segmentId,
          text: text,
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

  /**
   * Retorna o número de segmentos disponíveis para a simulação de sessão ao vivo.
   * Isso desacopla o componente do conhecimento interno do mock de dados.
   */
  getLiveSessionSegmentCount(): number {
    return mockSpeechRecognitionAPI.sampleSentences.length;
  }

  async getMedicalKeywords(): Promise<string[]> {
    try {
      const response = await fetch(
        "https://iara-interview-data-65704389243.southamerica-east1.run.app"
      );

      if (!response.ok) {
        throw new Error(`Erro na API: Status ${response.status}`);
      }

      const data = await response.json();
      return data.keywords || [];
    } catch (error) {
      console.error("Falha ao buscar palavras-chave médicas:", error);
      throw new Error("Não foi possível carregar os dados das palavras-chave.");
    }
  }

  fetchTranscription(segmentId: number) {
    return mockSpeechRecognitionAPI.fetchTranscription(segmentId);
  }
}