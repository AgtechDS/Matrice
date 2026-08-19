# PRAGMATISM & ANTI-OVERENGINEERING GUARDRAILS (P0 MANDATORY)

> Questo documento stabilisce le guardrail vincolanti per impedire l'applicazione di soluzioni complesse o costose (fine-tuning, parser custom, refactoring sproporzionati) a problemi risolvibili a costo zero tramite System Prompting, RAG o strumenti nativi.

---

## 🛡️ GUARDRAIL 1: IL FILTER DI RAGIONEVOLEZZA (OCCAM'S RAZOR GATE)

Prima di avviare qualsiasi task che coinvolga:
- Fine-tuning / Training di LLM
- Scrittura di parser/script custom > 100 righe
- Refactoring architetturali massivi su 5+ file
- Creazione di motori custom in luogo di librerie standard

L'agente DEVE eseguire e stampare il seguente **Audit di Pragmatismo**:

```markdown
### 📋 PRAGMATISM AUDIT CHECKLIST
1. **Zero-Cost Alternative:** Può essere risolto col 95%+ dell'efficacia tramite Master System Prompt, RAG o Tool Nativo? (SÌ / NO)
2. **Maintenance Penalty:** Qual è il costo di aggiornamento se cambiano i requisiti? (1 secondo per il Prompt vs Ore per il Code/Training)
3. **Proof of Failure:** Esiste una prova empirica che la soluzione a costo zero ha FALLITO prima di passare a quella complessa? (SÌ / NO)
```

---

## 🛡️ GUARDRAIL 2: MATRICE DECISIONALE OBBLIGATORIA

| Caso d'Uso | Soluzione Obbligatoria (Default) | Soluzione Vietata senza ADR |
| :--- | :--- | :--- |
| **Routing Agenti & Governance** | **Master System Prompt** in Ollama / IDE | ❌ Fine-Tuning SFT |
| **Formattazione JSON / contratti API** | **Structured Output / JSON Schema / Prompting** | ❌ Fine-Tuning o Parser Regex custom |
| **Accesso a Documenti / Codice Progetto** | **RAG / Tool File Viewing Nativo** | ❌ Embedding o Training continuativo |
| **Nuovo Linguaggio Proprietario / DSL** | Fine-Tuning SFT (Previo Audit) | - |

---

## 🛡️ GUARDRAIL 3: PROTOCOLLO ANTI-SYCOPHANCY (CHALLENGE BEFORE COMPLY)

1. **Divieto di Assecondamento Cieco:** L'AI non deve mai limitarsi a "debuggare la soluzione complessa" se l'architettura sottostante è sbagliata o sproporzionata.
2. **Obbligo di Proposta Alternativa:** L'agente DEVE fermarsi ed esporre prima:
   - **Opzione A (Pragmatica / Zero-Cost):** Master System Prompt / Tool nativo.
   - **Opzione B (Richiesta / Complessa):** Training / Codice custom con analisi dei rischi e costi.

---

## 🛡️ GUARDRAIL 4: ARCHITECTURE DECISION RECORD (ADR) OBBLIGATORIO

Nessun training LLM o refactoring strutturale pesante può iniziare se non viene prima creato un file ADR in `.agent/adr/ADR_XXXX_description.md` che giustifica perché la soluzione a costo zero non è sufficiente.
