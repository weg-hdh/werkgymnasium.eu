#!/bin/bash

set -e

# Commit-Nachricht setzen oder Standard verwenden
COMMIT_MSG="${1:-'init commit'}"

echo "WARNUNG: Dieses Skript löscht alle bisherigen Commits und ersetzt sie durch einen neuen!"
read -p "Möchtest du fortfahren? (ja/nein): " CONFIRM

if [[ "$CONFIRM" != "ja" ]]; then
    echo "Abgebrochen."
    exit 1
fi

# Aktuellen Branchnamen sichern
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Neuen, leeren Branch ohne Historie erstellen
git checkout --orphan temp-clean

# Alle Dateien zum Commit hinzufügen
git add -A
git commit -m "$COMMIT_MSG"

# Alten Branch löschen (nachdem wir von ihm weg sind)
git branch -D "$CURRENT_BRANCH"

# Den neuen Branch auf den alten Namen umbenennen
git branch -m "$CURRENT_BRANCH"

# Force-Push zur Remote (falls verbunden)
echo "Force-Push wird vorbereitet:"
git remote -v
read -p "Möchtest du den neuen Commit jetzt pushen (force)? (ja/nein): " PUSH_CONFIRM

if [[ "$PUSH_CONFIRM" == "ja" ]]; then
    git push -f origin "$CURRENT_BRANCH"
    echo "Force-Push abgeschlossen."
else
    echo "Kein Push durchgeführt. Lokale Historie ist aber jetzt bereinigt."
fi
