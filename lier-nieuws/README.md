# Lier Nieuws Radar

Nieuwslead-finder voor HLN regiojournalisten. Scrapt lokale bronnen in Lier en gebruikt AI om nieuwswaardige leads te identificeren.

## Setup

```bash
cd lier-nieuws
pip install -r requirements.txt
```

Maak een `.env` bestand aan (kopieer van `.env.example`):

```bash
cp .env.example .env
```

Vul je Anthropic API key in:

```
ANTHROPIC_API_KEY=sk-ant-...
```

## Starten

```bash
python app.py
```

Open http://localhost:5000 in je browser.

## Gebruik

1. Klik **"Ga op zoek naar nieuws"** om alle bronnen te scrapen
2. De AI filtert en selecteert nieuwswaardige leads
3. Leads verschijnen als kaartjes op het bulletin board
4. Via **"Bronnen beheren"** kun je bronnen toevoegen, verwijderen of in/uitschakelen
