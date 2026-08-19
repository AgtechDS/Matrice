async function check() {
    try {
        const res = await fetch('http://127.0.0.1:3000/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: 'Andrea, la tua matrice del destino e pronta.' })
        });
        console.log('Status:', res.status, 'Type:', res.headers.get('content-type'));
        const buf = await res.arrayBuffer();
        console.log('Received audio bytes:', buf.byteLength);
    } catch(e) {
        console.error('Error:', e);
    }
}
check();
