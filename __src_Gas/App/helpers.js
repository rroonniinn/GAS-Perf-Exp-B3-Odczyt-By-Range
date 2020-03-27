/* eslint-disable max-params */
import { performanceCheckerObj } from '../../../GAS | Library/v01/utils/performanceCheckerObj';
import { paste } from '../../../GAS | Library/v02/gas/paste';
import { getSheet } from '../../../GAS | Library/v02/gas/getSheet';
import { getIdFromUrl } from '../../../GAS | Library/v02/gas/getIdFromUrl';

import { SHORT_DSC, LONG_DESC, WHERE_TO_PRINT } from './config';

/* ***************** Helpers ******************* */

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
		WHERE_TO_PRINT.entries[entriesCode],
		getIdFromUrl(WHERE_TO_PRINT.geo[geoCode])
	)();
};

export { single };
