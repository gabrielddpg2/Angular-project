import { Injectable } from '@angular/core';

const mockSpeechRecognitionAPI = {
  sampleSentences: [
    "O paciente relata dor de cabeça.",
    "A febre persiste há três dias.",
    "Foi receitado um analgésico para o controle da dor.",
    "Os exames de sangue não mostraram alterações significativas.",
    "Recomendo repouso e hidratação contínua.",
    "A dor irradia para a região do pescoço.",
    "Não há histórico de alergias a medicamentos.",
    "A pressão arterial está estável em 120 por 80.",
    "O retorno deve ser agendado em uma semana para reavaliação.",
    "Foram solicitados exames de imagem para um diagnóstico mais preciso.",
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