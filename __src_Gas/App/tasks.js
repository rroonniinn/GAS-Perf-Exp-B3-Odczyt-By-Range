/* eslint-disable max-params */

import { getSheet } from '../../../GAS | Library/v02/gas/getSheet';
import { getIdFromUrl } from '../../../GAS | Library/v02/gas/getIdFromUrl';
import { randomIntegersArray } from '../../../GAS | Library/v02/arr/randomIntegersArray';
import { randomInteger } from '../../../GAS | Library/v02/num/randomInteger';

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
 * Pobiera losowy zakres zawierający wskazaną liczbę wpisów wierszy
 * ze wskazanego arkusza
 * @param {string} geo Skąd ma wziąć dane - 'ext', 'loc', 'hub'
 * @param {number} quant Liczba wierszy w zakesie
 * @param {boolean} [sort] Czy sortować indeksy
 * @return {(sheetCode: string) => function} sheetCode - Zdefiniowany kod zadania np. l100
 */
const getRange = (geo, quant) => sheetCode => () => {
	const sheet = getProperSheet(geo, sheetCode);

	const maxEndRow = getNumbFromStr(sheetCode); // maksymalny zakres dostępny w arkuszu
	const maxStartRow = maxEndRow - quant + 1; // maksymalny start zakresu

	// const maxIdx = getNumbFromStr(sheetCode) - 1;
	// const idxs = randomIntegersArray(quant, 0, maxIdx, true, false, sort);

	const rangeStart = randomInteger(1, maxStartRow);
	const range = `A${rangeStart}:O${rangeStart + quant - 1}`;
	const vals = sheet.getRange(range).getValues();

	console.log(
		`Geo: ${geo}. Quant: ${quant}. SheetCode: ${sheetCode}. Range: ${range} | First cell: ${vals[0][0]} `
	);
	// idxs.forEach(idx => {
	// 	const range = `A${idx + 1}:O${idx + 1}`;
	// 	const vals = sheet.getRange(range).getValues();
	// 	console.log(
	// 		`Geo: ${geo}. Quant: ${quant}. SheetCode: ${sheetCode}. Range: ${range} | First cell: ${vals[0][0]} `
	// 	);
	// });
};

const tasks = {
	/* External */
	ext1: getRange('ext', 1),
	ext5: getRange('ext', 5),
	ext10: getRange('ext', 10),
	ext25: getRange('ext', 25),
	ext50: getRange('ext', 50),
	ext100: getRange('ext', 100),

	/* Local */
	loc1: getRange('loc', 1),
	loc5: getRange('loc', 5),
	loc10: getRange('loc', 10),
	loc25: getRange('loc', 25),
	loc50: getRange('loc', 50),
	loc100: getRange('loc', 100),

	/* Hub */
	hub1: getRange('hub', 1),
	hub5: getRange('hub', 5),
	hub10: getRange('hub', 10),
	hub25: getRange('hub', 25),
	hub50: getRange('hub', 50),
	hub100: getRange('hub', 100),
};

export { tasks };
