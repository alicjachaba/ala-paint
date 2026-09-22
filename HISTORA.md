# Historia zmian Ala Paint

Nazwa pliku `HISTORA.md` jest zgodna z ustaleniem na początku projektu.

## 2026-09-22 — GitHub Pages bezpośrednio z main i katalogu głównego

- Aplikacja działa bezpośrednio ze źródeł, bez Vite podczas publikacji. W GitHub Pages wybieramy **Deploy from a branch → main → /(root)**. Dodaliśmy `.nojekyll`; własny workflow i katalog gotowej strony w repozytorium nie są potrzebne.
- HTML ładuje arkusz CSS zwykłym linkiem, a JavaScript i ikona strony mają względne ścieżki. Obrazki przenieśliśmy z `public/` do `assets/`; style i obrazek kotka odwołują się do ich rzeczywistych lokalizacji. Usunęliśmy użycie `import.meta.env.BASE_URL`.
- Zachowaliśmy ikony Lucide jako lokalny moduł zawierający tylko używane ikony i obsługę ich wyświetlania. Kopia ma licencję i polecenie `npm run icons:update` do odświeżania przy zmianach biblioteki. Nie dodaliśmy zależności ani CDN.
- Vite nadal służy do pracy nad kodem i opcjonalnego budowania `dist/`. Gotowa paczka zawiera również licencję Lucide. README opisuje publikację źródeł z `main`.

Sprawdzenie: `npm test` — 35 testów Chromium. Dwa nowe testy serwują wyłącznie źródła pod `/` i `/ala-paint/`, bez Vite, `node_modules` i `dist/`; sprawdzają ikony, dekoracje, rysowanie, cofanie, ponawianie, warstwy, zapis i odczyt JSON, obrazek kotka oraz brak błędów ładowania. `npm run build`, `npm run format:check` i `git diff --check` — poprawne. Ustawień repozytorium na GitHubie nie zmienialiśmy.

## 2026-09-22 — Publikacja w podkatalogu i na GitHub Pages

- Dodaliśmy konfigurację Vite z względną ścieżką bazową (`base: "./"`). Gotowy katalog `dist/` działa pod głównym adresem oraz w podkatalogach, np. `/ala-paint/`, wraz ze skryptami, stylami, ikoną strony i dekoracjami.
- Obrazek śpiącego kotka korzysta ze ścieżki bazowej Vite, również przy jej nadpisaniu podczas budowania.
- W README opisaliśmy publikację zawartości `dist/` na GitHub Pages i opcjonalne ustawienie stałej ścieżki bazowej.

Sprawdzenie: `npm test` — 33 testy Chromium, `npm run build` i `npm run format:check` — poprawne. Dodatkowo gotową aplikację z `dist/` uruchomiliśmy na lokalnym serwerze statycznym pod `/`, `/ala-paint/` i `/zagniezdzony/katalog/`. W Chromium sprawdziliśmy ładowanie zasobów bez błędów i bez odwołań poza wybrany podkatalog, rysowanie, cofanie oraz obrazek kotka.

## 2026-09-22 — Napis we wspólnej stopce

- Przenieśliśmy „Rysunki zostają u ciebie · bez konta, bez pośpiechu” niżej, pod linię oddzielającą stopkę, obok linku do GitHuba i podpisu autorów. Na telefonie elementy stopki układają się pionowo.

Sprawdzenie: trzy istniejące testy układu Playwright (telefon, różne szerokości i przewijanie paneli) oraz `npm run build` — poprawne.

## 2026-09-22 — Więcej miejsca i pięć nowych krajobrazów

- Ponownie poszerzyliśmy oba panele na ekranach od 1100 px. Ich szerokość rośnie wraz z oknem, do 460 px po lewej i 400 px po prawej. Pracownia może teraz wykorzystać do 1920 px szerokości. Zachowaliśmy niezależne przewijanie paneli, proporcje kartki oraz układ telefonu.
- Dodaliśmy pięć jasnych, pastelowych teł: **Ocean** z żaglówką, **Rafa koralowa**, **Miasto**, **Dżungla** i **Arktyczny krajobraz**. Ilustracje pozostawiają miejsce na własne rysunki i powstają lokalnie w Canvas, bez pobierania obrazków ani nowych zależności.
- Nowe krajobrazy mają podpisane miniatury, działają pod warstwami, podlegają cofaniu i zachowują się w projekcie JSON oraz eksporcie PNG/WebP. Wydzieliliśmy ich rysowanie do `src/landscapes.js` i uzupełniliśmy README.

Sprawdzenie: `npm test` — 33 testy Chromium, w tym osobny test każdego z ośmiu krajobrazów: wybór, cofanie i ponawianie, rysowanie, zapis/odczyt JSON oraz eksport PNG i WebP. Test układu obejmuje także 1920 × 1080 i 2560 × 1440, szerokość paneli oraz dostęp do ostatniego tła po przewinięciu. `npm run build` i `npm run format:check` — poprawne. Obejrzeliśmy planszę pięciu nowych teł oraz zrzuty pracowni przy szerokości 1920 px i 390 px.

