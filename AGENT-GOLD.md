# AGENT-GOLD.md

## Projektziel

Dieses Projekt ist der zweite Werbe-Screen des Digitalen Bausteins.

Im Gegensatz zum Diamond-Screen liegt der Fokus hier auf der Präsentation von Werbeplakaten möglichst vieler Partnerunternehmen gleichzeitig.

Die Anwendung läuft auf einem dauerhaft aktiven Display innerhalb der HTL Leonding und wird von Schüler:innen, Lehrkräften sowie Besucher:innen im Vorbeigehen wahrgenommen.

Es erfolgt keinerlei Benutzerinteraktion.

Alle Inhalte wechseln vollständig automatisiert.

---

# Grundsätze

## Keine Interaktion

Der Bildschirm darf niemals Benutzerinteraktionen voraussetzen.

Nicht verwenden:

- Buttons
- Menüs
- Navigationselemente
- Maussteuerung
- Touch-Gesten
- Tastatureingaben
- Klickbare Logos

Das System läuft vollständig autonom.

---

# Design-Richtung

## Digitale Poster-Galerie

Der Screen soll wie eine moderne digitale Werbefläche wirken.

Optik:

- hochwertig
- professionell
- ruhig
- modern
- plakativ

Nicht gewünscht:

- klassische Webseitenoptik
- Werbebanner-Stil
- hektische Bewegungen
- blinkende Elemente
- aggressive Animationen

Der Eindruck soll an digitale Messe-Displays oder moderne Unternehmensfoyers erinnern.

---

# Dark Mode Pflicht

Das gesamte Design basiert auf einem dunklen Layout.

Farben:

