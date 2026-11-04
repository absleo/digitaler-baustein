# AGENT.md

## Projektziel

Dieses Projekt ist kein klassisches Webportal, sondern eine vollautomatische Digital-Signage-Anzeige für den Eingangsbereich der HTL Leonding.

Die Anwendung läuft auf einem dauerhaft aktiven Großdisplay im Kiosk-Modus und wird von Schüler:innen, Lehrkräften sowie Besucher:innen im Vorbeigehen wahrgenommen.

Es erfolgt keinerlei aktive Bedienung.

---

# Grundsätze

## Keine Interaktion

Der Bildschirm darf niemals Benutzerinteraktionen voraussetzen.

Nicht verwenden:

- Buttons
- Menüs
- Mouse-Hover als primäres Bedienkonzept
- Touch-Gesten
- Pager
- Slider mit Navigation
- Klickbare Logos

Das System muss vollständig autonom funktionieren.

Alle Übergänge und Inhaltswechsel erfolgen automatisch.

---

# Design-Richtung

## Modernes Digital-Signage-System

Optik:

- hochwertig
- professionell
- ruhig
- modern
- kontraststark

Nicht gewünscht:

- blinkende Elemente
- hektische Animationen
- Werbebanner-Stil
- klassische Webseitenoptik

Die Anwendung soll eher wie ein Messe-Screen oder eine Premium-Infowall wirken.

---

# Dark Mode Pflicht

Das gesamte Design basiert auf einem dunklen Layout.

Farben:

