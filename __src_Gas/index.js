/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */
/* eslint-disable max-params */

/**
 * @typedef {import('./../../../../00. My Library/v02/experiments/types').ExpSheet} ExpSheet
 * @typedef {import('./../../../../00. My Library/v02/experiments/types').ExpTasks} ExpTasks
 * @typedef {import('./../../../../00. My Library/v02/gas/styleSheet').RangeOptions} RangeOptions
 */

import { setMenu } from '../../../../00. My Library/v02/gas/setMenu';
import { getProperSheet } from '../../../../00. My Library/v02/experiments/getProperSheet';
import { runRandom } from '../../../../00. My Library/v02/experiments/runRandom';
import { buildStructure } from '../../../../00. My Library/v02/experiments/buildStructure';
import { randomInteger } from '../../../../00. My Library/v02/num/randomInteger';
import {
	setEveryMin,
	stopTimeTriggers,
} from '../../../../00. My Library/v01/gas/timeTriggers';

import { EXP_SETUP } from './config';

/**
 * * Helper
 * Funkcja oczekująca tablicy funkcji z których będzie losowała te, które
 * mają właśnie się odpalić. Załadowany jest już do niej plik configu
 * @type {(arr: [string, function, string][]) => void}
 */

const go = runRandom(EXP_SETUP);

/* ******************************* ZADANIA ******************************** */

/**
 * Pobiera losowy zakres zawierający wskazaną liczbę wpisów wierszy
 * ze wskazanego arkusza
 * @param {'ext'|'loc'|'hub'} geo Strukura danych do pobrania
 * @param {number} quant Liczba modyfikacji
 * @return {(target: ExpSheet) => any} target Np. target1 czy target2
 */

const getRange = (geo, quant) => target => {
	const sheet = getProperSheet(geo, target, EXP_SETUP);

	const maxEndRow = target.size; // maksymalny zakres dostępny w arkuszu
	const maxStartRow = maxEndRow - quant + 1; // maksymalny start zakresu

	const rangeStart = randomInteger(1, maxStartRow);
	const range = `A${rangeStart}:O${rangeStart + quant - 1}`;
	const vals = sheet.getRange(range).getValues();

	console.log(
		`Type: ${geo.toUpperCase()}. Target: ${
			target.printName
		}. Get from range starts at: ${rangeStart} '${
			target.printName
		}'. Total rows: '${quant}'. First cell: ${vals[0][0]}`
	);
};

/* **************************** SETUP EXPERYMENTU ************************ */

// @ts-ignore
global.exp = {
	// Sety funkcji do losowania
	loc: go([
		['loc', getRange('loc', 1), 'a'],
		['loc', getRange('loc', 5), 'b'],
		['loc', getRange('loc', 10), 'c'],
		['loc', getRange('loc', 25), 'd'],
		['loc', getRange('loc', 50), 'e'],
		['loc', getRange('loc', 100), 'f'],
	]),
	hub: go([
		['hub', getRange('hub', 1), 'a'],
		['hub', getRange('hub', 5), 'b'],
		['hub', getRange('hub', 10), 'c'],
		['hub', getRange('hub', 25), 'd'],
		['hub', getRange('hub', 50), 'e'],
		['hub', getRange('hub', 100), 'f'],
	]),
	ext: go([
		['ext', getRange('ext', 1), 'a'],
		['ext', getRange('ext', 5), 'b'],
		['ext', getRange('ext', 10), 'c'],
		['ext', getRange('ext', 25), 'd'],
		['ext', getRange('ext', 50), 'e'],
		['ext', getRange('ext', 100), 'f'],
	]),
};

// @ts-ignore
global.utils = {
	buildStructure: () => buildStructure(EXP_SETUP),
	triggersFire: () => {
		setEveryMin('exp.loc', 1);
		setEveryMin('exp.hub', 1);
		setEveryMin('exp.ext', 1);
	},
	triggersStop: stopTimeTriggers,
};

const menuElements = [
	['Zbuduj / zresetuj strukturę plików', 'utils.buildStructure'],
	[
		'Przetestuj funkcje',
		['Local', 'exp.loc'],
		['Hub', 'exp.hub'],
		['External', 'exp.ext'],
	],
	'-------------------',
	['Uruchom eksperyment', 'utils.triggersFire'],
	['Zatrzymaj eksperyment', 'utils.triggersStop'],
	'-------------------',
	['Update menu', 'onOpen'],
];

// @ts-ignore
global.onOpen = () => {
	setMenu(menuElements, 'ICON', true);
};

export { getRange };
