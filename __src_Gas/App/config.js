/* *********************** PLIKI Z DANYMI ******************* */

/**
 * URLe z danymi dla Huba
 * @type {string} HUB_URL
 */

const HUB_URL =
	'https://docs.google.com/spreadsheets/d/187UHAKj7Lf4oHkaySfgWXy6FPmUd6S4M9KdwPHKrtYM/edit?usp=drivesdk';

/**
 * URLe zewnętrznych arkuszy z których pobieramy dane
 * @type {Object<string, string>} EXT_SHEET_URL
 */
const EXT_SHEET_URL = {
	l16000:
		'https://docs.google.com/spreadsheets/d/1gg3HTLEhajaH1A7XkSlsL21eDHsMflDHVHX4c7h7nKo/edit?usp=drivesdk',
	l8000:
		'https://docs.google.com/spreadsheets/d/1e9CFVfLpRnpe8nbv7rmHajo5dYCyng6UMmeuUK2bpgk/edit?usp=drivesdk',
	l4000:
		'https://docs.google.com/spreadsheets/d/1XMZQgzZVCYJalP5NMegqXDg1X585QEeBBjmFxY6Qz3w/edit?usp=drivesdk',
	l2000:
		'https://docs.google.com/spreadsheets/d/1pBLyBB-6-XDGDf-qKKlQxMrupungfBSJWkG9y0iPcfE/edit?usp=drivesdk',
	l1000:
		'https://docs.google.com/spreadsheets/d/1yGDsQrqnSWmQsqRzxjJBBclG8OqGv9ngQOB0R8j98Oc/edit?usp=drivesdk',
	l500:
		'https://docs.google.com/spreadsheets/d/15gY4AgWxU-8RyGAGU-A68azuwWNLNOtS0c-QgRWEiN0/edit?usp=drivesdk',
	l200:
		'https://docs.google.com/spreadsheets/d/1JtBnevZItMbXPpL5Rwg7wIOLAM7CYOoWS9Z9VdIi8DU/edit?usp=drivesdk',
	l100:
		'https://docs.google.com/spreadsheets/d/1R_wqDshODInbTeWG0xXz_ox58hMMCmX9eCRUxAb3u7c/edit?usp=drivesdk',
};

/**
 * Nazwa arkusza w zewnętrznym pliku, w którym znajdują się losowe dane
 * @type {string} EXT_SHEET_NAME
 */
const EXT_SHEET_NAME = 'res';

/**
 * Opis zadania wykorzysytwany w singlu
 * @type {Object<string, string>}
 */

const SHORT_DSC = {
	l100: 'Arr 1: 100',
	l200: 'Arr 2: 200',
	l500: 'Arr 3: 500',
	l1000: 'Arr 4: 1000',
	l2000: 'Arr 5: 2000',
	l4000: 'Arr 6: 4000',
	l8000: 'Arr 7: 8000',
	l16000: 'Arr 8: 16000',
};

/**
 * Dłuższy opis wykorzystywany w singlu
 * @type {Object<string, string>}
 */

const LONG_DESC = {
	ext1: 'bRange 1: 1 row - Ext',
	ext5: 'bRange 2: 5 rows - Ext',
	ext10: 'bRange 3: 10 rows - Ext',
	ext25: 'bRange 4: 25 rows - Ext',
	ext50: 'bRange 5: 50 rows - Ext',
	ext100: 'bRange 6: 100 rows - Ext',

	loc1: 'bRange 1: 1 row - Loc',
	loc5: 'bRange 2: 5 rows - Loc',
	loc10: 'bRange 3: 10 rows - Loc',
	loc25: 'bRange 4: 25 rows - Loc',
	loc50: 'bRange 5: 50 rows - Loc',
	loc100: 'bRange 6: 100 rows - Loc',

	hub1: 'bRange 1: 1 row - Hub',
	hub5: 'bRange 2: 5 rows - Hub',
	hub10: 'bRange 3: 10 rows - Hub',
	hub25: 'bRange 4: 25 rows - Hub',
	hub50: 'bRange 5: 50 rows - Hub',
	hub100: 'bRange 6: 100 rows - Hub',
};

/**
 * Gdzie wkleić wyniki ekspetymentów
 * @type {Object}
 */

/**
 * @typedef {Object} PRINT_DEST
 * @property {Object<string, string>} geo URLe plików do których wkleić dane z czasami egzekucji
 * @property {Object<string, string>} sheets Kody arkuszy do których wkleić dane z czasami
 */
/**
 * @type {PRINT_DEST} obj
 */

const WHERE_TO_PRINT = {
	geo: {
		loc:
			'https://docs.google.com/a/iconaris.com/spreadsheets/d/1wtb3RoJ0j3lM1jHfZruZxVyBNkA66O90NMxK45WpKdo',
		hub:
			'https://docs.google.com/a/iconaris.com/spreadsheets/d/1yFDSVKjrQRHhRSM9dNS51VF7GbHMNthol0P1AD9RkOg',
		ext:
			'https://docs.google.com/a/iconaris.com/spreadsheets/d/1kW9g13lpUbQiQZ332syHChAqumrUbddu_Wn0gOhO2ZU',
	},
	sheets: {
		e1: 'T: 1',
		e5: 'T: 5',
		e10: 'T: 10',
		e25: 'T: 25',
		e50: 'T: 50',
		e100: 'T: 100',
	},
};

export {
	EXT_SHEET_URL,
	EXT_SHEET_NAME,
	SHORT_DSC,
	LONG_DESC,
	WHERE_TO_PRINT,
	HUB_URL,
};
