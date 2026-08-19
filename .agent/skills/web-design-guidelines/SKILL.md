---
name: web-design-guidelines
description: Standard di Web Design Neumorfismo 2.0 Avanzato & Branding Palette AGOS. Da applicare obbligatoriamente a qualsiasi grafica, interfaccia, UI/UX o componente frontend generato.
metadata:
  author: AgTechDesigne
  version: "2.0.0"
  argument-hint: <file-or-pattern>
---

# 🧊 Skill: Neumorphism 2.0 Avanzato & Branding Palette AGOS

**Versione 2.0 — Parametrica, Accessibile, Generabile per Agenti AI**

Questa skill definisce le regole formali, i token cromatici ed il sistema di Neumorfismo 2.0 che l'AI agent DEVE applicare e salvare per **qualsiasi grafica e design frontend** creato nel progetto.

---

## 🖼️ 1. Asset di Branding & Favicon (`favicon_io`)

Tutti i design web e le applicazioni frontend devono integrare gli asset grafici e di branding situati in:
`E:\Agtechdesigne\Progetti\agentcode\favicon_io`

### Asset Disponibili
- `favicon.ico` (Favicon radice)
- `favicon-16x16.png` & `favicon-32x32.png` (Icone browser standard)
- `apple-touch-icon.png` (Apple iOS touch icon)
- `android-chrome-192x192.png` & `android-chrome-512x512.png` (Android Chrome & PWA)
- `site.webmanifest` (Manifest per PWA e branding mobile)

### HTML Head Injection Standard (Includere Sempre)
```html
<link rel="icon" type="image/x-icon" href="/favicon_io/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon_io/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon_io/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/favicon_io/apple-touch-icon.png">
<link rel="manifest" href="/favicon_io/site.webmanifest">
```

---

## 🎨 2. Palette Branding Ufficiale (Coolors `045916662565626`)

Gli 8 colori principali della palette con la loro scala completa da 50 a 950:

### 2.1 Pale Sky (`D1ECF6` / Primary Cyan-Sky)
```json
"pale-sky": {
  "50": "#eaf6fb",
  "100": "#d4edf7",
  "200": "#aadcee",
  "300": "#7fcae6",
  "400": "#55b9dd",
  "500": "#2aa7d5",
  "600": "#2286aa",
  "700": "#196480",
  "800": "#114355",
  "900": "#08212b",
  "950": "#06171e"
}
```

### 2.2 Tea Green (`C5FFB9` / Accent Green)
```json
"tea-green": {
  "50": "#eaffe5",
  "100": "#d5ffcc",
  "200": "#aaff99",
  "300": "#80ff66",
  "400": "#55ff33",
  "500": "#2bff00",
  "600": "#22cc00",
  "700": "#1a9900",
  "800": "#116600",
  "900": "#093300",
  "950": "#062400"
}
```

### 2.3 Baltic Blue (`035e7b` / Deep Corporate Blue)
```json
"baltic-blue": {
  "50": "#e6f8fe",
  "100": "#cdf2fe",
  "200": "#9ce4fc",
  "300": "#6ad7fb",
  "400": "#38c9fa",
  "500": "#06bcf9",
  "600": "#0596c7",
  "700": "#047195",
  "800": "#034b63",
  "900": "#012632",
  "950": "#011a23"
}
```

### 2.4 Soft Periwinkle (`A396EA` / Modern Lavender)
```json
"soft-periwinkle": {
  "50": "#eceafb",
  "100": "#dad4f7",
  "200": "#b4aaee",
  "300": "#8f7fe6",
  "400": "#6955dd",
  "500": "#442ad5",
  "600": "#3622aa",
  "700": "#291980",
  "800": "#1b1155",
  "900": "#0e082b",
  "950": "#09061e"
}
```

### 2.5 Sunflower Gold (`F7BD50` / Warning & Warm Gold)
```json
"sunflower-gold": {
  "50": "#fef6e7",
  "100": "#fdecce",
  "200": "#fada9e",
  "300": "#f8c76d",
  "400": "#f6b53c",
  "500": "#f4a20b",
  "600": "#c38209",
  "700": "#926107",
  "800": "#614105",
  "900": "#312002",
  "950": "#221702"
}
```

### 2.6 Cotton Candy (`FB9CAF` / Soft Coral Pink)
```json
"cotton-candy": {
  "50": "#fee7eb",
  "100": "#fdced7",
  "200": "#fb9db0",
  "300": "#f96c88",
  "400": "#f73b61",
  "500": "#f50a39",
  "600": "#c4082e",
  "700": "#930622",
  "800": "#620417",
  "900": "#31020b",
  "950": "#220108"
}
```

### 2.7 Fresh Sky (`3EB2FB` / Vibrant Action Sky Blue)
```json
"fresh-sky": {
  "50": "#e6f5fe",
  "100": "#cdebfe",
  "200": "#9bd7fd",
  "300": "#69c4fc",
  "400": "#37b0fb",
  "500": "#059cfa",
  "600": "#047dc8",
  "700": "#035e96",
  "800": "#023e64",
  "900": "#011f32",
  "950": "#011623"
}
```

---

## 🧊 3. Token Fondamentali Neumorfismo

