# Dati mancanti

Ogni segnaposto `[DA FORNIRE: …]` presente nel sito o nel CMS, dove si trova e chi lo deve fornire. Il sito mostra questi segnaposto come testo semplice, senza trasformarli in link.

## Nel CMS (si correggono dallo Studio)

| Dato | Dove si trova nello Studio | Chi lo fornisce |
|---|---|---|
| Email pubblica di Irene | Contatti → Email da mostrare sul sito | Irene |
| Indirizzo del profilo Instagram | Contatti → Profilo Instagram | Irene |
| Ritratto di Irene (ora un'immagine grigia "Ritratto da sostituire") | Chi sono → Ritratto | Irene |
| Due o tre frasi su come lavora Irene, da quanto fotografa, zona | Chi sono → Testo (secondo paragrafo) | Irene |
| Conferma o riscrittura della presentazione breve e del resto del testo di Chi sono (testo provvisorio) | Chi sono → Presentazione breve, Testo | Irene |
| Informativa privacy | Privacy → Testo | Davide / Irene (testo legale) |
| Conferma dei titoli e dei testi brevi degli album | Album → ogni album | Irene |
| Luogo degli album Cata e Alice, Elisa, No Border Village, Boxe | Album → Luogo | Irene |
| Testi alternativi delle singole foto degli album (ora si usa "Titolo, foto N di M") | Album → Foto → matita | Irene (facoltativo) |

## Fuori dal CMS

| Dato | Dove serve | Chi lo fornisce |
|---|---|---|
| Indirizzo che riceve i messaggi del form | variabile d'ambiente `CONTATTI_DESTINATARIO` (al deploy) | Irene / Davide |
| Chiavi Turnstile vere e servizio email | variabili d'ambiente al deploy | Davide |
| Dominio definitivo | CORS di Sanity, sitemap, deploy | Davide |
| Zona di lavoro di Irene (Friuli Venezia Giulia da confermare) | testi, descrizione per i motori di ricerca | Irene |
| Foto vere per le categorie Persone, Animali, Eventi (le cartelle contengono solo segnaposto o sono vuote) | nuovi album | Irene |
| Elisa: originali ad alta risoluzione delle foto n. 1, 2, 3, 5, 10 (ora 1000–1500 px) | album Elisa | Irene |
