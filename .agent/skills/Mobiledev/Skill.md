# Mobile App Publisher — Master Skill (documento completo)

Skill completa per progettare, sviluppare, testare, pubblicare e mantenere app mobile professionali su Google Play Store e Apple App Store. Architettura canonica enterprise-grade, zero hardcoding, zero euforia — solo codice e processo reali.

Questo documento contiene, in un unico file, tutto il contenuto della skill: il corpo principale (SKILL.md) più i cinque reference di approfondimento (architettura/stack, CI/CD, qualità/sicurezza/compliance, pubblicazione store, manutenzione/AI layer), originariamente organizzati come file separati per il caricamento progressivo. Qui sono uniti per consultazione e archiviazione come documento singolo.

---

# Mobile App Publisher — Master Skill

Skill per portare un'app mobile da zero a pubblicata (Google Play + Apple App Store) e mantenuta nel tempo, con standard da software house professionale. Non produce mai demo, prototipi finti o placeholder spacciati per prodotto finito.

## Principi non negoziabili

Questi principi vincolano OGNI output prodotto sotto questa skill, sia in fase di reasoning (Claude) sia in fase di code execution (agente esecutore, es. AntiGravity):

1. **Zero hardcoding.** Nessuna stringa di configurazione, URL, chiave API, ID prodotto, testo utente o soglia di business logic scritta a mano nel codice sorgente. Tutto passa da: variabili d'ambiente (`.env` + EAS Secrets / Xcode Config), file di configurazione tipizzati, sistema di i18n, remote config quando il valore cambia senza rilasciare una build.
2. **Zero euforia.** Niente linguaggio da marketing nei commit, nei commenti, nella documentazione o nelle risposte ("rivoluzionario", "next-gen", "game changer"). Documentazione tecnica asciutta: cosa fa, perché, quali sono i trade-off, cosa NON fa.
3. **Codice reale, non simulato.** Nessuna funzione che ritorna dati finti spacciati per dati reali, nessun `TODO` presentato come completato, nessun test che passa perché mocka la cosa che dovrebbe verificare. Se una feature non è implementabile in questa iterazione, va dichiarata esplicitamente come tale (stato "non implementato"), mai finta.
4. **Architettura canonica, non creativa.** Si seguono pattern industry-standard riconosciuti (Clean Architecture / feature-based modular architecture), non soluzioni ad-hoc "originali". La leggibilità e la manutenibilità da parte di un altro team battono sempre l'eleganza personale.
5. **Ogni claim è verificabile.** "Fatto" significa: compila, passa i test, passa il linting, è stato eseguito almeno una volta. Non significa "dovrebbe funzionare".

## Workflow end-to-end

Segui le fasi in ordine. Non saltare alla fase 4 (sviluppo) senza aver chiuso la fase 1 (decisione architetturale) — è la causa più comune di rework costoso in produzione mobile.

| # | Fase | Riferimento |
|---|------|-------------|
| 1 | Discovery & decisione stack | `references/architettura-e-stack.md` |
| 2 | Architettura & struttura progetto | `references/architettura-e-stack.md` |
| 3 | Setup ambienti, secrets, CI/CD | `references/cicd-pipeline.md` |
| 4 | Sviluppo (feature-by-feature) | questo file, sezione "Ciclo di sviluppo" |
| 5 | Qualità: test, sicurezza, compliance | `references/qualita-sicurezza-compliance.md` |
| 6 | Pubblicazione Play Store + App Store | `references/pubblicazione-store.md` |
| 7 | Manutenzione, monitoring, versioning | `references/manutenzione-e-ai-layer.md` |

Carica il file di reference pertinente solo quando entri in quella fase — non è necessario tenerli tutti in contesto contemporaneamente.

### Fase 1-2 — Discovery & decisione stack (sintesi, dettaglio in reference)

Prima riga di codice: rispondi a queste domande, esplicitamente, prima di procedere.