- Hintergrund nahezu schwarz (#0B0B0B bis #121212)
- dunkle Flächen
- dezente Trennlinien
- hohe Kontraste für Werbematerial

Ziele:

- Displayschonung
- moderne Optik
- maximale Wirkung der Poster

---

# Sponsoren

## Diamond Member

Aktuell:

- 8 Firmen

Diamond-Mitglieder dürfen Werbeposter bereitstellen.

Diamond-Mitglieder erhalten eine höhere Sichtbarkeit innerhalb der Rotation.

Existieren mehrere Poster, werden diese ebenfalls rotiert.

---

## Gold Member

Aktuell:

- 44 Firmen

Gold-Mitglieder dürfen ebenfalls Werbeposter bereitstellen.

Es werden ausschließlich Bilder verwendet.

Videos werden auf diesem Screen nicht abgespielt.

---

# Datenmodell

Die bestehende JavaScript-Datenstruktur muss erhalten bleiben.

Neue Felder dürfen ergänzt werden.

Vorhandene Felder sollen nach Möglichkeit nicht verändert werden.

Abwärtskompatibilität besitzt hohe Priorität.

---

# Hauptlayout

## 2x2 Poster-Wall

Der Bildschirm besteht aus vier gleich großen Werbeflächen.

Beispiel:

+-------------------+-------------------+
|                   |                   |
|     Poster A      |     Poster B      |
|                   |                   |
+-------------------+-------------------+
|                   |                   |
|     Poster C      |     Poster D      |
|                   |                   |
+-------------------+-------------------+

Es werden gleichzeitig vier Werbemotive angezeigt.

Der Fokus liegt auf guter Lesbarkeit und ausreichend großen Postern.

Alle Kacheln besitzen dieselbe Größe.

---

# Darstellung der Poster

## Poster

Falls ein Unternehmen Werbeposter hinterlegt hat:

- möglichst groß darstellen
- Format möglichst erhalten
- keine Verzerrungen
- hochwertige Skalierung

Empfohlen:

- object-fit: cover
- leichte Ken-Burns-Effekte
- langsame Zoombewegung

---

## Branding-Fallback

Falls kein Poster vorhanden ist:

Automatisch generierte Sponsor-Kachel.

Inhalt:

- Firmenlogo
- Firmenname
- Diamond Partner oder Gold Partner Kennzeichnung

Optional:

- Firmenfarbe als Hintergrundakzent
- dezenter Glow
- leichte Hintergrundanimation

Leere Kacheln sind niemals erlaubt.

---

# Sichtbarkeitsregeln

## Keine Doppelungen

Ein Unternehmen darf niemals mehrfach gleichzeitig sichtbar sein.

Das gilt auch dann, wenn mehrere Poster vorhanden sind.

Bevor ein Unternehmen erneut angezeigt wird, sollen zunächst möglichst viele andere Unternehmen präsentiert werden.

---

## Priorisierung

Anzeigehäufigkeit:

1. Diamond Poster
2. Gold Poster
3. Branding-Fallbacks

Diamond-Mitglieder sollen häufiger erscheinen.

Empfehlung:

- Diamond Gewichtung: 3
- Gold Gewichtung: 1

Dadurch bleiben Premium-Sponsoren deutlich präsenter sichtbar.

---

# Diagonale Rotation

Die Poster-Wall besteht dauerhaft aus vier Kacheln.

Es werden niemals alle vier Kacheln gleichzeitig ersetzt.

Stattdessen werden immer zwei Kacheln gleichzeitig ausgetauscht.

Dabei wird stets eine komplette Diagonale ersetzt.

## Diagonale A

[0][0] und [1][1]

+-------------------+-------------------+
|         X         |                   |
|      [0][0]       |      [0][1]       |
|                   |                   |
+-------------------+-------------------+
|                   |         X         |
|      [1][0]       |      [1][1]       |
|                   |                   |
+-------------------+-------------------+

## Diagonale B

[0][1] und [1][0]

+-------------------+-------------------+
|                   |         X         |
|      [0][0]       |      [0][1]       |
|                   |                   |
+-------------------+-------------------+
|         X         |                   |
|      [1][0]       |      [1][1]       |
|                   |                   |
+-------------------+-------------------+

---

# Wechselintervall

Empfehlung:

- alle 8 bis 15 Sekunden
- Austausch von exakt zwei Kacheln
- immer diagonal
- sanfte Fade- oder Crossfade-Transition

Der gesamte Bildschirm darf niemals gleichzeitig wechseln.

Mindestens zwei Werbemotive bleiben ständig sichtbar.

---

# Animationen

Bevorzugt:

- Fade-In
- Fade-Out
- Crossfade
- langsame Skalierung
- leichter Ken-Burns-Effekt

Nicht verwenden:

- Rotation
- Flip-Effekte
- hektische Zooms
- Springen
- schnelle Bewegungen

Animationsziel:

Premium statt Werbung.

---

# Burn-In Schutz

Da der Bildschirm dauerhaft betrieben wird:

- leichte Bewegungen innerhalb der Poster
- minimale Positionsänderungen
- langsame Zoom-Effekte

Statische Inhalte sollen niemals stundenlang exakt an derselben Position verbleiben.

Die Animationen müssen dabei unauffällig bleiben.

---

# Performance

Die Anwendung läuft dauerhaft ohne Benutzerinteraktion.

Anforderungen:

- stabiler Speicherverbrauch
- keine Memory-Leaks
- effizientes Bild-Preloading
- saubere Freigabe alter Ressourcen
- Offline-Betrieb möglich
- langfristig stabiler Dauerbetrieb

---

# Responsive Verhalten

Optimiert für:

- 16:9 Displays
- Full-HD
- 4K

Die Anwendung wird primär auf Großbildschirmen betrieben.

Smartphone-Optimierung ist nicht erforderlich.

---

# Zielwirkung

Beim Vorbeigehen soll innerhalb weniger Sekunden erkennbar sein:

1. Zahlreiche Unternehmen unterstützen die HTL Leonding.
2. Die Unternehmen präsentieren aktiv Werbeinhalte.
3. Mehrere Sponsoren sind gleichzeitig sichtbar.
4. Die Präsentation läuft vollständig automatisch.

Der Gesamteindruck soll hochwertig, modern und repräsentativ wirken.

Der Fokus liegt auf großen, gut lesbaren Werbepostern und einer ruhigen, professionellen Rotation.