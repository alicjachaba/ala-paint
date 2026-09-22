# Ala Paint 🎨

Kolorowa pracownia do rysowania, którą rozwijamy razem z 9-letnią Alą. Interfejs i dokumentacja są po polsku. Rysunki są przetwarzane wyłącznie w przeglądarce — bez konta i wysyłania plików na serwer.

## Uruchomienie

Potrzebny jest Node.js w wersji obsługiwanej przez Vite (22.12+ lub nowsza wspierana wersja).

```bash
npm install
npm run dev
```

Otwórz adres pokazany w terminalu (zwykle http://127.0.0.1:5173).

```bash
npm run build    # gotowa aplikacja w katalogu dist/
npm run preview  # lokalny podgląd gotowej aplikacji
```

Katalog `dist/` można opublikować na hostingu statycznym. Aplikacja nie potrzebuje backendu. Serwer Vite służy tylko do pracy nad kodem; pliki produkcyjne nie potrzebują Node.js. Zasoby aplikacji są lokalne, bez zewnętrznych fontów i CDN. Pierwsze otwarcie wymaga dostępu do hostingu; nie ma jeszcze instalacji PWA ani gwarancji uruchamiania offline.

## Co już potrafimy?

- Rysować pędzlem, cienkim ołówkiem i sprayem; wymazywać gumką.
- Wybierać kolor z palety lub ustawić własny, zmieniać wielkość narzędzia.
- Rysować tęczą: kolor zmienia się w czasie prowadzenia kreski.
- Dodawać stempelki: oczy, ogon, uszy i łapy; wybierać ich kolor, wielkość i obrót.
- Sypać kolorowy piasek, który spada i usypuje się na kreskach tej samej warstwy.
- Pracować w różowej pracowni z delikatnymi gwiazdkami, słoneczkami i serduszkami.
- Włączyć żartobliwy tryb ciemny: pracownię zastępuje kotek śpiący w łóżku. Tryb jasny przywraca rysunek i historię cofania.
- Rysować linie, koła/elipsy i prostokąty przez przeciągnięcie.
- Dodawać tekst: wpisać napis, wybrać czcionkę i wielkość, kliknąć na kartce.
- Dodawać, ukrywać, przestawiać i usuwać warstwy (maksymalnie 12). Górna warstwa na liście znajduje się na wierzchu rysunku.
- Wybierać jedno z pięciu jednolitych teł lub przezroczystość.
- Cofać i ponawiać zmiany: do 25 kroków, z dodatkowym limitem pamięci historii.
- Zapisywać i otwierać projekt `.ala.json`, pobierać obrazek PNG lub WebP.
- Rysować myszą, palcem i rysikiem. Wielkość kreski ustawiamy suwakiem; nacisk rysika nie zmienia grubości.

Kartka startowa ma **960 × 640 pikseli**. Skaluje się do ekranu, zachowując rozdzielczość obrazu. Pokazany procent to aktualna skala wyświetlania.

Czcionki korzystają z lokalnych fontów systemowych (Trebuchet MS, Comic Sans MS / Chalkboard SE, Georgia, Arial, Courier New) i zamienników. Ich wygląd może różnić się pomiędzy urządzeniami. Tekst staje się częścią obrazu aktywnej warstwy — można go cofnąć lub wymazać, ale nie edytować jak w edytorze tekstu.

## Zwierzątka, tęcza i piasek

W sekcji **Zwierzątka Ali** wybierz **Oczy**, **Ogon**, **Uszy** lub **Łapy**. Ustaw wielkość i obrót, wybierz kolor i kliknij na kartce. Każde kliknięcie dodaje jeden stempelek na zaznaczonej warstwie. Można go cofnąć albo wymazać; po przybiciu staje się częścią obrazu, tak jak kreska. Na komputerze przybornik można przewijać niezależnie od kartki.

Przycisk **Tęczowy** w palecie włącza zmieniające się kolory pędzla, ołówka, sprayu i sypanego piasku. Kształty oraz tekst dostają tęczowe przejście kolorów, a kolejne stempelki otrzymują kolejne kolory tęczy. Kliknięcie zwykłego koloru wyłącza tęczę. Gumka nadal wymazuje.

Wybierz **Piasek**, kolor oraz wielkość strumienia, a następnie przytrzymaj mysz, palec lub rysik nad kartką. Ziarenka przyspieszają w dół, zsuwają się na boki i tworzą kupkę. Zatrzymują się na dnie kartki oraz na dowolnych nieprzezroczystych pikselach **tej samej warstwy**, również białych i częściowo przezroczystych. Tło kartki i pozostałe warstwy nie zatrzymują piasku.

Po puszczeniu przycisku pozostałe ziarenka opadają. Jeśli wcześniej wybierzesz inną czynność (np. zapis, zmianę warstwy albo tryb ciemny), piasek od razu osiądzie. Całe jedno sypanie cofniesz jednym kliknięciem. Osiadły piasek staje się zwykłym rysunkiem: zachowuje się w JSON, PNG i WebP, ale po wymazaniu podpory nie zaczyna ponownie spadać.

**Tryb ciemny** to przerwa na sen: rysunek i przyciski znikają, a skróty pracowni są wyłączone. Przycisk **Tryb jasny — wracamy do rysowania** przywraca pracę. Dekoracje i śpiący kotek nie trafiają do eksportowanego obrazka.

## Jak zachować rysunek?

1. Kliknij **Zapisz rysunek → Zapisz projekt**. Przeglądarka pobierze plik `.ala.json` z warstwami, tłem i nazwą.
2. Później wybierz **Otwórz** i wskaż ten plik.
3. Do dzielenia się obrazkiem wybierz **Pobierz PNG** lub **Pobierz WebP**. Eksport zawiera tło i widoczne warstwy, w ich aktualnej kolejności. Przezroczyste tło zachowuje przezroczystość.

**Zapisuj projekt przed zamknięciem strony.** Nie ma jeszcze automatycznego zapisu. Eksport obrazka nie zastępuje zapisu projektu: obraz PNG/WebP nie zachowuje osobnych warstw. Przeglądarka może pytać, gdzie zapisać pobrany plik. Aplikacja ostrzega przed rozpoczęciem nowej pracy z niezapisanymi zmianami; ostrzeżenie przy zamykaniu karty zależy też od przeglądarki.

Skróty klawiaturowe: `Ctrl/⌘ + Z` — cofnij, `Ctrl/⌘ + Shift + Z` lub `Ctrl + Y` — ponów, `Ctrl/⌘ + S` — pobierz projekt. Podczas wpisywania tekstu skróty edycyjne działają w polu tekstowym.

## Kod i biblioteki

Prosty JavaScript w modułach ES, HTML i CSS; Canvas 2D obsługuje rysowanie. [Vite](https://vite.dev/guide/) uruchamia i buduje aplikację, [Lucide](https://lucide.dev/) dostarcza ikony, [Playwright](https://playwright.dev/) sprawdza zachowanie w przeglądarce. Prettier dba o czytelne formatowanie.

- `src/main.js` — interfejs i obsługa przycisków, historii oraz gestów.
- `src/drawing.js` — kreski, spray i kształty.
- `src/colors.js` — zmieniające się kolory tęczy i tęczowe przejścia.
- `src/stamps.js` — rysowanie części zwierzątek.
- `src/sand.js` — opadanie ziarenek i przeszkody na aktywnej warstwie.
- `public/decorations.svg`, `public/sleeping-cat.svg` — lokalne dekoracje i śpiąca maskotka.
- `src/project.js` — warstwy, format projektu, sprawdzanie plików i eksport.
- `src/style.css` — kolory, rozmiary i układ na różnych ekranach.
- `tests/paint.spec.js` — testy istotnych działań użytkownika.
- `AGENTS.md` — zasady dalszej współpracy.
- `HISTORA.md` — historia zmian.

Format projektu ma identyfikator `ala-paint` i wersję `1`; każda warstwa zawiera obraz PNG zapisany w base64. Import dopuszcza pliki do 20 MB, wymiary do 2048 × 2048 i łącznie do 20 milionów pikseli warstw. Plik jest sprawdzany przed zastąpieniem bieżącej pracy. Historia cofania nie jest zapisywana w pliku projektu.

## Sprawdzanie zmian

```bash
npx playwright install chromium  # jednorazowo
npm test
npm run build
npm run format:check
```

Testy obejmują rysowanie, cofanie, warstwy, gumkę, tekst, kształty, zapis i odczyt JSON, formaty eksportu, błędny import oraz dotyk na małym ekranie. Sprawdzają też stempelki, zmianę kolorów w tęczowej kresce, opadanie piasku, przeszkody tylko na tej samej warstwie, zapis ziarenek, przerwanie sypania oraz bezpieczny powrót z trybu snu. Są wykonywane w Chromium; pozostałe przeglądarki wymagają osobnej weryfikacji.

## Kolejne przygody

W kolejnych etapach możemy dodać więcej części zwierzątek i minek, ilustrowane tła kartki, zmianę rozmiaru kartki oraz automatyczny zapis.