- **Target**: Android + iOS entrambi al day one, o uno prima? (cambia la scelta cross-platform vs nativo)
- **Superficie UI**: form-heavy/CRUD (favorisce cross-platform) vs animazioni/performance-critical/AR-VR (favorisce nativo o Flutter con Skia)
- **Team**: solo (AG) + agenti di code execution → favorisce un unico linguaggio/toolchain coerente con lo stack esistente (TypeScript)
- **Backend**: già esiste (Supabase nello stack AgTechDesigne) → il client mobile deve riusare gli stessi schemi/tipi, non duplicarli
- **Ciclo di rilascio desiderato**: se serve iterare più volte a settimana senza passare ogni volta dalla review store, serve una strategia di OTA update (vedi `manutenzione-e-ai-layer.md`)

Default raccomandato per il contesto AgTechDesigne (coerenza con Next.js/TypeScript/Supabase, singolo operatore, agenti AI in pipeline): **React Native con New Architecture, gestito da Expo (EAS Build/Submit/Update), TypeScript strict, monorepo condiviso con eventuali tipi/schema del backend Supabase.** Alternative e quando preferirle sono nella matrice di `architettura-e-stack.md` (Flutter, Kotlin Multiplatform, nativo puro).

### Ciclo di sviluppo (Fase 4)

Per ogni feature, in quest'ordine:

1. **Contratto dati**: definisci tipi/schema (idealmente generati o condivisi dal backend, es. tipi Supabase generati, non ridefiniti a mano) prima della UI.
2. **Domain layer**: business logic pura, senza dipendenze da React Native o da SDK nativi — testabile in isolamento.
3. **Data layer**: repository che parla con Supabase/API — un solo punto di accesso ai dati per dominio, mai chiamate dirette sparse nei componenti.
4. **Presentation layer**: componenti UI, solo orchestrazione (chiamano hook/viewmodel, non contengono business logic).
5. **Test**: unit sul domain layer, integration sul data layer, component test sulla UI — scritti nella stessa PR, non dopo.
6. **Accessibilità**: label, contrasto, target touch ≥44pt, supporto screen reader — è un requisito store (soprattutto Apple), non un "nice to have".
7. **Review checklist anti-hardcoding** (vedi sotto) prima di considerare la feature chiusa.

### Checklist anti-hardcoding (da eseguire ad ogni PR/consegna)

- [ ] Nessuna stringa visibile all'utente è inline: tutte passano da i18n
- [ ] Nessun URL, endpoint, chiave, ID bundle/app è scritto letteralmente nel codice: tutti da config/env
- [ ] Nessun valore di business (prezzi, soglie, feature flag) è nel codice: da remote config o backend
- [ ] Nessun dato mock/finto rimasto in un percorso raggiungibile in produzione
- [ ] Nessun `console.log`/debug residuo, nessun commento "temporaneo" senza issue di riferimento
- [ ] Ogni funzione ha un tipo di ritorno esplicito (niente `any` implicito)

## Integrazione con la pipeline AgTechDesigne

Questa skill è pensata per essere usata nel flusso già in uso: AG definisce l'obiettivo → Claude applica questa skill per produrre architettura, decisioni e documentazione (in italiano, tono tecnico asciutto) → l'output va su Notion come specifica implementativa → l'agente di code execution (AntiGravity) implementa seguendo la specifica e la checklist anti-hardcoding → risultato riportato su Notion → Claude verifica coerenza con l'architettura definita in Fase 1-2 prima di dare "ok" ad AG.

Quando produci la specifica per Notion, struttura sempre: **Decisione presa → Motivazione (trade-off, non hype) → Cosa NON è incluso in questa iterazione → Criteri di accettazione verificabili.**

## Riferimenti

- `references/architettura-e-stack.md` — matrice di scelta stack, Clean Architecture canonica, struttura cartelle, gestione tipi condivisi col backend
- `references/cicd-pipeline.md` — EAS Build/Submit, GitHub Actions, gestione secrets, ambienti (dev/staging/prod), Fastlane per metadata/screenshot
- `references/qualita-sicurezza-compliance.md` — piramide di test, sicurezza (secrets, certificate pinning, offuscamento), GDPR/AI Act, Data Safety/Privacy Nutrition Labels
- `references/pubblicazione-store.md` — processo Play Console e App Store Connect passo-passo, code signing, review guidelines, staged rollout
- `references/manutenzione-e-ai-layer.md` — versioning semantico, crash/monitoring, OTA update, deprecazione, integrazione layer AI/agentico nell'app

---

## Architettura e Stack Tecnologico

