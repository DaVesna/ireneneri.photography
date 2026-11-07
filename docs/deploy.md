# Deploy

Solo istruzioni: in questa fase non si esegue nessun deploy. Versione completa in M11.

## Origini CORS da aggiungere su Sanity

Oggi c'è solo `http://localhost:3333` (Studio in locale). Al deploy aggiungere, da sanity.io/manage → progetto → API → CORS origins, oppure da PowerShell nella cartella `studio`:

| Origine | Credenziali | Perché |
|---|---|---|
| `https://<nome>.sanity.studio` (se lo Studio viene pubblicato con `sanity deploy`) | sì | lo Studio ospitato da Sanity |
| `https://ireneneri.photography` e `https://www.ireneneri.photography` (dominio da confermare) | no | solo se in futuro il sito leggerà Sanity dal browser (anteprime, rendering su richiesta); con le pagine statiche non serve |

```powershell
cd studio
npx sanity cors add https://<nome>.sanity.studio --credentials
```
