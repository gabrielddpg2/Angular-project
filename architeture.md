/src
├── app/
│   ├── features/
│   │   └── transcription/
│   │       ├── 1-presentation/
│   │       │   ├── components/
│   │       │   │   ├── transcription.component.css
│   │       │   │   ├── transcription.component.html
│   │       │   │   └── transcription.component.ts
│   │       │   └── transcription.facade.ts
│   │       ├── 2-application/
│   │       │   └── use-cases/
│   │       │       ├── get-medical-keywords.use-case.ts
│   │       │       └── start-transcription-session.use-case.ts
│   │       └── 3-domain/
│   │           ├── models/
│   │           │   └── transcription.model.ts
│   │           └── repositories/
│   │               └── transcription.repository.ts
│   ├── app.config.ts
│   └── app.component.ts
│
└── core/
    └── infrastructure/
        └── services/
            └── http-transcription.repository.ts