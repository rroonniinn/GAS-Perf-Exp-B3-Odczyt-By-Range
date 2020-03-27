# PRV.016 | GAS Perf. Exp | E03
## Test: 	Zapis danych do arkusza (cały zakres)

#### Kod: Z03

#### Cel
Poznanie czasów zapisu danych dla:
1. Różnych struktur arkuszy (internal, external, cache)
2. Różnych wielkości arkuszy (zestawu danych)"

#### Zadanie
1. Zapisanie losowej tablicy danych do istniejącego źródła.
2. Losowa tablica jest generowana w pamięci (czas tej operacji jest znikomy)
3. Wklejana jest cała tablica 1:1.
4. Zakres docelowego arkusza jest równy wymiarowi danych - nie są dodawane nowe wiersze ani kolumny"


#### Próbki
Arkusze o 15 kolumnach, o różnej liczbie wierszy: od 100 do 16 000

#### Warianty
1. Arkusze osadzone w pliku z którego jest uruchamiany skrypt
2. Arkusze w odzielnych plikach (zawierające tylko dane testowane)
3. Arkusze (dane) osadzone w cach'ach"

#### Plik
Adres pliku z czasami i wykresami: https://docs.google.com/spreadsheets/d/1qV5DkLLS2XcZC2Oc3QsikbOtsA41N2PNBKyZghWbytY/edit#gid=252400475
