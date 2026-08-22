/**
 * API Client per la comunicazione con il server e streaming TokenRouter
 */

class ApiClient {
    constructor() {
        this.abortController = null;
    }

    async getConfig() {
        try {
            const res = await fetch('/api/config');
            if (!res.ok) throw new Error('Impossibile recuperare la configurazione');
            return await res.json();
        } catch (e) {
            console.error('Config fetch error:', e);
            return null;
        }
    }

    async testConnection(apiKey, model, baseUrl = '') {
        try {
            const res = await fetch('/api/test-connection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apiKey, model, baseUrl })
            });
            const data = await res.json();
            return data;
        } catch (e) {
            return { success: false, error: { message: e.message } };
        }
    }

    cancelStream() {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    }

    formatErrorMessage(rawError) {
        let msg = '';
        if (typeof rawError === 'string') {
            try {
                const parsed = JSON.parse(rawError);
                return this.formatErrorMessage(parsed);
            } catch (e) {
                msg = rawError;
            }
        } else if (rawError && typeof rawError === 'object') {
            if (rawError.error) {
                return this.formatErrorMessage(rawError.error);
            }
            if (rawError.message) {
                msg = rawError.message;
            } else {
                msg = JSON.stringify(rawError);
            }
        } else {
            msg = String(rawError || 'Errore sconosciuto');
        }

        if (msg.includes('insufficient_user_quota') || msg.includes('quota') || msg.includes('credit limit') || msg.includes('＄0.00') || msg.includes('recharge')) {
            return `**Quota Fornitore Esaurita (Saldo $0.00)**\n\nIl fornitore ha risposto con codice **HTTP 403**: *'User credit limit is insufficient (balance: $0.000000)'*.\n\nLa chiave API specificata non ha crediti. Puoi utilizzare un provider gratuito come **Groq Cloud** o **OpenRouter** dalle Impostazioni.`;
        }
        return msg;
    }

    async sendChatStream({ messages, temperature = 0.7, apiKey = '', model = '', baseUrl = '', onChunk, onReasoning, onDone, onError }) {
        this.cancelStream();
        this.abortController = new AbortController();

        try {
            const bodyPayload = {
                messages,
                temperature,
                stream: true
            };
            if (apiKey) bodyPayload.apiKey = apiKey;
            if (model) bodyPayload.model = model;
            if (baseUrl) bodyPayload.baseUrl = baseUrl;

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyPayload),
                signal: this.abortController.signal
            });

            if (!response.ok) {
                const errData = await response.json().catch(async () => ({ error: await response.text() }));
                const formatted = this.formatErrorMessage(errData.error || errData);
                throw new Error(formatted);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';
            let fullText = '';
            let reasoningText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || trimmed.startsWith(':')) continue;

                    if (trimmed === 'data: [DONE]') {
                        continue;
                    }

                    if (trimmed.startsWith('data: ')) {
                        const jsonStr = trimmed.slice(6);
                        try {
                            const parsed = JSON.parse(jsonStr);
                            if (parsed.error) {
                                throw new Error(this.formatErrorMessage(parsed.error));
                            }
                            const delta = parsed.choices?.[0]?.delta;
                            if (delta) {
                                const reasoning = delta.reasoning_content || delta.reasoning || '';
                                if (reasoning) {
                                    reasoningText += reasoning;
                                    if (onReasoning) onReasoning(reasoning, reasoningText);
                                }
                                if (delta.content) {
                                    fullText += delta.content;
                                    if (onChunk) onChunk(delta.content, fullText);
                                }
                            }
                        } catch (err) {
                            if (err.message.includes('Quota') || err.message.includes('TokenRouter')) {
                                throw err;
                            }
                        }
                    }
                }
            }

            if (onDone) onDone(fullText, reasoningText);
            return { fullText, reasoningText };
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Stream annullato dall\'utente');
            } else {
                console.error('Stream error:', error);
                if (onError) onError(error);
            }
        } finally {
            this.abortController = null;
        }
    }

    async generateArcanaImage({ prompt, arcanaNumber, arcanaName, archetype }) {
        try {
            const googleKey = localStorage.getItem('google_tts_api_key') || '';
            const res = await fetch('/api/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    arcanaNumber,
                    arcanaName,
                    archetype,
                    apiKey: googleKey
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.message || 'Errore nella generazione dell\'immagine');
            return data;
        } catch (e) {
            console.error('generateArcanaImage error:', e);
            throw e;
        }
    }
}

window.apiClient = new ApiClient();