### Matrice di scelta stack

Non esiste uno stack "giusto" in assoluto: la scelta è funzione di target, superficie UI, team e vincoli di rilascio. Usa questa tabella come decisione esplicita da mettere a verbale (Notion), non da dare per scontata.

| Criterio | React Native + Expo (New Architecture) | Flutter | Kotlin Multiplatform (KMP) + Compose | Nativo puro (Swift/Kotlin separati) |
|---|---|---|---|---|
| Coerenza con stack AgTechDesigne (TS/Next.js) | Alta — stesso linguaggio, tipi condivisibili col backend | Bassa — Dart isolato | Media — Kotlin lato business logic, ma UI nativa separata su iOS | Bassa — due codebase, due linguaggi |
| Time-to-market su singolo operatore + agenti AI | Alto | Medio | Medio-basso | Basso |
| Performance grafica/animazioni complesse | Buona con Reanimated/Skia, non al livello di Flutter su animazioni pesanti | Ottima (rendering proprio via Skia/Impeller) | Nativa (dipende dal layer UI scelto) | Ottima, massimo controllo |
| Accesso ad API native recenti (giorno 0) | Richiede modulo nativo se non ancora wrappato | Richiede plugin se non ancora wrappato | Diretto (Kotlin/Swift interop) | Diretto |
| Aggiornamenti over-the-air senza review store | Sì, nativo (EAS Update) | Solo per asset/config, non per codice nativo compilato | No | No |
| Maturità ecosistema store publishing (build/submit automatizzati) | Alta (EAS Build/Submit) | Alta (Codemagic/Fastlane) | Media, richiede pipeline custom | Alta ma doppia (due toolchain) |

**Default per questo contesto**: React Native + Expo, New Architecture (Fabric + TurboModules) abilitata, TypeScript in modalità `strict`. Motivazione: riuso diretto di competenze e tipi TypeScript già presenti nello stack Next.js/Supabase, EAS copre build/submit/OTA senza dover mantenere Xcode/Android Studio come dipendenza hard, singolo operatore + agenti AI beneficiano di un solo linguaggio end-to-end (frontend web, mobile, e potenzialmente edge functions).

**Quando deviare dal default**:
- App con animazioni/canvas/game-like UI come core del prodotto → **Flutter**.
- App dove la business logic deve girare identica su mobile, desktop e backend con massima performance e tipizzazione forte, e la UI può essere leggermente diversa per piattaforma → **Kotlin Multiplatform** per il domain/data layer, UI nativa o Compose Multiplatform.
- App con requisiti hardware/SDK molto specifici disponibili solo nativamente al day zero (es. nuove API ARKit/Health) → **nativo puro**, accettando il costo di due codebase.

### Architettura canonica (Clean Architecture, feature-based)

Struttura a livelli, indipendente dal framework UI scelto. Il vincolo chiave: **il domain layer non importa mai nulla da React Native, Flutter o SDK nativi.** Deve essere testabile con un semplice test runner, senza montare un componente e senza rete.

```
app/
├── src/
│   ├── app/                     # entry point, provider globali, routing, DI container
│   ├── features/
│   │   └── <nome-feature>/
│   │       ├── domain/           # entità, use case, interfacce dei repository (no dipendenze esterne)
│   │       │   ├── entities/
│   │       │   ├── usecases/
│   │       │   └── repositories/ # SOLO interfacce (contratti)
│   │       ├── data/             # implementazione dei repository, mapper DTO<->entità
│   │       │   ├── datasources/  # remoto (Supabase client) e locale (storage/cache)
│   │       │   ├── repositories/ # implementazione concreta delle interfacce di domain/
│   │       │   └── mappers/
│   │       ├── presentation/     # screen, componenti, hook/viewmodel, navigazione locale
│   │       │   ├── screens/
│   │       │   ├── components/
│   │       │   └── hooks/
│   │       └── __tests__/
│   ├── shared/
│   │   ├── ui/                   # design system: componenti riusabili cross-feature
│   │   ├── config/                # config tipizzata letta da env, mai valori letterali altrove
│   │   ├── i18n/
│   │   └── types/                 # tipi condivisi, idealmente generati dallo schema Supabase
│   └── core/
│       ├── network/               # client HTTP/Supabase centralizzato, interceptor, retry policy
│       ├── storage/                # wrapper storage sicuro (Keychain/Keystore via expo-secure-store)
│       └── observability/          # logging, crash reporting, analytics — punto unico di accesso
├── app.config.ts                  # config Expo, legge da env, MAI valori hardcoded
├── eas.json                       # profili build (development/preview/production)
└── .env.example                   # documenta le variabili richieste, senza valori reali
```

