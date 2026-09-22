# Historia zmian Ala Paint

Nazwa pliku `HISTORA.md` jest zgodna z ustaleniem na początku projektu.

## 2026-09-22 — Pierwsza pracownia (0.1.0)

- Ustaliliśmy polski język komunikacji i interfejsu oraz zasady współpracy z Alą w `AGENTS.md`.
- Utworzyliśmy aplikację w JavaScript, działającą w całości po stronie klienta. Narzędzia: Vite, Canvas 2D, ikony Lucide; Playwright do testów i Prettier do formatowania.
- Dodaliśmy przyjazny, pastelowy interfejs z podpisanymi przyciskami i układem dostosowanym do komputera, tabletu i telefonu.
- Udostępniliśmy pędzel, ołówek, spray, gumkę, paletę i własny kolor oraz regulację wielkości narzędzia.
- Dodaliśmy linie, koła/elipsy, prostokąty i tekst z pięcioma rodzinami czcionek oraz regulacją wielkości liter.
- Dodaliśmy przezroczyste warstwy: wybór aktywnej, dodawanie, widoczność, zmianę kolejności i usuwanie. Gumka działa tylko na aktywnej warstwie.
- Dodaliśmy pięć jednolitych teł i opcję przezroczystości.
- Dodaliśmy cofanie i ponawianie zmian, skróty klawiaturowe oraz potwierdzenie zastąpienia niezapisanej pracy.
- Wprowadziliśmy wersjonowany format `.ala.json`, zachowujący nazwę, rozmiar, tło i warstwy. Import sprawdza format, limity i wymiary obrazów przed podmianą projektu.
- Dodaliśmy eksport widocznego rysunku do PNG i WebP z obsługą przezroczystości.
- Opisaliśmy uruchomienie, zapis projektów, strukturę kodu i obecne ograniczenia w `README.md`. Gotowe elementy postaci i ilustrowane tła pozostają planem na później.

Sprawdzenie: testy przeglądarkowe w Chromium obejmują rysowanie, narzędzia, cofanie, warstwy, tekst, kształty, zapis i odczyt projektu, eksport PNG/WebP, odrzucanie błędnych plików, potwierdzenie nowego rysunku, dotyk i szerokości ekranów 320–1440 px. Sprawdziliśmy także budowanie wersji produkcyjnej, formatowanie oraz wygląd na zrzutach ekranu komputera i telefonu.
