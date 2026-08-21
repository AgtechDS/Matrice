# 🌌 Matrice del Destino — Sacred Oracle (STATUS_APP)

> **Ultimo Aggiornamento**: 2026-08-21  
> **Versione**: 3.0.0 (Production Custom Domain matricedestino.it, Google AdSense, Supabase Cloud Auth & Stripe Live)  
> **Stato Globale**: 🟢 **OPERATIVO & IN PRODUZIONE (100%)**

---

## 📊 Panoramica del Sistema

| Proprietà | Dettaglio / Valore |
| :--- | :--- |
| **Applicazione** | Matrice del Destino — Oracolo Archetipico & Numerologia Sacra |
| **Dominio di Produzione** | **`https://www.matricedestino.it`** *(Apex `https://matricedestino.it` con redirect 308 su `www`)* |
| **Hosting & CDN** | Vercel Edge Serverless + Register.it DNS autoritativo (`76.76.21.21` / `cname.vercel-dns.com`) |
| **SSL / HTTPS** | Let's Encrypt Wildcard Certificate (Attivo & Convalidato) |
| **UI/UX Design** | MIT-Grade Neumorfismo 2.0, Deep Obsidian Dark Mode, Responsive Mobile/Tablet |
| **Icone & Branding** | Suite completa `favicon_io` (`favicon.ico`, `apple-touch-icon`, `site.webmanifest`, PNG multi-risoluzione) |
| **Guided Onboarding** | Tour interattivo a 5 step con **Spotlight Dorato Pulsante** e **Guida Vocale Neurale** |
| **Ambiente Locale** | `http://localhost:3000` (Node.js Native HTTP Server) |
| **Database & Auth** | **Supabase Postgres (EU West 1)** con Row Level Security (RLS) & Google OAuth 2.0 |
| **Fornitore LLM** | **LLMAPI.ai** (`deepseek-v4-flash-0731`) con prompt oracolari specializzati per tema |
| **Sintesi Vocale TTS** | Google Gemini 3.1 Flash Neural Audio (Voce `Aoede` & `Puck`) |
| **Monetizzazione** | Stripe Checkout (1.99€ Pass 5 / 4.49€ Mappa Maestra 15) + Google AdSense Rewarded Ads (`ca-pub-7028010056444247`) |
| **Conformità Legale** | **GDPR (Reg. UE 2016/679)**, **EU AI Act 2026 (Reg. UE 2024/1689 Art. 50)**, Google Consent Mode v2, Diritto all'Oblio |

---

## 📡 Mappa degli Endpoint API

| Endpoint | Metodo | Descrizione | Runtime |
| :--- | :---: | :--- | :---: |
| `/` | `GET` | Dashboard Web (Geometria Sacra, Griglia 3×3, Oroscopo, Chat Markdown) | Static CDN |
| `/ads.txt` | `GET` | Record autorizzato Google AdSense (`pub-7028010056444247`) | Edge Route (`/api/ads-txt`) |
| `/robots.txt` | `GET` | Policy di scansione per Googlebot, Mediapartners-Google e AdsBot | Edge Route (`/api/robots`) |
| `/sitemap.xml` | `GET` | Sitemap XML per indicizzazione Google Search Console | Edge Route (`/api/sitemap`) |
| `/api/chat` | `POST` | Streaming Server-Sent Events (SSE) con `deepseek-v4-flash-0731` | Server / Serverless |
| `/api/tts` | `POST` | Sintesi neurale Gemini Flash + conversione buffer PCM $\rightarrow$ WAV 24kHz | Server / Serverless |
| `/api/config` | `GET` | Parametri di configurazione runtime e prompt di sistema | Server / Serverless |
| `/api/create-checkout-session` | `POST` | Inizializzazione sessioni di pagamento Stripe Checkout | Server / Serverless |
| `/api/test-connection` | `POST` | Test di connettività e latenza per provider AI | Server / Serverless |

---

## 🔯 Moduli Oracolari Specializzati

1. **Oroscopo del Giorno & della Settimana**: Previsione astrologica e numerologica calibrata sul Segno Solare e Ascendente esatto.
2. **Focus Canale Amore & Relazioni**: Analisi del codice dell'amore, partner karmico e guarigione delle ferite emotive (Nodi D ed E).
3. **Focus Canale Denaro & Prosperità**: Sblocco del karma finanziario, professioni vocazionali e strategie di abbondanza (Nodi C ed E).
4. **Master Report dei 4 Pinnacoli & 4 Sfide**: Mappatura delle 4 età evolutive e proiezione decennale con calcolo dell'Anno Personale.
5. **Sinastria di Coppia**: Matrice congiunta tra due soggetti con calcolo delle energie di connessione spirituale e di coppia.
6. **Report Completo a 14 Sezioni**: Trattato integrale archetipico con esportazione Markdown e PDF per la stampa.

---

## 📁 Registro delle Tabelle Supabase (Database Cloud)

| Tabella | Chiave Primaria | Descrizione |
| :--- | :--- | :--- |
| `public.user_matrix_wallets` | `user_id` (UUID) | Saldo crediti consulti, storico acquisti, referral code e conteggio inviti |
| `public.user_matrix_profiles` | `id` (UUID) | Dati anagrafici salvati (Nome, Data, Ora, Luogo di nascita, Tipo analisi) |
| `public.user_matrix_consultations` | `id` (UUID) | Storico delle sessioni di lettura generate e messaggi oracolari |

---

## 🚀 Istruzioni di Deploy e Verifica

### Verifica Live in Produzione:
```bash
curl -I https://www.matricedestino.it
curl -I https://www.matricedestino.it/ads.txt
curl -I https://www.matricedestino.it/robots.txt
curl -I https://www.matricedestino.it/sitemap.xml
```

### Avvio Locale:
```bash
node server.js
```
Accedere a: `http://localhost:3000`
