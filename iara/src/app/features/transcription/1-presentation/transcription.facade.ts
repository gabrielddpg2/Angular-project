import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Subject, catchError, takeUntil, of, map, combineLatest } from "rxjs";
import { GetMedicalKeywordsUseCase } from "../2-application/use-cases/get-medical-keywords.use-case";
import { StartTranscriptionSessionUseCase } from "../2-application/use-cases/start-transcription-session.use-case";
import { DisplayedTranscription, TranscriptionPart, TranscriptionSegment } from "../3-domain/models/transcription.model";

@Injectable() // CORREÇÃO: Adicionado @Injectable()
export class TranscriptionFacade implements OnDestroy {
    private state = {
        transcriptions: new BehaviorSubject<DisplayedTranscription[]>([]),
        isLoading: new BehaviorSubject<boolean>(false),
        error: new BehaviorSubject<string | null>(null),
        filterText: new BehaviorSubject<string>(''),
    };
    private medicalKeywordSet = new Set<string>();
    private destroy$ = new Subject<void>();
    private sessionStop$ = new Subject<void>();

    public readonly transcriptions$ = this.state.transcriptions.asObservable();
    public readonly isLoading$ = this.state.isLoading.asObservable();
    public readonly error$ = this.state.error.asObservable();

    public readonly filteredTranscriptions$ = combineLatest([
        this.transcriptions$,
        this.state.filterText.asObservable().pipe(map(text => text.toLowerCase()))
    ]).pipe(
        map(([transcriptions, filter]) => {
            if (!filter) return transcriptions;
            // CORREÇÃO: Adicionado tipo explícito para 'part'
            return transcriptions.filter(item =>
                !item.isLoading && item.parts.some((part: TranscriptionPart) => part.text.toLowerCase().includes(filter))
            );
        })
    );

    constructor(
        private getMedicalKeywords: GetMedicalKeywordsUseCase,
        private startTranscriptionSession: StartTranscriptionSessionUseCase
    ) {
        this.loadInitialKeywords();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    startTranscription(): void {
        this.sessionStop$.next();
        this.state.isLoading.next(true);
        this.state.filterText.next('');
        
        const segmentCount = this.startTranscriptionSession['transcriptionRepository'].getLiveSessionSegmentCount();
        const skeletons = Array.from({ length: segmentCount }, (_, i) => ({ segmentId: i, parts: [], isLoading: true }));
        this.state.transcriptions.next(skeletons);

        this.startTranscriptionSession.execute().pipe(
            takeUntil(this.sessionStop$),
            takeUntil(this.destroy$)
        ).subscribe({
            // CORREÇÃO: Adicionado tipo explícito para 'segment'
            next: (segment: TranscriptionSegment) => this.updateTranscriptionSegment(segment),
            complete: () => this.state.isLoading.next(false),
            // CORREÇÃO: Adicionado tipo 'any' para o erro, que é uma prática comum
            error: (err: any) => {
                console.error("Erro na sessão de transcrição", err);
                this.state.error.next("Ocorreu um erro durante a transcrição.");
                this.state.isLoading.next(false);
            }
        });
    }

    setFilter(text: string): void {
        this.state.filterText.next(text);
    }
    
    exportToTxt(): void {
        const transcriptions = this.state.transcriptions.getValue();
        if (transcriptions.every(t => !t || t.isLoading)) return;

        const content = transcriptions
            .filter(item => item && !item.isLoading)
            // CORREÇÃO: Adicionado tipo explícito para 'item' e 'part'
            .map((item: DisplayedTranscription) => {
                const text = item.parts.map((part: TranscriptionPart) => part.text).join('');
                return `Segmento ${item.segmentId + 1}: ${text}`;
            })
            .join('\n\n');

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'transcricao.txt';
        link.click();
        URL.revokeObjectURL(url);
    }
    
    private loadInitialKeywords(): void {
        this.getMedicalKeywords.execute().pipe(
            takeUntil(this.destroy$),
            catchError((err: any) => {
                this.state.error.next("Falha ao carregar palavras-chave. O destaque não funcionará.");
                return of([]);
            })
        // CORREÇÃO: Adicionado tipo explícito para 'keywords' e 'k'
        ).subscribe((keywords: string[]) => {
            this.medicalKeywordSet = new Set(keywords.map((k: string) => k.toLowerCase()));
        });
    }

    private updateTranscriptionSegment(segment: TranscriptionSegment): void {
        const currentTranscriptions = this.state.transcriptions.getValue();
        const newTranscriptions = [...currentTranscriptions];
        const index = segment.segmentId;

        if (index >= 0 && index < newTranscriptions.length) {
            newTranscriptions[index] = {
                segmentId: segment.segmentId,
                parts: this.processKeywords(segment.text),
                isLoading: false
            };
            this.state.transcriptions.next(newTranscriptions);
        }
    }

    private processKeywords(text: string): TranscriptionPart[] {
        if (this.medicalKeywordSet.size === 0 || text.trim() === '') {
          return [{ text, isKeyword: false }];
        }
      
        const wordSplitRegex = /([a-zA-ZÀ-ú0-9'-]+)|([^a-zA-ZÀ-ú0-9'-]+)/g;
        const parts = text.match(wordSplitRegex) || [];
      
        return parts.map(part => {
          const isKeyword = this.medicalKeywordSet.has(part.toLowerCase());
          return { text: part, isKeyword };
        });
    }
}