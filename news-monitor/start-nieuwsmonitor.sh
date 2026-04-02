#!/bin/bash
cd "$(dirname "$0")"
echo ""
echo "  ===================================="
echo "  HLN Nieuwsmonitor"
echo "  ===================================="
echo ""

# Check of Node.js geinstalleerd is
if ! command -v node &> /dev/null; then
    echo "  FOUT: Node.js is niet geinstalleerd."
    echo "  Download het op: https://nodejs.org"
    echo ""
    read -p "  Druk op Enter om te sluiten..."
    exit 1
fi

# Installeer dependencies als dat nog niet gebeurd is
if [ ! -d "node_modules" ]; then
    echo "  Dependencies installeren..."
    npm install
    echo ""
fi

echo "  Server starten op http://localhost:3000"
echo "  Druk Ctrl+C om te stoppen."
echo ""

# Open browser automatisch na 2 seconden
(sleep 2 && open "http://localhost:3000" 2>/dev/null || xdg-open "http://localhost:3000" 2>/dev/null) &

npm start
