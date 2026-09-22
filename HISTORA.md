# Historia zmian Ala Paint

Nazwa pliku `HISTORA.md` jest zgodna z ustaleniem na początku projektu.

## 2026-09-22 — Pracownia bardziej Ali

- Dodaliśmy uzgodniony kolejny etap: stempelki oczu, ogona, uszu i łap. Mają wybór koloru, rozmiaru i obrotu, działają na aktywnej warstwie i podlegają cofaniu.
- Zmieniliśmy oprawę pracowni na różową, z delikatnymi gwiazdkami, słoneczkami i serduszkami. Ozdoby są lokalnymi SVG i nie trafiają na rysunek. Przybornik na komputerze można przewijać osobno.
- Dodaliśmy piasek z animacją przyspieszającego opadania, zsuwaniem ziarenek i kolizjami z pikselami tylko aktywnej warstwy. Białe piksele też zatrzymują piasek. Całe sypanie stanowi jeden krok historii; kolejna czynność najpierw osadza pozostałe ziarenka.
- Dodaliśmy kolor tęczowy: zmiana barwy wzdłuż kreski, kolorowe ziarenka, tęczowe kształty i napisy oraz zmieniające kolor stempelki.
- Dodaliśmy żartobliwy tryb ciemny z kotkiem śpiącym w łóżku i napisem „zz.. zzz... zzzz...”. Ukrywa pracownię i wyłącza jej skróty; tryb jasny przywraca projekt, ustawienia i historię. Fokus trafia na przycisk powrotu.
- Nowe ślady zapisują się w istniejącym formacie projektu (wersja 1), jako obrazy warstw. Nie dodaliśmy zależności ani usług zewnętrznych.
- Uzupełniliśmy instrukcję, w tym informację, że osiadły piasek staje się zwykłymi pikselami i nie spada ponownie po usunięciu podpory.

Sprawdzenie: `npm test` — 15 testów Chromium, w tym nowe testy stempelków i ich zapisu, tęczowej kreski, fizyki i cofania piasku, białej podpory, niezależności warstw, przerwania gestu oraz powrotu z trybu snu. `npm run build` — poprawne budowanie produkcyjne. Sprawdziliśmy zrzuty ekranu pracowni na komputerze (1440 px), telefonie (390 px) oraz ekranu snu; testy układu obejmują szerokości 320–1440 px.

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
