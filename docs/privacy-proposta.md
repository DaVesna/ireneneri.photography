# Privacy — proposta di modifiche

Proposta dell'8 novembre 2026 sul testo caricato nel CMS lo stesso giorno. **Non è ancora applicata**: il testo nello Studio è quello originale. Le modifiche servono ad allineare l'informativa a come funziona davvero il sito.

> Nota: sono proposte di un non giurista, basate su come è costruito il sito. Per un testo legale definitivo conviene una rilettura da parte di un professionista.

## In breve

| # | Dove | Problema | Proposta |
|---|---|---|---|
| 1 | Sezione 2 | Dominio `ireneneri.photography.net`, da confermare | Usare il dominio definitivo |
| 2 | Sezione 3 | Dice che non ci sono moduli, ma c'è il modulo contatti | Togliere "moduli" dalla frase e rimandare alla sezione 10 |
| 3 | Sezione 5 | Cloudflare Web Analytics non è attivo | Variante A: attivarlo (piccola modifica tecnica). Variante B: togliere la sezione |
| 4 | Sezione 6 | Non cita la verifica anti-spam del modulo | Aggiungere una frase su Turnstile |
| 5 | Sezione 10 | Parla solo di email | Estenderla al modulo: dati raccolti, Turnstile, limite di invii, conservazione |
| 6 | Modulo, casella finale | Chiede il "consenso al trattamento", ma la base giuridica indicata in sezione 10 non è il consenso | Trasformarla in "ho letto l'informativa" |

---

## 1. Sezione 2 — Titolare del trattamento

**Testo attuale**

> Sito web: ireneneri.photography.net

**Testo proposto**

> Sito web: [dominio definitivo, per esempio ireneneri.photography]

Lo stesso dominio va poi impostato nel sito (`SITO_URL`), su Cloudflare e nelle origini CORS di Sanity.

## 2. Sezione 3 — Finalità del sito e dati di navigazione

**Testo attuale**

> Non prevede registrazioni, creazione di account, iscrizioni a newsletter o moduli per la raccolta diretta di dati personali.

**Testo proposto**

> Non prevede registrazioni, creazione di account o iscrizioni a newsletter. L'unico modo per inviare dati personali attraverso il sito è il modulo di contatto, descritto nella sezione 10.

## 3. Sezione 5 — Statistiche di navigazione

### Variante A — tenere la sezione e attivare Cloudflare Web Analytics

Il testo della sezione 5 resta com'è. Lato tecnico, al deploy:

1. attivare Web Analytics dal pannello Cloudflare per il dominio del sito;
2. aggiungere alla Content-Security-Policy `https://static.cloudflareinsights.com` in `script-src` e `https://cloudflareinsights.com` in `connect-src` (file `web/src/lib/intestazioni.js` e `web/public/_headers`), altrimenti il browser blocca lo script delle statistiche.

### Variante B — togliere le statistiche

- Eliminare la sezione 5 e rinumerare le successive (6 → 5, …, 13 → 12; aggiornare anche il rimando "sezione 10" della sezione 3).
- Nella sezione 6, eliminare la frase: "Cloudflare Web Analytics non richiede l'installazione di cookie statistici sui dispositivi dei visitatori."

## 4. Sezione 6 — Cookie e strumenti di tracciamento

**Aggiungere, dopo la frase sui cookie tecnici di Cloudflare:**

> La pagina Contatti utilizza Cloudflare Turnstile, un servizio di verifica che distingue le persone dai programmi automatici per proteggere il modulo da messaggi indesiderati. Turnstile tratta dati tecnici del dispositivo e del browser, tra cui l'indirizzo IP, esclusivamente per questa verifica e non per finalità pubblicitarie o di profilazione. Il servizio viene caricato solo nella pagina Contatti.

## 5. Sezione 10 — Comunicazioni tramite modulo di contatto ed email

**Titolo proposto:** "10. Comunicazioni tramite modulo di contatto ed email"

**Testo proposto (sostituisce l'intera sezione)**

> Il sito mette a disposizione due modi per contattare l'autrice: il modulo presente nella pagina Contatti e il seguente indirizzo email: ireneneri.photography@gmail.com.
>
> **Modulo di contatto.** Il modulo raccoglie il nome, l'indirizzo email, il tipo di richiesta e il testo del messaggio. Tutti i campi sono necessari per poter rispondere. I dati inseriti vengono trasmessi all'indirizzo email dell'autrice sotto forma di messaggio di posta elettronica e non vengono salvati in un archivio del sito.
>
> Per proteggere il modulo da invii automatici, il sito utilizza Cloudflare Turnstile (vedi sezione 6) e limita il numero di messaggi che possono essere inviati in poco tempo dallo stesso indirizzo IP. A questo scopo l'indirizzo IP viene trattato temporaneamente e non viene conservato oltre il tempo necessario al controllo.
>
> **Email.** Gli utenti possono anche scrivere direttamente all'indirizzo indicato. L'invio di un'email comporta il trattamento dell'indirizzo del mittente e delle informazioni contenute nel messaggio.
>
> In entrambi i casi i dati vengono trattati esclusivamente per gestire la richiesta e fornire una risposta. La base giuridica del trattamento è, a seconda della natura della comunicazione, il legittimo interesse alla gestione delle richieste ricevute oppure l'esecuzione di misure precontrattuali richieste dall'interessato (art. 6, par. 1, lett. f) e b), del GDPR).
>
> Il servizio di posta elettronica utilizzato è Gmail, fornito da Google. I messaggi sono conservati per il periodo necessario alla gestione delle comunicazioni, salvo eventuali ulteriori esigenze di conservazione previste dalla legge o necessarie alla tutela dei diritti.
>
> Gli indirizzi email ricevuti non vengono utilizzati per newsletter o comunicazioni pubblicitarie non richieste.

Due note tecniche su questa sezione:

- La frase "trasmessi all'indirizzo email dell'autrice" vale quando al deploy sarà collegato il servizio email: oggi, in sviluppo, il messaggio finisce solo nel log del server. Se si sceglie Cloudflare Email Routing (consigliato in `docs/deploy.md`), il messaggio passa da Cloudflare prima di arrivare a Gmail: Cloudflare è già citata in sezione 4.
- Il testo è coerente con come il sito tratta i dati oggi: il modulo non salva nulla in archivio e il limite di invii conserva l'indirizzo IP solo per pochi minuti.

## 6. Casella in fondo al modulo contatti

**Testo attuale nel sito**

> Ho letto l'informativa privacy e acconsento al trattamento dei dati per ricevere una risposta.

**Testo proposto**

> Ho letto l'informativa privacy.

Motivo: la sezione 10 indica come base giuridica il legittimo interesse o le misure precontrattuali, non il consenso. Chiedere un "consenso" che poi non è la base del trattamento crea confusione. La casella resta obbligatoria come presa visione. È un'etichetta del sito: la cambio io nel codice, insieme al messaggio d'errore collegato ("Per inviare il messaggio conferma di aver letto l'informativa privacy.").

## Cosa serve per applicare

1. Il dominio definitivo.
2. La scelta tra variante A (attivare le statistiche) e variante B (toglierle).
3. Il via libera al testo: poi aggiorno la privacy nello Studio, la casella del modulo e, se serve, la CSP.
