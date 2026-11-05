# KeyFlow

Ein bewusst schlanker Python-Tipptrainer für deutsche QWERTZ-Tastaturen.

**Demo:** [tarik-g.github.io/typing-trainer](https://tarik-g.github.io/typing-trainer/)

## Funktionen

- Python-Code mit direkter Zeichen- und Fehleranzeige tippen
- Live-Werte für WPM, Genauigkeit, Zeit und Fortschritt
- QWERTZ-Bildschirmtastatur mit Finger- und Handführung
- Analyse schwacher Zeichen, Bigramme, Hände und Finger
- Personalisierte Übungen auf Basis der eigenen Schwachstellen
- Eigene Texte oder Codebeispiele einfügen
- Bestleistung, Streak, WPM-Ziel und kompakter Fortschrittsverlauf
- Helles TypeQuicker-inspiriertes Design und dunkles Tokyo-Night-Design
- Installierbar und offline nutzbar als Progressive Web App

## Speicherverhalten

Die öffentliche GitHub-Demo speichert Daten ausschließlich in `sessionStorage`. Ein Neuladen behält die aktuelle Sitzung, aber nach dem Schließen des Tabs startet die Demo frisch.

Im installierten PWA-Modus nutzt KeyFlow `localStorage`. Fortschritt, Statistiken, Ziel und Theme bleiben dadurch dauerhaft auf dem Gerät erhalten. Es gibt kein Konto, keine Cloud und kein Tracking.

## Lokal starten

Jeder einfache statische Webserver funktioniert, zum Beispiel:

```bash
python -m http.server 4173
```

Danach `http://localhost:4173` öffnen.

## Prüfen

```bash
npm test
```

Die App hat keine Laufzeit-Abhängigkeiten und keinen Build-Schritt. Jeder Push auf `main` wird über GitHub Actions zu GitHub Pages veröffentlicht.
