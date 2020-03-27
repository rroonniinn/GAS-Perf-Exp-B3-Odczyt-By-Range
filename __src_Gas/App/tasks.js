/* eslint-disable max-params */

import { getSheet } from '../../../GAS | Library/v02/gas/getSheet';
import { getIdFromUrl } from '../../../GAS | Library/v02/gas/getIdFromUrl';
import { randomIntegersArray } from '../../../GAS | Library/v02/arr/randomIntegersArray';

import {
	EXT_SHEET_URL,
	EXT_SHEET_NAME,
	HUB_URL,
	WHERE_TO_PRINT,
} from './config';

/**
 * Zwraca odpowieni arkusz do modyfikacji na podstawie parametru 'geo'
 * określającego czy ma być to external, local czy hub
 *
 * @param {string} geo Określenie 'ext', 'loc', 'hub'
 * @param {string} sheetCode Zdefiniowany kod zadania np. l100
 * @returns {GoogleAppsScript.Spreadsheet.Sheet} Obiket arkusza
 */

const getProperSheet = (geo, sheetCode) => {
	if (geo === 'ext') {
		return getSheet(
			EXT_SHEET_NAME,
			getIdFromUrl(EXT_SHEET_URL[sheetCode])
		);
	}
	if (geo === 'loc') {
		return getSheet(sheetCode);
	}
	if (geo === 'hub') {
		return getSheet(sheetCode, getIdFromUrl(HUB_URL));
	}
};

/**
 * Helper
 * Pobiera numer ze stringa
 * @param {string} str Zdefiniowany kod zadania np. l100
 */
const getNumbFromStr = str => Number(/[0-9]+/.exec(str)[0]);

/**
 * Usuwa stare dane z arkuszy powstałych jako kopiowanie z innych, już
 * istniejących plików. Dodatkowo modyfikuje background i tekst nagłowka
 */

const deleteOldDate = () =>
	Object.values(WHERE_TO_PRINT.geo)
		.map(link => getIdFromUrl(link))
		.forEach(id => {
			SpreadsheetApp.openById(id)
				.getSheets()
				.filter(sheet => sheet.getName().includes('T:'))
				.forEach(sheet => {
					sheet
						.getRange('A3:E')
						.clearContent()
						.getSheet()
						.getRange('A1:BJ2')
						.setBackground('#34a853');

					const tittle = sheet.getRange('AT1');
					const old = tittle.getValue();
					tittle.setValue(old.replace('modyfikacja', 'odczyt'));
				});
		});

/**
 * Pobiera określoną liczbę wpisów ze wskazanego arkusza
 * @param {string} geo Skąd ma wziąć dane - 'ext', 'loc', 'hub'
 * @param {number} quant Liczba wierszy
 * @param {boolean} [sort] Czy sortować indeksy
 * @return {(sheetCode: string) => function} sheetCode - Zdefiniowany kod zadania np. l100
 */
const getEntries = (geo, quant, sort = false) => sheetCode => () => {
	const sheet = getProperSheet(geo, sheetCode);

	const maxIdx = getNumbFromStr(sheetCode) - 1;
	const idxs = randomIntegersArray(quant, 0, maxIdx, true, false, sort);

	idxs.forEach(idx => {
		const range = `A${idx + 1}:O${idx + 1}`;
		const vals = sheet.getRange(range).getValues();
		console.log(
			`Geo: ${geo}. Quant: ${quant}. SheetCode: ${sheetCode}. Range: ${range} | First cell: ${vals[0][0]} `
		);
	});
};

const tasks = {
	/* External */
	ext1: getEntries('ext', 1),
	ext5: getEntries('ext', 5),
	ext10: getEntries('ext', 10),
	ext25: getEntries('ext', 25),
	ext50: getEntries('ext', 50),
	ext100: getEntries('ext', 100),

	/* Local */
	loc1: getEntries('loc', 1),
	loc5: getEntries('loc', 5),
	loc10: getEntries('loc', 10),
	loc25: getEntries('loc', 25),
	loc50: getEntries('loc', 50),
	loc100: getEntries('loc', 100),

	/* Hub */
	hub1: getEntries('hub', 1),
	hub5: getEntries('hub', 5),
	hub10: getEntries('hub', 10),
	hub25: getEntries('hub', 25),
	hub50: getEntries('hub', 50),
	hub100: getEntries('hub', 100),
};

export { tasks, deleteOldDate };
