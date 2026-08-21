export default function handler(req, res) {
    const content = `User-agent: *
Allow: /

User-agent: Mediapartners-Google
Allow: /

User-agent: Google-adstxt
Allow: /

User-agent: AdsBot-Google
Allow: /

User-agent: Googlebot
Allow: /

Sitemap: https://matrice-jade.vercel.app/sitemap.xml
`;

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
