/* eslint-disable max-params */
import { performanceCheckerObj } from '../../../GAS | Library/v01/utils/performanceCheckerObj';
import { paste } from '../../../GAS | Library/v02/gas/paste';
import { getSheet } from '../../../GAS | Library/v02/gas/getSheet';
import { getIdFromUrl } from '../../../GAS | Library/v02/gas/getIdFromUrl';

import {
	SHORT_DSC,
	LONG_DESC,
	WHERE_TO_PRINT,
	EXT_SHEET_URL,
	EXT_SHEET_NAME,
	HUB_URL,
} from './config';

/**
 * @type {array[]} Docelowa tablica na dane z czasami wykonywania funkcji
 */
const loggerRes = [];

/**
 * Wkleja tablicę z czasami do wskazanego arkusza
 * @param {string} sheet
 * @param {string} [id]
 */

const printTimes = (sheet, id) => () =>
	paste(getSheet(sheet, id), 'A', loggerRes, {
		notRemoveFilers: true,
		restrictCleanup: 'preserve',
	});

/**
 * Podstawowa funkcja "single". Wykonuje się i zapisuje czas w pliku
 *
 * @param {string} taskCode Kod zadania - np l100
 * @param {array} callbackName i callback Nazwa i sama testowana funkcja
 */

const single = (taskCode, [callbackName, callback]) => {
	performanceCheckerObj(
		loggerRes,
		callback(taskCode),
		SHORT_DSC[taskCode],
		LONG_DESC[callbackName],
		'Single Random'
	);
	const geoCode = /[a-z]+/.exec(callbackName)[0];
	const entriesCode = `e${/[0-9]+/.exec(callbackName)[0]}`;

	printTimes(
		WHERE_TO_PRINT.sheets[entriesCode],
		getIdFromUrl(WHERE_TO_PRINT.geo[geoCode])
	)();
};

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

export { single, getProperSheet, getNumbFromStr };
