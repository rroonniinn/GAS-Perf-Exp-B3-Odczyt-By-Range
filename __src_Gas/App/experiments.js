/* eslint-disable max-params */

import { randomFromArray } from '../../../GAS | Library/v02/arr/randomFromArray';

import { single } from './helpers';
import { tasks } from './tasks';

/* ******************** TESTY POJEDYŃCZE *********** */
const randomCode = [
	'l100',
	'l200',
	'l500',
	'l1000',
	'l2000',
	'l4000',
	'l8000',
	'l16000',
];
// Nadanie nazw funkcjom:

const randomFnExt = [
	['ext1', tasks.ext1],
	['ext5', tasks.ext5],
	['ext10', tasks.ext10],
	['ext25', tasks.ext25],
	['ext50', tasks.ext50],
	['ext100', tasks.ext100],
];
const randomFnLoc = [
	['loc1', tasks.loc1],
	['loc5', tasks.loc5],
	['loc10', tasks.loc10],
	['loc25', tasks.loc25],
	['loc50', tasks.loc50],
	['loc100', tasks.loc100],
];
const randomFnHub = [
	['hub1', tasks.hub1],
	['hub5', tasks.hub5],
	['hub10', tasks.hub10],
	['hub25', tasks.hub25],
	['hub50', tasks.hub50],
	['hub100', tasks.hub100],
];

const runRandomSingle = geoSet => () => {
	const [code] = randomFromArray(randomCode, 1);
	const [fn] = randomFromArray(geoSet, 1);
	// console.log(`Arkusz: ${code} | Liczba modyfikacji: ${fn[0]}`);

	single(code, fn);
};

const randomExternal = runRandomSingle(randomFnExt);
const randomLocal = runRandomSingle(randomFnLoc);
const randomHub = runRandomSingle(randomFnHub);

export { randomExternal, randomLocal, randomHub };
