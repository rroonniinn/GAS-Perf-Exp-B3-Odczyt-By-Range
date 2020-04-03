import { randomInteger } from '../../../GAS | Library/v02/num/randomInteger';

import { getProperSheet, getNumbFromStr } from './helpers';

/**
 * Pobiera losowy zakres zawierający wskazaną liczbę wpisów wierszy
 * ze wskazanego arkusza
 * @param {string} geo Skąd ma wziąć dane - 'ext', 'loc', 'hub'
 * @param {number} quant Liczba wierszy w zakesie
 * @return {(sheetCode: string) => function} sheetCode - Zdefiniowany kod zadania np. l100
 */
const getRange = (geo, quant) => sheetCode => () => {
	const sheet = getProperSheet(geo, sheetCode);

	const maxEndRow = getNumbFromStr(sheetCode); // maksymalny zakres dostępny w arkuszu
	const maxStartRow = maxEndRow - quant + 1; // maksymalny start zakresu

	const rangeStart = randomInteger(1, maxStartRow);
	const range = `A${rangeStart}:O${rangeStart + quant - 1}`;
	const vals = sheet.getRange(range).getValues();

	console.log(
		`Geo: ${geo}. Quant: ${quant}. SheetCode: ${sheetCode}. Range: ${range} | First cell: ${vals[0][0]} `
	);
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
