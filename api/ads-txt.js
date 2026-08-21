export default function handler(req, res) {
    const content = 'google.com, pub-7028010056444247, DIRECT, f08c47fec0942fa0\n';
    if (res && typeof res.setHeader === 'function') {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.status(200).send(content);
    } else {
        return new Response(content, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'public, max-age=86400'
            }
        });
    }
}
