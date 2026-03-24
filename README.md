# cacheCalc

Calculadora de cachê da BeatFellas, ajustada para funcionar como PWA.

## Como executar

Use um servidor HTTP local (service worker nao funciona com `file://`).

Exemplo com Python:

```bash
python3 -m http.server 8080
```

Depois acesse:

```text
http://localhost:8080
```

## Recursos PWA

- Manifesto em `manifest.webmanifest`
- Service Worker em `sw.js`
- Cache de app shell e cache de runtime
- Fallback para `index.html` em navegacoes offline