| Token | Tipo | Descrizione | Default Branding |
|-------|------|-------------|------------------|
| `bg` | colore HSL | Sfondo principale neumorfico | `hsl(200, 30%, 94%)` (`#eaf6fb` / Pale Sky 50) |
| `radius` | px/rem | Arrotondamento globale | `24px` |
| `depth` | numero (1-3) | Intensità della profondità | `2` |
| `accent` | colore HSL | Colore primario per stati attivi | `hsl(200, 95%, 50%)` (`#3EB2FB` / Fresh Sky 400) |
| `textDark` | colore HSL | Testo principale su sfondo chiaro | `hsl(200, 60%, 10%)` (`#08212b` / Pale Sky 900) |
| `textLight` | colore HSL | Testo su superficie scura/attiva | `hsl(0, 0%, 100%)` |
| `type` | enum | `soft`, `ghost`, `toggle`, `card` | `soft` |

---

## 📐 4. Calcolo Automatico delle Ombre (Fisica della Luce)

L'agente genera i valori in base a `bg` e `depth`.

```python
def derive_shadow_colors(bg_hsl, depth):
    # bg_hsl: (H, S, L) con L ≈ 85-95 per sfondi chiari
    dark_lightness = bg_hsl[2] - 12 - (depth * 4)   # Ombra scura
    light_lightness = bg_hsl[2] + 8 + (depth * 3)   # Luce chiara
    
    shadow_dark = f"hsl({bg_hsl[0]}, {max(0, bg_hsl[1]-10)}%, {max(0, dark_lightness)}%)"
    shadow_light = f"hsl({bg_hsl[0]}, {max(0, bg_hsl[1]-20)}%, {min(100, light_lightness)}%)"
    
    return shadow_dark, shadow_light
```

### Offset e Sfocatura Dinamici
- `blur = depth * 12px`
- `spread = depth * (-2px)`
- Offset ombra scura: `(depth * 6px, depth * 6px)`
- Offset luce chiara: `(-depth * 6px, -depth * 6px)`

---

## ♿ 5. Regole di Accessibilità WCAG 2.1 AA

- **Dimensione Testo**: Se il testo è `< 16px` (o `< 14px` bold) è **VIETATO** l'uso del Neumorphism per lo sfondo del testo. Applicare solo a contenitori oppure alzare il peso del font a `600` e contrasto minimo `4.5:1`.
- **Stati Attivi (`:active`, `:checked`)**: Lo sfondo diventa `accent` e il testo interno usa `textLight` con contrasto garantito.
- **Fallback Semantico**: Se l'utente attiva `prefers-reduced-motion` o `high-contrast`, aggiungere un bordo sottile `1px solid rgba(13, 67, 85, 0.15)`.

---

## 🧩 6. Template CSS Neumorfico Pronto all'Uso

```css
:root {
  /* Branding Palettes */
  --color-pale-sky-50: #eaf6fb;
  --color-pale-sky-900: #08212b;
  --color-fresh-sky-500: #059cfa;
  --color-baltic-blue-800: #034b63;
  --color-tea-green-200: #aaff99;
  
  /* Neumorphic Calculated Tokens */
  --neu-bg: #eaf6fb;
  --neu-shadow-dark: #b8dbe8;
  --neu-shadow-light: #ffffff;
  --neu-radius: 24px;
}

/* Card Neumorfica Esterna (Convesse) */
.neu-card {
  background: var(--neu-bg);
  border-radius: var(--neu-radius);
  box-shadow: 
    8px 8px 16px var(--neu-shadow-dark),
    -8px -8px 16px var(--neu-shadow-light);
  border: 1px solid rgba(255, 255, 255, 0.6);
  color: var(--color-pale-sky-900);
  transition: all 0.25s ease-in-out;
}

/* Interattività Active / Pressed (Concave) */
.neu-card:active, .neu-button:active {
  box-shadow: 
    inset 6px 6px 12px var(--neu-shadow-dark),
    inset -6px -6px 12px var(--neu-shadow-light);
  transform: scale(0.98);
}

/* Toggle Switch Neumorfico */
.neu-toggle-track {
  background: var(--neu-bg);
  box-shadow: 
    inset 4px 4px 8px var(--neu-shadow-dark),
    inset -4px -4px 8px var(--neu-shadow-light);
  border-radius: 50px;
}

.neu-toggle-track.checked {
  background: var(--color-fresh-sky-500);
}
```

---

## 🌳 7. Albero Decisionale per l'Agente Frontend

1. **L'elemento è una CTA primaria?**  
   $\rightarrow$ **NO Neumorphism incavato**. Usare colore pieno accent (`fresh-sky-500`) con ombra morbida rialzata.
2. **L'elemento contiene testo < 14px?**  
   $\rightarrow$ Nessuna depressione dello sfondo, solo ombre esterne soffici.
3. **Lo sfondo circostante è scuro ($L < 40$)?**  
   $\rightarrow$ Attivare **Dark Neumorphism** (inversione ombre: ombra scura `#06171e`, luce `#114355`).
4. **Dimensione elemento interattivo?**  
   $\rightarrow$ Sempre $\ge 44 \times 44\text{px}$.

---

## 📌 8. Istruzioni per l'Agente per Tutti i Nuovi Progetti Frontend

Ogni volta che l'agente crea o aggiorna file HTML, CSS, React o Next.js:
1. Collega le favicon dalla cartella `/favicon_io/`.
2. Applica i token della palette cromatici `pale-sky`, `tea-green`, `baltic-blue`, `soft-periwinkle`, `sunflower-gold`, `cotton-candy`, `fresh-sky`.
3. Applica lo stile **Neumorphism 2.0** su card, container, pannelli, input e toggle switch.
