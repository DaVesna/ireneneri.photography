# Dati mancanti

Ogni dato segnaposto, dove si trova e chi lo deve fornire. Nel CMS i segnaposto hanno la forma `[DA FORNIRE: …]`; il sito li mostra come testo semplice (non diventano link). Aggiornato al 2026-11-07.

## Nel CMS (si correggono dallo Studio, vedi `docs/guida-irene.md`)

| Dato | Dove si trova nello Studio | Chi lo fornisce |
|---|---|---|
| Email pubblica di Irene | Contatti → Email da mostrare sul sito (`[DA FORNIRE: email pubblica di Irene]`) | Irene |
| Indirizzo del profilo Instagram | Contatti → Profilo Instagram (`[DA FORNIRE: indirizzo del profilo Instagram]`) | Irene |
| Ritratto di Irene (ora un'immagine grigia "Ritratto da sostituire") | Chi sono → Ritratto | Irene |
| Due o tre frasi su come lavora, da quanto fotografa, in quale zona | Chi sono → Testo, secondo paragrafo (`[DA FORNIRE: …]`) | Irene |
| Conferma o riscrittura del resto di Chi sono e della presentazione breve (testo provvisorio basato solo sugli album) | Chi sono → Presentazione breve, Testo | Irene |
| Informativa privacy del modulo contatti | Privacy → Testo (`[DA FORNIRE: informativa privacy]`) | Davide con Irene (testo legale) |
| Conferma dei titoli e dei testi brevi dei 7 album (scritti da provini e date EXIF) | Album → ogni album | Irene |
| Luogo degli album Cata e Alice, Elisa, No Border Village, Boxe (lasciato vuoto: non risulta dalle cartelle) | Album → Luogo | Irene |
| Nome completo della palestra per Mika e Piero (ora "WTA", come la cartella) | Album Mika e Piero → Luogo | Irene |
| Testi alternativi delle singole foto (ora il sito usa "Titolo, foto N di M") | Album → Foto → clic sulla foto | Irene (facoltativo) |
| Frase sotto le foto di benvenuto (lasciata vuota di proposito) | Home → Frase sotto le foto | Irene (facoltativo) |

## Fuori dal CMS

| Dato | Dove serve | Chi lo fornisce |
|---|---|---|
| Dominio definitivo (oggi si assume `ireneneri.photography`) | `SITO_URL` al build (sitemap, link canonici), Turnstile, CORS, Email Routing | Davide |
| Indirizzo dello Studio pubblicato | fondo di `docs/guida-irene.md` (`[DA FORNIRE: indirizzo dello Studio dopo il deploy]`) | Davide, dopo `sanity deploy` |
| Indirizzo che riceve i messaggi del modulo e mittente | segreti `CONTATTI_DESTINATARIO`, `CONTATTI_MITTENTE` | Irene / Davide |
| Chiavi Turnstile vere | `PUBLIC_TURNSTILE_SITE_KEY` (build), segreto `TURNSTILE_SECRET_KEY` | Davide |
| Scelta e configurazione del servizio email (consigliato Cloudflare Email Routing) | `docs/deploy.md`, sezione 2 | Davide |
| Zona di lavoro di Irene (Friuli Venezia Giulia, da confermare) | testi di Chi sono, descrizione per i motori di ricerca (Impostazioni) | Irene |
| Foto vere per Persone, Animali, Eventi (le cartelle contengono solo immagini segnaposto o sono vuote) | nuovi album dallo Studio | Irene |
| Elisa: originali ad alta risoluzione delle foto n. 1, 2, 3, 5, 10 (ora 1000–1500 px, morbide a tutto schermo) | album Elisa (sostituire le foto) | Irene |
| Verifica in due passaggi sull'account Google di Irene | prima dell'invito nello Studio | Irene |
