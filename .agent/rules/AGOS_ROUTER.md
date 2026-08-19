---
trigger: always_on
---

# AGOS Federation Protocol (Dynamic Skill Loading)

Questo progetto è governato dal framework AGOS. Le regole aziendali di comportamento, le skill MIT-Grade a 13 sezioni e i parametri di configurazione risiedono nella directory `/.agenti/`.

## Regola di Routing Dinamico (Anti-Context-Bloat)

NON caricare tutte le skill aziendali nella memoria di lavoro. Carica SOLO la skill necessaria per il task corrente seguendo questo mapping:

1. **Se il task involve logica backend, API, o DB:**
   - Leggi e applica rigorosamente: `agenti/ai-backend-dev/skill.md`
   - Rispetta le soglie in: `agenti/ai-backend-dev/config.yaml`
2. **Se il task involve UI, React, o CSS:**
   - Leggi e applica rigorosamente: `agenti/ai-frontend-dev/skill.md`
   - Rispetta le soglie in: `agenti/ai-frontend-dev/config.yaml`
3. **Se il task involve infrastruttura, Docker, CI/CD, o deploy:**
   - Leggi e applica rigorosamente: `agenti/ai-devops-infra/skill.md`
4. **Se il task involve pianificazione, scomposizione task o routing:**
   - Assumi il puro ruolo di: `agenti/ai-orchestrator/skill.md`
5. **Se rilevi un'anomalia matematica, un loop o un rischio critico:**
   - Invoca la logica formale di: `agenti/ai-kernel-scientist/skill.md`
6. **Se il task involve testing, QA, o validazione:**
   - Leggi e applica rigorosamente: `agenti/ai-qa-testing/skill.md`

## Regola di Output Schema & Integrità Proof-of-Execution

1. Quando un agente aziendale viene attivato, il suo output DEVE rispettare il contratto JSON Schema definito nella sezione 4 della sua `skill.md` o nel suo file `output_schema.yaml`. Nessuna eccezione.
2. **Proof-of-Execution (Anti-Simulazione):** È severamente proibito a qualsiasi agente simulare l'esecuzione di tool, database o modelli di inferenza. Ogni risposta deve derivare da evidenze reali verificate (`exit code == 0` e log raw). Se un comando fallisce, l'agente deve restituire lo stato d'errore autentico.
3. **Pragmatic Architectural Gate (Anti-Sycophancy):** Prima di avviare workflow complessi o ad alto costo manutentivo, l'agente orchestratore DEVE valutare l'esistenza di un'alternativa a zero-codice / System Prompting. Se l'alternativa è più efficace o ha minore debito tecnico, è obbligatorio proporre l'opzione pragmatica prima di procedere con l'esecuzione.


