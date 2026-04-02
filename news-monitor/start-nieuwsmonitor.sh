#!/bin/bash
cd "$(dirname "$0")"
echo ""
echo "  ===================================="
echo "  HLN Nieuwsmonitor"
echo "  ===================================="
echo ""

# Check of Python geinstalleerd is
if command -v python3 &> /dev/null; then
    python3 server.py
elif command -v python &> /dev/null; then
    python server.py
else
    echo "  FOUT: Python is niet geinstalleerd."
    echo "  Download het op: https://python.org"
    echo ""
    read -p "  Druk op Enter om te sluiten..."
    exit 1
fi
