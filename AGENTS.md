# Ala Paint — zasady wspólnej pracy

- Komunikujemy się po polsku. Interfejs, komunikaty, dokumentacja i objaśniające komentarze są po polsku.
- Tworzymy aplikację razem z 9-letnią Alą. Wyjaśniaj zmiany prostym językiem; pisz czytelny JavaScript i dziel kod według odpowiedzialności.
- Aplikacja działa w przeglądarce, w całości po stronie klienta. Bez backendu, kont, reklam, analityki i wysyłania rysunków na serwer.
- Stos technologiczny: JavaScript (moduły ES), HTML, CSS, Canvas 2D, Vite i ikony Lucide. Dodawaj zależności tylko wtedy, gdy przynoszą konkretną korzyść.
- Projektuj duże, podpisane przyciski, czytelne litery, przyjazne kolory, widoczny fokus i obsługę myszy, dotyku oraz rysika. Nie polegaj wyłącznie na kolorze lub ikonie.
- Chroń pracę użytkownika: cofanie zmian, potwierdzenie rozpoczęcia nowego rysunku, walidacja importu przed zastąpieniem projektu. Nie wykonuj kodu z plików użytkownika.
- Plik projektu JSON ma wersjonowany format; zachowuj warstwy i tło. PNG i WebP są płaskimi eksportami widocznych warstw.
- Każdą istotną zmianę odnotuj w `HISTORA.md` (nazwa pliku jest celowa), z datą, zakresem i sposobem sprawdzenia.
- Po zmianach logiki sprawdź `npm test` oraz `npm run build`. Testuj istotne zachowania, w szczególności rysowanie, warstwy i zapis/odczyt, zamiast szczegółów implementacji.
- Nie dodawaj gotowych oczu, naklejek i animacji bez ustalenia kolejnego etapu. Zadbaj, by obecny kod dało się później rozszerzyć.
