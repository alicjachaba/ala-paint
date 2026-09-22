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

### GitHub Pages — publikacja z main

GitHub Pages może publikować aplikację bezpośrednio z plików źródłowych w gałęzi `main`, pod adresem [alicjachaba.github.io/ala-paint/](https://alicjachaba.github.io/ala-paint/). Przeglądarka sama odczytuje HTML, CSS i moduły JavaScript. Nie potrzeba własnego workflow, lokalnego budowania strony ani katalogu `dist/` w repozytorium.

Jednorazowe przygotowanie repozytorium:

1. Otwórz [Settings → Pages](https://github.com/alicjachaba/ala-paint/settings/pages).
2. W **Build and deployment → Source** wybierz **Deploy from a branch**.
3. Wybierz gałąź **main**, katalog **/(root)** i kliknij **Save**.
4. Wyślij zmiany projektu do `main`.

Każdy kolejny push do `main` uruchamia zwykłą publikację GitHub Pages. Plik `.nojekyll` oznacza, że GitHub ma udostępnić gotowe źródła bez przetwarzania przez Jekyll. Postęp publikacji można sprawdzić w zakładce **Actions**, w zadaniu tworzonym przez sam GitHub Pages.

Vite pozostaje narzędziem do pracy nad kodem oraz opcjonalnego przygotowania mniejszej paczki `dist/` na inne hostingi. Aplikacja działa również bez uruchamiania Vite.

### Inne hostingi i podkatalogi

Lokalne `npm run build` nadal używa względnych ścieżek (`base: "./"`). Ten sam wynik działa pod głównym adresem strony i w dowolnym podkatalogu. Używaj adresu podkatalogu zakończonego `/`, aby przeglądarka poprawnie odczytywała względne ścieżki. Stałą ścieżkę bazową możesz podać przy budowaniu, np. `npm run build -- --base=/ala-paint/`.

## Co już potrafimy?

- Rysować pędzlem, cienkim ołówkiem i sprayem; wymazywać gumką.
- Wypełniać wiaderkiem zamknięte obszary aktywnej warstwy kolorem, tęczą lub wzorem.
- Wybierać kolor z palety lub ustawić własny, zmieniać wielkość narzędzia.
- Rysować tęczą: kolor zmienia się w czasie prowadzenia kreski.
- Rysować oczy, ogony, uszy i łapy przez przeciąganie, z podglądem wielkości; wybierać po cztery odmiany każdego dodatku i jego obrót.
- Malować tygrysimi paskami, kocimi cętkami, wzorem żyrafy, zebry i futerka.
- Sypać kolorowy piasek, który spada i usypuje się na kreskach tej samej warstwy.
- Pracować w różowej pracowni z delikatnymi gwiazdkami, słoneczkami i serduszkami.
- Włączyć żartobliwy tryb ciemny: pracownię zastępuje kotek śpiący w łóżku. Tryb jasny przywraca rysunek i historię cofania.
- Rysować linie, koła/elipsy i prostokąty przez przeciągnięcie.
- Dodawać tekst: wpisać napis, wybrać czcionkę i wielkość, kliknąć na kartce.
- Dodawać, ukrywać, przestawiać i usuwać warstwy (maksymalnie 12). Górna warstwa na liście znajduje się na wierzchu rysunku.
- Wybierać jednolite tło, przezroczystość lub jasny pastelowy krajobraz: sawannę, las, łąkę, ocean, rafę koralową, miasto, dżunglę i arktyczny krajobraz.
- Cofać i ponawiać zmiany: do 25 kroków, z dodatkowym limitem pamięci historii.
- Zapisywać i otwierać projekt `.ala.json`, pobierać obrazek PNG lub WebP.
- Rysować myszą, palcem i rysikiem. Wielkość kreski ustawiamy suwakiem; nacisk rysika nie zmienia grubości.

Kartka startowa ma **960 × 640 pikseli**. Skaluje się do ekranu, zachowując rozdzielczość obrazu. Pokazany procent to aktualna skala wyświetlania.

Czcionki korzystają z lokalnych fontów systemowych (Trebuchet MS, Comic Sans MS / Chalkboard SE, Georgia, Arial, Courier New) i zamienników. Ich wygląd może różnić się pomiędzy urządzeniami. Tekst staje się częścią obrazu aktywnej warstwy — można go cofnąć lub wymazać, ale nie edytować jak w edytorze tekstu.

## Zwierzątka, tęcza i piasek

W sekcji **Zwierzątka Ali** wybierz **Oczy**, **Ogon**, **Uszy** lub **Łapy**, a potem odmianę z obrazkiem. Naciśnij i przeciągnij po kartce, tak jak przy rysowaniu koła — dodatek rośnie razem z ruchem dłoni. Możesz przeciągać w każdą stronę; puszczenie kończy rysowanie. Obrót ustawisz suwakiem. Samo kliknięcie przybija stempelek o stałej wielkości 100 pikseli. Cały dodatek cofniesz jednym kliknięciem. Przerwanie gestu przez przeglądarkę usuwa jego podgląd.

Do wyboru są oczy okrągłe, kocie, z rzęsami i śpiące; ogony zakręcone, lisie, wiewiórcze i królicze; uszy kocie, królicze, misiowe i pieska; łapy kocie, pieska, ptasie oraz kopytka. Wybór odmiany jest pamiętany przy przełączaniu narzędzi. Dodatki trafiają na aktywną warstwę i stają się pikselami, jak kreska. Przybornik dopasowuje się do dostępnego miejsca: od dwóch do czterech narzędzi w wierszu. Na komputerze oba boczne panele przewijają się niezależnie od kartki, a pracownia mieści się w wysokości okna. Na telefonie sekcje układają się jedna pod drugą.

Przycisk **Tęczowy** w palecie włącza zmieniające się kolory pędzla, ołówka, sprayu i sypanego piasku. Kształty oraz tekst dostają tęczowe przejście kolorów, podobnie jak zwierzęce dodatki. Kliknięcie zwykłego koloru wyłącza tęczę. Gumka nadal wymazuje.

W sekcji **Zwierzęce wzory** wybierz **Tygrysie paski**, **Kocie cętki**, **Żyrafę**, **Zebrę** lub **Futerko**. Wzór zastępuje kolor pędzla, ołówka, sprayu, kształtów, napisów i kolorowych części zwierzątek; działa też z piaskiem. Najłatwiej zobaczysz go przy większej grubości kreski. Wybór zwykłego lub własnego koloru wyłącza wzór, a gumka wciąż wymazuje. Wzory zapisują się razem z warstwami w JSON oraz w płaskim eksporcie PNG i WebP.

Wybierz **Piasek**, kolor oraz wielkość strumienia, a następnie przytrzymaj mysz, palec lub rysik nad kartką. Ziarenka przyspieszają w dół, zsuwają się na boki i tworzą kupkę. Zatrzymują się na dnie kartki oraz na dowolnych nieprzezroczystych pikselach **tej samej warstwy**, również białych i częściowo przezroczystych. Tło kartki i pozostałe warstwy nie zatrzymują piasku.

Po puszczeniu przycisku pozostałe ziarenka opadają. Jeśli wcześniej wybierzesz inną czynność (np. zapis, zmianę warstwy albo tryb ciemny), piasek od razu osiądzie. Całe jedno sypanie cofniesz jednym kliknięciem. Osiadły piasek staje się zwykłym rysunkiem: zachowuje się w JSON, PNG i WebP, ale po wymazaniu podpory nie zaczyna ponownie spadać.

**Tryb ciemny** to przerwa na sen: rysunek i przyciski znikają, a skróty pracowni są wyłączone. Przycisk **Tryb jasny — wracamy do rysowania** przywraca pracę. Dekoracje i śpiący kotek nie trafiają do eksportowanego obrazka.

## Wiaderko i krajobrazy

Wybierz **Wypełnij**, kolor i kliknij wewnątrz zamkniętego kształtu. Wiaderko zmienia połączony obszar podobnych pikseli tylko na aktywnej warstwie. Obrysy z innych warstw i tapeta nie zatrzymują wypełnienia. Pusta warstwa wypełni się w całości. Możesz użyć też tęczy lub zwierzęcego wzoru; jedno wypełnienie cofniesz jednym kliknięciem.

W sekcji **Tło kartki** znajdziesz pastelowe tła **Sawanna**, **Las**, **Łąka**, **Ocean**, **Rafa koralowa**, **Miasto**, **Dżungla** i **Arktyczny krajobraz**. Pozostają pod wszystkimi warstwami, więc zmiana tła nie usuwa rysunku. Tło można cofnąć, zachować w projekcie JSON i wyeksportować z obrazkiem PNG lub WebP.

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
- `src/fill.js` — wypełnianie połączonych obszarów na aktywnej warstwie.
- `src/backgrounds.js` — kolory tła, wybór krajobrazów i ich miniatury.
- `src/landscapes.js` — rysowanie oceanu, rafy, miasta, dżungli i Arktyki.
- `src/colors.js` — zmieniające się kolory tęczy i tęczowe przejścia.
- `src/stamps.js` — odmiany części zwierzątek, ich rysowanie i rozciąganie.
- `src/patterns.js` — lokalnie rysowane kafelki zwierzęcych wzorów.
- `src/sand.js` — opadanie ziarenek i przeszkody na aktywnej warstwie.
- `assets/decorations.svg`, `assets/sleeping-cat.svg` — lokalne dekoracje i śpiąca maskotka.
- `src/vendor/lucide.js` — lokalna kopia używanych ikon Lucide z licencją, gotowa dla przeglądarki.
- `src/project.js` — warstwy, format projektu, sprawdzanie plików i eksport.
- `src/style.css` — kolory, rozmiary i układ na różnych ekranach.
- `tests/paint.spec.js` — testy istotnych działań użytkownika.
- `tests/deployment.spec.js` — działanie źródeł na zwykłym serwerze pod `/` i `/ala-paint/`, bez Vite.
- `AGENTS.md` — zasady dalszej współpracy.
- `HISTORA.md` — historia zmian.

Format projektu ma identyfikator `ala-paint` i wersję `1`; każda warstwa zawiera obraz PNG zapisany w base64. Import dopuszcza pliki do 20 MB, wymiary do 2048 × 2048 i łącznie do 20 milionów pikseli warstw. Plik jest sprawdzany przed zastąpieniem bieżącej pracy. Historia cofania nie jest zapisywana w pliku projektu.

Ikony są przechowywane lokalnie, bez CDN. Przy zmianie wersji Lucide lub zestawu ikon w `scripts/icons-entry.js` uruchom `npm run icons:update` i zachowaj wynik w `src/vendor/` razem z licencją. Zwykłe zmiany aplikacji nie wymagają odświeżania tej kopii.

## Sprawdzanie zmian

```bash
npx playwright install chromium  # jednorazowo
npm test
npm run build
npm run format:check
```

Testy obejmują rysowanie, cofanie, warstwy, gumkę, tekst, kształty, zapis i odczyt JSON, formaty eksportu, błędny import oraz dotyk na małym ekranie. Sprawdzają też stempelki, zmianę kolorów w tęczowej kresce, opadanie piasku, przeszkody tylko na tej samej warstwie, zapis ziarenek, przerwanie sypania oraz bezpieczny powrót z trybu snu. Nowe testy obejmują wszystkie odmiany dodatków, rozciąganie w obie strony, brak śladów podglądu, anulowanie gestu, przeciąganie dotykiem, wzory i tęczowe dodatki oraz układ z otwartymi odmianami przy szerokościach 320–1600 px. Są wykonywane w Chromium; pozostałe przeglądarki wymagają osobnej weryfikacji.

## Kolejne przygody

W kolejnych etapach możemy dodać więcej części zwierzątek i minek, kolejne krajobrazy, zmianę rozmiaru kartki oraz automatyczny zapis.

Stworzone przez Alę z małą pomocą Taty. [AlaPaint na GitHubie](https://github.com/alicjachaba/ala-paint).
