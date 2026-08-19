// Vercel Serverless / Node Edge Handler for Stripe Checkout Session
export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const stripeKey = process.env.STRIPE_SECRET_KEY;
        if (!stripeKey) {
            return res.status(500).json({ error: 'STRIPE_SECRET_KEY is not configured on the server.' });
        }

        let body = {};
        if (typeof req.body === 'string') {
            try { body = JSON.parse(req.body); } catch (e) { body = {}; }
        } else if (req.body) {
            body = req.body;
        }

        const plan = body.plan || 'pass_5';
        const origin = req.headers.origin || req.headers.referer || 'https://matrice-agtechds.vercel.app';
        const cleanOrigin = origin.replace(/\/$/, '');

        let name = 'Pass Arcano — 5 Consulti Matrice del Destino';
        let desc = 'Include 5 Consulti Completi a 14 sezioni, Download PDF e Sintesi Vocale Neurale HD';
        let amount = 199; // 1.99€ in cents
        let credits = 5;

        if (plan === 'pass_15') {
            name = 'Mappa Maestra — 15 Consulti Matrice del Destino';
            desc = 'Include 15 Consulti Completi, Sinastria di Coppia, Download PDF e Voce Neurale';
            amount = 449; // 4.49€ in cents
            credits = 15;
        } else if (plan === 'single') {
            name = 'Consulto Singolo Arcano';
            desc = 'Include 1 Consulto Completo + Voce Neurale Gemini';
            amount = 99; // 0.99€ in cents
            credits = 1;
        }

        const params = new URLSearchParams();
        params.append('payment_method_types[0]', 'card');
        params.append('mode', 'payment');
        params.append('line_items[0][price_data][currency]', 'eur');
        params.append('line_items[0][price_data][unit_amount]', String(amount));
        params.append('line_items[0][price_data][product_data][name]', name);
        params.append('line_items[0][price_data][product_data][description]', desc);
        params.append('line_items[0][quantity]', '1');
        params.append('success_url', `${cleanOrigin}/?payment=success&credits=${credits}&plan=${plan}&session_id={CHECKOUT_SESSION_ID}`);
        params.append('cancel_url', `${cleanOrigin}/?payment=cancel`);
        params.append('metadata[plan]', plan);
        params.append('metadata[credits]', String(credits));

        const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${stripeKey}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });

        const data = await stripeRes.json();
        if (!stripeRes.ok) {
            console.error('Stripe API error:', data);
            return res.status(stripeRes.status).json({ error: data.error?.message || 'Stripe error' });
        }

        return res.status(200).json({
            url: data.url,
            id: data.id
        });
    } catch (err) {
        console.error('Checkout error:', err);
        return res.status(500).json({ error: err.message });
    }
}
