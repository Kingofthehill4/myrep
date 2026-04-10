# AmyCore MVP

AmyCore is an internal studio production app with AmyCore-Video mock generation engine.

## Stack
- Next.js (App Router) + TypeScript
- Prisma ORM + SQLite (Postgres-ready data model patterns)
- Zod validation
- TailwindCSS
- Modular internal engine services (`lib/engine`)

## Features in MVP
- Dashboard with studio stats and recent jobs
- Projects list + create
- Project detail with links to internal tabs
- Character manager
- Structured scene blueprint editor with JSON preview
- Scene generation workflow (`Generate Clip`) via AmyCore-Video
- Jobs page with filtering + retry failed jobs
- Media library page
- Assembly page with clip ordering and timeline save

## AmyCore-Video architecture
`lib/engine/services.ts` implements:
- `SceneValidationService`
- `ScenePromptBuilderService`
- `CharacterConsistencyService`
- `GenerationOrchestrator`
- `ClipComposerService`
- `ExportService`
- `JobStatusService`

Mock provider interfaces and implementations are in `lib/engine/providers`:
- visual generation
- voice generation
- lip-sync
- audio bed
- composition
- export

## Run locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env:
   ```bash
   cp .env.example .env
   ```
3. Migrate and generate client:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Seed sample noir data:
   ```bash
   npm run db:seed
   ```
5. Start app:
   ```bash
   npm run dev
   ```

Open http://localhost:3000.

## Mocked vs real
### Mocked in MVP
- Provider model calls for visual/voice/lipsync/audio/composition/export
- Files are written as local JSON/text placeholder assets to `storage/`

### Ready for real integrations
- Provider interface boundaries (`interfaces.ts`)
- Orchestrator-based pipeline and job status tracking
- Structured scene payload builder and validation

## Recommended next steps
- Add auth/session guard for internal users
- Move generation orchestration into async worker queue
- Add background processing and webhook/event status updates
- Replace mock providers incrementally with actual model providers
- Add timeline playback preview and export bundles