## 2026-09-22 — Wiaderko, pastelowe krajobrazy i wygodniejsze panele

- Dodaliśmy narzędzie **Wypełnij** z ikoną wiaderka. Wypełnia połączony obszar podobnych pikseli wyłącznie na aktywnej warstwie, zwykłym kolorem, tęczą albo zwierzęcym wzorem. Obsługuje mysz, dotyk i rysik; ukryta warstwa jest chroniona. Wypełnienie stanowi jeden krok cofania, a ponowne użycie tego samego koloru nie dodaje zbędnego kroku.
- Usunęliśmy suwak „Wielkość przy kliknięciu”. Wielkość zwierzęcego dodatku wybieramy przeciąganiem; samo kliknięcie zachowuje stały rozmiar 100 pikseli.
- Dodaliśmy trzy bardzo jasne, pastelowe krajobrazy: **Sawanna**, **Las** i **Łąka**, z miniaturami. Powstają lokalnie w Canvas, leżą pod warstwami i są wspólne dla podglądu oraz eksportu. Zmianę tła można cofnąć. JSON w wersji 1 zachowuje nowe identyfikatory teł, a PNG i WebP zawierają krajobraz wraz z widocznym rysunkiem.
- Poszerzyliśmy prawy panel i powiększyliśmy podpisy, miniatury, przyciski warstw oraz próbki teł. Przyciski kolejności i usuwania warstw mają widoczne podpisy „Wyżej”, „Niżej” i „Usuń”.
- Na komputerze pracownia zajmuje wysokość okna z miejscem na nagłówek i stopkę. Oba boczne panele przewijają się niezależnie, bez dodatkowego przewijania całej strony. Kartka skaluje się proporcjonalnie. Na telefonie zachowaliśmy pionowy układ i przewijanie strony.
- Usunęliśmy „Stworzone dla Ali i jej wyobraźni”; napis „Rysunki zostają u ciebie · bez konta, bez pośpiechu” jest na środku stopki.
- Uzupełniliśmy README. Bez nowych zależności ani usług zewnętrznych.

Sprawdzenie: `npm test` — 26 testów Chromium, w tym wypełnianie zamkniętego obrysu, niezależność warstw, cofanie i ponawianie, przezroczystość, wzory, tęcza, dotyk i rysik, zapis/odczyt JSON oraz eksport PNG/WebP z krajobrazem. Test układu z wieloma warstwami sprawdza brak przewijania strony przy rozmiarach 1024 × 600, 1280 × 720, 1440 × 900 i 1600 × 600. Dotychczasowe testy obejmują też szerokości 320–1600 px. `npm run build` i `npm run format:check` — poprawne. Obejrzeliśmy zrzuty pracowni na komputerze i telefonie oraz wszystkich trzech krajobrazów.

## 2026-09-22 — Zwierzątka rosną razem z wyobraźnią

- Oczy, uszy, ogony i łapy rysujemy przez naciśnięcie i przeciągnięcie, z podglądem wielkości w obie strony. Podgląd powstaje na kopii aktywnej warstwy, więc po puszczeniu wygląda identycznie i nie zostawia wcześniejszych śladów. Cały dodatek jest jednym krokiem cofania; anulowanie gestu usuwa podgląd. Zachowaliśmy obrót i możliwość stemplowania samym kliknięciem.
- Dodaliśmy po cztery podpisane odmiany każdej części zwierzątka, łącznie 16, z obrazkami do wyboru. Przy zmianie narzędzia pamiętamy wybraną odmianę. Tęcza wypełnia dodatki również po rozciągnięciu i obrocie.
- Dodaliśmy specjalne kolory: tygrysie paski, kocie cętki, żyrafę, zebrę i futerko. Powtarzane kafelki rysujemy lokalnie w Canvas; działają z narzędziami do rysowania, napisami, dodatkami i piaskiem. Wybór zwykłego koloru wyłącza wzór.
- Poszerzyliśmy przybornik na dużych ekranach. Liczba narzędzi w wierszu dostosowuje się do miejsca: od dwóch do czterech, z czytelnymi podpisami.
- Powiększyliśmy hasło pod AlaPaint i podzieliliśmy je po „mała pracownia,”. Powiększyliśmy oba napisy na dole oraz dodaliśmy link do repozytorium GitHub i stopkę „stworzone przez Alę z małą pomocą Taty”.
- Uzupełniliśmy instrukcję w `README.md`. Projekt nadal zapisuje warstwy i tło w formacie JSON w wersji 1, a PNG i WebP zawierają widoczne warstwy. Bez nowych zależności i usług zewnętrznych.

Sprawdzenie: `npm test` — 22 testy Chromium, obejmujące m.in. wszystkie odmiany, rozciąganie i zmniejszanie podglądu, cofanie, anulowanie gestu, przeciąganie dotykiem, wzory i tęczę, widoczność warstw, zapis/odczyt JSON oraz eksport PNG/WebP. Układ sprawdzony przy szerokościach 320–1600 px, również z otwartymi odmianami. `npm run build` i `npm run format:check` — poprawne. Obejrzeliśmy zrzuty pracowni na komputerze i telefonie oraz planszę odmian i wzorów.

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
