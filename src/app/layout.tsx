import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Matrice del Destino AI — Analisi Numerologica & Archetipica dei 22 Arcani',
  description: 'Calcola la tua Matrice del Destino, esplora la Griglia Pitagorica e dialoga con l\'assistente AI per scoprire i tuoi talenti, la coda karmica e il tuo scopo di vita con sintesi vocale neurale.',
  keywords: ['matrice del destino', 'numerologia', '22 arcani', 'tarocchi archetipici', 'griglia pitagorica', 'karma'],
  openGraph: {
    title: 'Matrice del Destino AI — Mappa Archetipica dei 22 Arcani',
    description: 'Calcola la tua mappa energetica completa e ascolta il tuo report personalizzato con la voce neurale AI.',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className="dark">
      <body className="bg-background text-slate-100 min-h-screen flex flex-col antialiased selection:bg-gold/30 selection:text-gold-light">
        {children}
      </body>
    </html>
  );
}
