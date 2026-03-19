# Stepway — Webová aplikácia

Bakalárska práca

**Autor:** Oliynyk Viktoriia
**Univerzita:** Univerzita Konštantína Filozofa v Nitre
**Fakulta:** Fakulta prírodných vied a informatiky

---

## O projekte

Stepway je webová aplikácia elektronického obchodu so športovou obuvou. Aplikácia umožňuje prezeranie produktov, filtrovanie podľa pohlavia, vyhľadávanie, správu košíka, pridávanie do obľúbených a zobrazenie informácií o značkách z databázy DBpedia. Používatelia sa môžu registrovať, prihlásiť a sledovať históriu svojich objednávok.

## Technológie

**Frontend:** Vue 3, Vite, Pinia, Vue Router, Tailwind CSS

**Backend:** Node.js, Express, MySQL, JWT, bcrypt

**Externé dáta:** DBpedia (SPARQL)

---

## Požiadavky

- Node.js v18+
- MySQL / XAMPP

---

## Inštalácia a spustenie

### 1. Klonovanie repozitára

```sh
git clone https://github.com/your-username/bakalarska_praca.git
cd bakalarska_praca
```

### 2. Inštalácia závislostí frontendu

```sh
npm install
```

### 3. Inštalácia závislostí backendu

```sh
cd server
npm install
```

### 4. Nastavenie databázy

Spustite XAMPP a zapnite službu **MySQL**.

Vytvorte databázu:
```sql
CREATE DATABASE sneaker_eshop;
```

### 5. Nastavenie premenných prostredia

V priečinku `server/` vytvorte súbor `.env`:

```
JWT_SECRET=sneaker_eshop_secret_key
DB_PASSWORD=
```

### 6. Spustenie backendu

```sh
cd server
node index.js
```

Backend beží na `http://localhost:3001`

### 7. Spustenie frontendu

```sh
npm run dev
```

Frontend beží na `http://localhost:5173`

---


## Zdroje

- Obrázky produktov: [sizeer.sk](https://sizeer.sk)
- Bannery: [Designed by BiZkettE1 / Freepik](http://www.freepik.com)