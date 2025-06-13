/**
 * Representa uma parte do texto, indicando se é uma palavra-chave.
 */
export interface TranscriptionPart {
  text: string;
  isKeyword: boolean;
}

/**
 * Representa um único segmento da transcrição com seu conteúdo já processado.
 */
export interface DisplayedTranscription {
  segmentId: number;
  parts: TranscriptionPart[];
  isLoading: boolean;
}

/**
 * Representa a entidade de negócio "Segmento de Transcrição" como vem da fonte de dados.
 */
export interface TranscriptionSegment {
    segmentId: number;
    text: string;
}