- Hintergrund nahezu schwarz (#0B0B0B bis #121212)
- dezente Grautöne
- starke Kontraste für Logos
- Akzentfarbe nur sparsam einsetzen

Ziel:

- OLED/LCD schonen
- hohe Aufmerksamkeit für Sponsor-Inhalte
- Bilder und Videos wirken deutlich hochwertiger

---

# Sponsoren-Stufen

## Diamond Member

Aktuell:

- 8 Firmen

Besitzen höchste Priorität.

Diamond-Mitglieder müssen nahezu permanent sichtbar sein.

Diese Firmen finanzieren die Plattform und sollen deshalb deutlich bevorzugt dargestellt werden.

Mögliche Inhalte:

- Logo
- Firmenname
- Poster/Bilder
- Videos

Videos:

- maximal 60 Sekunden
- automatische Wiedergabe
- Ton standardmäßig deaktiviert

---

## Gold Member

Aktuell:

- 44 Firmen

Mögliche Inhalte:

- Logo
- Firmenname

Keine Bilder.
Keine Videos.

Gold-Mitglieder dienen primär zur Sichtbarkeit des Unternehmens.

---

# Datenmodell

Die bestehende JSON-Struktur in der JavaScript-Datei soll erhalten bleiben.

Neue Felder dürfen ergänzt werden.

Bestehende Felder dürfen nach Möglichkeit nicht verändert werden.

Bereits vorhandene Daten müssen weiterhin kompatibel bleiben.

Abwärtskompatibilität hat hohe Priorität.

---

# Anzeigenlogik

## Dauerhafte Präsenz der Diamond-Mitglieder

Alle 8 Diamond-Mitglieder sollen ständig oder nahezu ständig auf dem Bildschirm sichtbar sein.

Es darf nicht passieren, dass ein Diamond-Mitglied über längere Zeit gar nicht sichtbar ist.

Ziel:

Jeder Beobachter soll innerhalb weniger Sekunden erkennen können, welche Firmen Diamond-Mitglieder sind.

---

## Spotlight-Bereich

Der größte Bereich des Bildschirms gehört dem sogenannten Spotlight.

Dort wird immer genau ein Diamond-Mitglied hervorgehoben.

Angezeigt werden:

- Poster
- Video
- Logo (nur als Fallback, siehe unten)

Falls Poster und/oder Video vorhanden sind:

- es wird immer eines davon angezeigt, nie das reine Logo
- zufällige Auswahl
- gleichmäßige Verteilung
- keine unmittelbaren Wiederholungen

Falls ein Diamond-Mitglied weder Poster noch Video hat:

- das Logo wird im Spotlight angezeigt
- das Logo vergrößert sich während der Anzeige langsam und leicht per Zoom (Dynamik/Bewegung)

Beschriftung im Spotlight:

- kein Firmenname als Text (das Logo reicht, sonst doppelt)
- nur der Schriftzug "Diamond Partner", gut lesbar und deutlich größer als ein Nebentext

---

## Medien-Rotation

Poster:

- 10 bis 20 Sekunden sichtbar

Videos:

- immer vollständig bis zum Ende abspielen
- erst danach auf die nächste Firma wechseln
- Abbruch nur bei Fehler oder echtem Stillstand

Anschließend:

- automatischer Wechsel zur nächsten Präsentation

---

## Layout

Kein statischer Header (keine Überschrift, kein Titel):

- Spotlight und Diamond-Bereich beginnen ganz oben mit minimalem Randabstand
- der gewonnene Platz gehört Spotlight und Diamond
- Gold-Reihe liegt unten mit deutlichem Abstand zum Diamond-Bereich

Bereichsüberschriften (z. B. "Diamond", "Gold"):

- Markierungspunkte sind vertikal mittig zur Textzeile ausgerichtet

Anschließend:

- automatischer Wechsel zur nächsten Präsentation

---

## Priorisierung

Anzeigehäufigkeit:

1. Diamond Spotlight
2. Diamond Logos
3. Gold Logos

Diamond-Inhalte müssen deutlich häufiger sichtbar sein als Gold-Mitglieder.

---

# Gold-Bereich

Gold-Mitglieder sollen gesammelt dargestellt werden.

Geeignete Darstellungsformen:

- endlos laufende Logo-Wall
- horizontale Marquee
- Grid mit automatischer Rotation
- animierte Logo-Wolke

Wichtig:

Alle Gold-Logos liegen auf dunklen Boxen, keine weißen Hintergründe.
Sehr dunkle Logos ohne eigenen Hintergrund werden aufgehellt, damit sie lesbar bleiben.

Die Darstellung darf nicht unruhig wirken.

Der Fokus des Bildschirms bleibt immer auf dem Spotlight-Bereich.

---

# Animationen

Bevorzugt:

- Fade
- leichte Skalierung
- langsame Bewegung
- sanfte Übergänge

Vermeiden:

- Springen
- hektische Rotation
- starke Zooms
- schnelle Bewegungen

Animationsziel:

Premium statt Werbung.

---

# Burn-In Schutz

Da der Bildschirm dauerhaft betrieben wird:

- leichte Positionsverschiebungen über längere Zeit
- subtile Bewegungen statischer Elemente
- keine dauerhaft unveränderten Logos

Die Bewegung muss nahezu unmerklich sein.

---

# Performance

Die Anwendung muss dauerhaft ohne Eingriff laufen können.

Anforderungen:

- Speicherverbrauch stabil
- keine Memory-Leaks
- Videos werden sauber freigegeben
- Bilder werden effizient geladen
- Offline-Betrieb möglich

---

# Responsive Verhalten

Optimiert für:

- 16:9 Displays
- Full-HD
- 4K

Die Anwendung wird hauptsächlich auf großen Bildschirmen verwendet.

Smartphone-Optimierung ist nicht erforderlich.

---

# Zielwirkung

Beim Vorbeigehen soll innerhalb von 3 Sekunden erkennbar sein:

1. Hier präsentieren sich Partnerunternehmen der HTL Leonding.
2. Die Diamond-Mitglieder sind Premium-Partner.
3. Aktuell wird ein Unternehmen hervorgehoben.
4. Die Präsentation läuft vollständig automatisch.

Der Gesamteindruck soll hochwertig, technisch modern und repräsentativ wirken.