Regole di dipendenza (violarle è un difetto architetturale, non uno stile):
- `presentation/` dipende da `domain/`, mai il contrario.
- `data/` implementa le interfacce definite in `domain/`, `domain/` non conosce `data/`.
- Nessun modulo in `features/X/` importa direttamente da `features/Y/internals` — la comunicazione tra feature passa da `shared/` o da eventi/contratti espliciti.
- Il DI (dependency injection) container in `app/` è l'unico posto che istanzia le implementazioni concrete e le inietta dietro le interfacce di dominio — questo è ciò che rende il domain layer testabile in isolamento e sostituibile (es. mock in test, implementazione reale in produzione) senza toccarne il codice.

### Gestione tipi condivisi col backend

Non ridefinire a mano i tipi delle tabelle Supabase nel client mobile: generarli (`supabase gen types typescript`) e pubblicarli come pacchetto interno condiviso tra web (Next.js) e mobile, dentro un monorepo (es. Turborepo/pnpm workspaces) se il progetto lo giustifica, o come pacchetto npm privato altrimenti. Questo elimina una classe intera di bug da hardcoding implicito (nomi di campo, enum, valori di stato duplicati e disallineati tra web e mobile).

### Design system

Prima di scrivere la prima schermata: definire token di design (colori, spaziature, tipografia, radius) in `shared/ui/tokens.ts`, non nei singoli componenti. Ogni componente in `shared/ui/` consuma i token, non valori inline. Questo è il meccanismo con cui si evita l'hardcoding visivo (es. `#FF0000` sparso nei componenti) e si garantisce coerenza cross-schermata e dark mode gratuita.

---

## CI/CD Pipeline

### Ambienti

Tre ambienti minimi, mai due (development e production senza uno staging intermedio):

| Ambiente | Bundle ID/Application ID | Backend | Distribuzione |
|---|---|---|---|
| Development | `com.agtechdesigne.<app>.dev` | Supabase progetto dev | Expo Dev Client / simulatore |
| Preview/Staging | `com.agtechdesigne.<app>.staging` | Supabase progetto staging | EAS Build interno, TestFlight interno / Play Internal Testing |
| Production | `com.agtechdesigne.<app>` | Supabase progetto produzione | Play Store / App Store |

Application ID diversi per ambiente = possibilità di installare dev/staging/prod sullo stesso device senza conflitti, e impossibilità strutturale di puntare per errore alla produzione da una build di test.

### Configurazione EAS (Expo Application Services)

`eas.json` definisce i profili build, ognuno collegato a un file env dedicato — mai variabili scritte nel JSON stesso:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": { "APP_ENV": "development" }
    },
    "staging": {
      "distribution": "internal",
      "env": { "APP_ENV": "staging" },
      "android": { "buildType": "apk" },
      "ios": { "simulator": false }
    },
    "production": {
      "autoIncrement": true,
      "env": { "APP_ENV": "production" }
    }
  },
  "submit": {
    "production": {}
  }
}
```

I valori sensibili veri (chiavi Supabase, chiavi terze parti) vivono in **EAS Secrets** (`eas secret:create`), mai committati, mai in `eas.json`. Il codice legge sempre da `process.env.*` esposto tramite `app.config.ts`, mai valori letterali.

### Pipeline GitHub Actions

Flusso minimo per ogni push su branch feature → merge su `main` → tag di release:

1. **Su ogni PR**: lint (`eslint`, `tsc --noEmit`), unit test, controllo che nessun secret sia stato committato (es. `gitleaks`).
2. **Su merge in `main`**: build `staging` via EAS, submit automatico a Play Internal Testing / TestFlight interno.
3. **Su tag `v*.*.*`**: build `production`, submit a Play Store (track `production`, rollout percentuale iniziale) e App Store Connect (submit per review).

Esempio di step chiave (workflow GitHub Actions, estratto):

```yaml
- name: Install dependencies
  run: pnpm install --frozen-lockfile

- name: Type check
  run: pnpm tsc --noEmit

- name: Lint
  run: pnpm eslint . --max-warnings=0

- name: Unit tests
  run: pnpm test -- --coverage

- name: Secret scan
  uses: gitleaks/gitleaks-action@v2

- name: EAS Build (production)
  if: startsWith(github.ref, 'refs/tags/v')
  run: eas build --platform all --profile production --non-interactive

- name: EAS Submit
  if: startsWith(github.ref, 'refs/tags/v')
  run: eas submit --platform all --profile production --non-interactive
```

Il `--max-warnings=0` sul linting non è arbitrario: impedisce che warning di code quality si accumulino silenziosamente — coerente col principio "zero hardcoding, zero scorciatoie" della skill.

### Fastlane per metadata e screenshot (quando serve automazione oltre EAS Submit)

EAS Submit copre l'upload della build. Per automatizzare anche testi, screenshot localizzati e metadata dello store (evitando di compilarli a mano ad ogni release), usare Fastlane in aggiunta:

- `fastlane deliver` (iOS) / `fastlane supply` (Android) per sincronizzare metadata da file versionati nel repo (`fastlane/metadata/`), non inseriti a mano nelle console.
- Screenshot generati automaticamente per i device richiesti dagli store (`fastlane snapshot` / `fastlane frameit`) partendo da script UI test, non caricati manualmente uno a uno.

Questo garantisce che i metadata dello store siano versionati, revisionabili in PR come il codice, e non un'operazione manuale non tracciata.

### Regola sui secrets

- Nessuna chiave, token o credenziale in file versionati (`.env` è in `.gitignore`, esiste solo `.env.example` con i nomi delle variabili e valori placeholder espliciti tipo `SUPABASE_URL=`).
- Le chiavi lato client (es. Supabase anon key) sono per definizione pubbliche una volta nella build — la sicurezza reale si ottiene con Row Level Security lato Supabase, non nascondendo la chiave. Le chiavi che devono restare segrete (es. API key di provider AI a pagamento) non vanno mai nel client mobile: passano da un endpoint backend/edge function che le tiene server-side.
- Rotazione chiavi documentata: chi ruota cosa, con quale cadenza, con quale impatto sulle build già pubblicate.

---

## Qualità, Sicurezza e Compliance

### Piramide di test

Rispettare le proporzioni, non scrivere solo test end-to-end (lenti, fragili) o solo unit test (non coprono l'integrazione reale con Supabase/navigazione).

- **Unit test (60-70% dei test)**: domain layer (use case) e mapper, senza rete, senza rendering. Framework: Jest.
- **Integration/component test (20-30%)**: data layer contro un'istanza Supabase locale/di test (non contro produzione), componenti UI con React Native Testing Library che verificano comportamento, non dettagli implementativi.
- **End-to-end (5-10%)**: flussi critici reali (onboarding, checkout, azione core del prodotto) su build reale, con Maestro o Detox, eseguiti in CI su ogni release candidate prima del submit allo store.

Un test che mocka la funzione che dovrebbe verificare non è un test: è un placeholder che passa sempre. Ogni test deve poter fallire se il comportamento reale si rompe.

### Checklist sicurezza

- **Storage sensibile**: token, credenziali, dati personali mai in `AsyncStorage` in chiaro. Usare `expo-secure-store` (Keychain su iOS, Keystore su Android).
- **Certificate pinning** per chiamate verso backend proprietari se il rischio MITM è rilevante per il dominio applicativo (es. fintech, dati sanitari); non necessario di default per ogni app.
- **Offuscamento/minificazione**: AGOS_Agent bytecode (già default su RN moderno) + ProGuard/R8 su Android in build di produzione; verificare che non vengano rimossi per "semplicità di debug" in produzione.
- **Permessi minimi**: richiedere solo i permessi effettivamente usati, con `usage description` specifica (obbligatoria su iOS, es. `NSCameraUsageDescription` deve spiegare perché, non essere generica) — richieste generiche o permessi non usati sono causa comune di rigetto in review Apple.
- **Deep link/Universal link**: validare sempre il contenuto ricevuto da un deep link come input non fidato, mai eseguire azioni privilegiate solo perché il link è arrivato dal formato atteso.
- **Dipendenze**: `npm audit`/`pnpm audit` in CI, aggiornamento programmato (non "quando si rompe qualcosa"), nessuna dipendenza non mantenuta da oltre 2 anni per funzionalità core.

### GDPR e AI Act (contesto normativo italiano/UE)

- **Consenso**: raccolta di consenso esplicito e granulare (analytics, marketing, AI processing) prima di qualunque trattamento non strettamente necessario al servizio, con possibilità di revoca altrettanto semplice dell'accettazione.
- **Data minimization**: raccogliere solo i dati personali necessari alla feature che li usa; ogni campo raccolto deve essere riconducibile a uno scopo dichiarato nella privacy policy.
- **Se l'app integra funzionalità AI generativa o decisionale rivolta a utenti UE**: verificare gli obblighi di trasparenza dell'AI Act (es. Art. 50 — obbligo di informare l'utente che sta interagendo con un sistema AI/che un contenuto è generato da AI) prima del rilascio, non come rimedio post-pubblicazione.
- **Diritto di cancellazione**: implementare un percorso reale di cancellazione account e dati (non solo disattivazione), verificabile end-to-end, non solo dichiarato in privacy policy.

### Requisiti store specifici (compliance di piattaforma)

**Google Play — Data Safety section**: la dichiarazione nella Play Console sui dati raccolti/condivisi deve corrispondere esattamente a ciò che il codice fa realmente (Google effettua controlli automatici e manuali; disallineamenti sono causa di rimozione, non solo di rigetto).

**Apple — Privacy Nutrition Labels + App Tracking Transparency**: se l'app traccia l'utente cross-app/cross-sito per pubblicità, è obbligatorio il prompt ATT nativo prima di qualunque tracciamento; le Nutrition Label devono riflettere ogni SDK terzo integrato (analytics, crash reporting, ads), non solo la raccolta dati diretta dell'app.

Entrambe le dichiarazioni vanno prodotte a partire da un audit reale delle chiamate di rete e degli SDK inclusi nella build, non compilate "a memoria".

### Accessibilità

Requisito di review (soprattutto Apple, Human Interface Guidelines) e requisito etico, non opzionale:

- Ogni elemento interattivo ha una label accessibile (`accessibilityLabel`), non solo un'icona senza testo alternativo.
- Contrasto colore minimo AA (WCAG) sul testo primario.
- Target touch minimo 44x44pt (iOS) / 48x48dp (Android).
- Navigazione completa con screen reader (VoiceOver/TalkBack) testata realmente sui flussi critici, non assunta funzionante perché si usano componenti "standard".

---

## Pubblicazione: Google Play Store e Apple App Store

### Google Play Console

#### Setup account e app
1. Account sviluppatore Google Play (costo una tantum a livello di organizzazione, non per app).
2. Creare l'app in Play Console con `Application ID` definitivo (**non cambiabile dopo la prima pubblicazione** — verificare prima del primo upload, non dopo).
3. Compilare Store Listing: titolo (max 30 caratteri), descrizione breve (80) e lunga (4000), screenshot per dimensione richiesta, icona 512x512, feature graphic 1024x500 — testi reali del prodotto, non lorem ipsum, anche in fase di prima submission a test interno.

#### Signing
- **Play App Signing obbligatorio** per nuove app: Google gestisce la chiave di firma di produzione, lo sviluppatore mantiene una upload key. La upload key va generata e conservata (password manager aziendale, mai nel repo) — la sua perdita senza backup impedisce futuri aggiornamenti dell'app.
- Con EAS: `eas credentials` gestisce la generazione e lo storage delle credenziali Android in modo tracciato, evitando keystore sparsi su filesystem locali non versionati né backuppati.

#### Formato e canali di rilascio
- **Android App Bundle (.aab)**, non `.apk`, è il formato richiesto per la pubblicazione su Play Store.
- Percorso di rilascio canonico: **Internal testing → Closed testing (alpha/beta) → Open testing → Production**. Non saltare da internal testing direttamente a production per un'app con utenti reali in gioco.
- **Staged rollout** in produzione: iniziare al 5-10%, monitorare crash rate e ANR (Application Not Responding) rate nella Play Console per 24-48h, incrementare solo se le metriche restano sotto soglia, prima di arrivare al 100%.

#### Review
Tempi tipici: poche ore fino a qualche giorno per prima submission o modifiche rilevanti a permessi/policy. Cause comuni di rigetto: Data Safety non coerente col comportamento reale, permessi non giustificati, funzionalità che rimanda a contenuti/pagamenti esterni al circuito Google Play in violazione delle policy sui pagamenti digitali.

### Apple App Store Connect

#### Setup account e app
1. Apple Developer Program (abbonamento annuale, individuale o organizzazione — organizzazione richiede D-U-N-S number, da richiedere con anticipo, i tempi di verifica non sono immediati).
2. Creare l'App ID (Bundle Identifier) in Certificates, Identifiers & Profiles — **anche questo non cambiabile dopo la prima submission**.
3. Creare la scheda app in App Store Connect: nome (univoco su tutto l'App Store, verificare disponibilità prima di affezionarsi a un nome), sottotitolo, descrizione, keyword, screenshot per ogni dimensione di device supportata.

#### Signing e certificati
- Certificato di distribuzione + provisioning profile di produzione. Con EAS, `eas credentials` automatizza generazione/rinnovo evitando la gestione manuale di Keychain/profili che è la causa più comune di build che falliscono "misteriosamente" al submit.
- Attenzione alla scadenza annuale dei certificati: pianificare rinnovo, non scoprirlo al momento di una release urgente.

#### TestFlight
- Build interne (fino a 100 tester, membri del team) disponibili quasi subito dopo l'upload, nessuna review richiesta.
- Build esterne (fino a 10.000 tester) richiedono una review (tipicamente più rapida della review completa) prima della prima distribuzione esterna.
- Usare TestFlight come gate obbligatorio prima di ogni submission a review pubblica, non solo per la prima release.

#### Review
Tempi tipici: 24-48h per la maggior parte delle submission, possono estendersi. Cause comuni di rigetto (App Review Guidelines):
- Metadata/funzionalità non corrispondenti a quanto mostrato negli screenshot.
- Permessi richiesti con `usage description` generica o non giustificata da una funzionalità visibile nella build.
- Login/registrazione senza opzione "Sign in with Apple" quando sono offerti altri login social (requisito esplicito, non opzionale se si offre Google/Facebook login).
- Placeholder, contenuti di test o funzionalità incomplete visibili nella build sottoposta a review.
- **Phased Release** disponibile anche su App Store (rollout automatico su 7 giorni con percentuali crescenti) — usarlo per release con cambi rilevanti, non necessario per hotfix minori urgenti.

### Versioning coordinato tra store

- `versionCode` (Android, intero, sempre crescente) e `CFBundleVersion`/build number (iOS) sono incrementati automaticamente da EAS (`autoIncrement: true` nel profilo build) — non gestiti a mano per evitare conflitti tra build parallele.
- `versionName` (Android) e `CFBundleShortVersionString` (iOS) seguono Semantic Versioning (`MAJOR.MINOR.PATCH`), coordinato con il tag Git che triggera la pipeline di release (vedi `cicd-pipeline.md`).

### Checklist pre-submission (entrambi gli store)

- [ ] Build testata su device reale (non solo simulatore/emulatore), sia Android che iOS
- [ ] Nessun contenuto placeholder, nessun dato finto visibile in nessuna schermata raggiungibile
- [ ] Privacy policy pubblicata su URL pubblico raggiungibile, coerente con Data Safety/Nutrition Labels dichiarati
- [ ] Flusso di cancellazione account presente se l'app permette la creazione di un account (requisito esplicito Apple dal 2022)
- [ ] Screenshot e testi store aggiornati alla versione reale della build, non a una versione precedente
- [ ] Credenziali di firma verificate presenti e backuppate prima dell'upload, non generate "al volo" alla prima submission

---

## Manutenzione, Monitoring e Layer AI

### Versioning e changelog

- Semantic Versioning (`MAJOR.MINOR.PATCH`) applicato con disciplina: `MAJOR` per breaking change di dati/API che richiedono migrazione, `MINOR` per feature nuove retrocompatibili, `PATCH` per fix.
- `CHANGELOG.md` versionato nel repo, aggiornato nella stessa PR che introduce il cambiamento — non ricostruito a memoria al momento del rilascio.
- Ogni release taggata (`vX.Y.Z`) è collegata a note di rilascio reali (cosa cambia, non "miglioramenti vari e correzioni di bug").

### Monitoring e crash reporting

- Crash reporting (es. Sentry) integrato dal primo rilascio interno, non aggiunto dopo il primo incidente in produzione.
- Metriche minime da monitorare per ogni release: crash-free session rate, ANR rate (Android), tempo di avvio a freddo, tasso di errore delle chiamate di rete critiche.
- Alerting su soglia (es. crash-free rate sotto il 99%) collegato a un canale reale monitorato (non solo una dashboard che nessuno apre) — nel contesto AgTechDesigne, un varco naturale è una notifica che arriva nel canale di reporting Notion/AntiGravity già in uso.
- Sourcemap/simboli di debug caricati automaticamente in CI ad ogni build di produzione, altrimenti i crash report in produzione arrivano illeggibili (stacktrace minificato/offuscato senza mapping).

### OTA update (Expo Update) — cosa può e cosa non può fare

- Un OTA update via EAS Update può aggiornare JS/asset senza passare dalla review dello store — utile per fix di logica applicativa, testi, contenuti.
- **Non può** aggiornare codice nativo (nuovi moduli nativi, cambi di permessi, cambio versione SDK) — questo richiede sempre una nuova build e submission allo store.
- Le policy di entrambi gli store vietano di usare gli OTA update per aggirare la review con cambi sostanziali di funzionalità non coperti dalla submission originale — uso previsto: bugfix e contenuti, non funzionalità nuove non revisionate.
- Canale di rollout separato da quello di build (staging/production channel distinti), con possibilità di rollback immediato a una versione precedente pubblicata se un OTA introduce una regressione.

### Politica di aggiornamento dipendenze

- Cadenza programmata (es. mensile) per aggiornamenti minori/patch, non "quando qualcosa si rompe".
- Aggiornamenti major (React Native, Expo SDK) pianificati come attività dedicata con branch separato e test di regressione completo prima del merge, mai fatti "di passaggio" dentro una PR di feature.
- Deprecazione di una versione minima di OS supportata (es. Android/iOS N-2) dichiarata esplicitamente e comunicata, non lasciata implicita finché qualcosa smette di funzionare.

### Integrazione del layer AI/agentico nell'app

Se l'app integra funzionalità AI (assistenti, generazione contenuti, ricerca semantica), applicare la stessa disciplina architetturale del resto dello stack, non trattarla come un'eccezione:

- **Nessuna chiave API di provider AI nel client mobile.** Ogni chiamata a un modello (Claude API o altri) passa da un endpoint backend/edge function proprietario che detiene la chiave server-side e applica rate limiting/autenticazione utente — coerente con quanto già stabilito per i secrets in `cicd-pipeline.md`.
- **Streaming e stato**: se la UI mostra risposte in streaming, il domain layer espone un contratto (interfaccia) indipendente dal trasporto reale (SSE, WebSocket) — così l'implementazione di trasporto è sostituibile senza toccare la UI, seguendo la stessa regola di dipendenza definita in `architettura-e-stack.md`.
- **On-device inference** (quando serve latenza minima o funzionamento offline): valutare ONNX Runtime Mobile o Core ML (iOS)/NNAPI (Android) solo per modelli realmente dimensionati per mobile — non tentare di eseguire on-device modelli pensati per inferenza server; per questo scopo il pattern coerente con lo stack AgTechDesigne resta l'inferenza via backend, con eventuale fallback locale leggero solo dove giustificato da un requisito reale (offline-first).
- **Trasparenza verso l'utente**: se una risposta o un contenuto è generato da AI, va segnalato esplicitamente nella UI (coerente con l'obbligo di trasparenza AI Act Art. 50 già presidiato in `qualita-sicurezza-compliance.md`), non presentato come contenuto redazionale umano.
- **Costo come vincolo di prodotto, non dettaglio implementativo**: ogni feature AI-powered ha un limite esplicito (rate limit per utente, budget massimo per sessione) definito in fase di design, non scoperto a runtime da una bolletta imprevista.