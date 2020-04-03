import {
	startMinuteTrigger,
	cancelTimeTriggers,
} from '../../../GAS | Library/v01/gas/timeTriggers';

import { randomExternal, randomLocal, randomHub } from './experiments';

// Funkcja do trigerów co minutę
// @ts-ignore
global.randomExternal = randomExternal;
// @ts-ignore
global.randomLocal = randomLocal;
// @ts-ignore
global.randomHub = randomHub;

// @ts-ignore
global.menu = {
	test: () => console.log('test'),

	triggers: {
		ext: () => startMinuteTrigger('randomExternal', 1),
		loc: () => startMinuteTrigger('randomLocal', 1),
		hub: () => startMinuteTrigger('randomHub', 1),
		stop: cancelTimeTriggers,
	},
};

const menu = () => {
	const ui = SpreadsheetApp.getUi();
	ui.createMenu('ICON')
		.addSubMenu(
			ui
				.createMenu('Test funkcji do odpalenia automatycznego')
				.addItem('Test : randomLocal', 'randomLocal')
				.addItem('Test : randomExternal', 'randomExternal')
				.addItem('Test : randomHub', 'randomHub')
		)

		.addSeparator()
		.addItem(
			'Uruchom Trigger dla Random External',
			'menu.triggers.ext'
		)
		.addItem('Uruchom Trigger dla Random Local', 'menu.triggers.loc')
		.addItem('Uruchom Trigger dla Random Hub', 'menu.triggers.hub')
		.addSeparator()
		.addItem('Zatrzymaj triggery', 'menu.triggers.stop')
		.addSeparator()
		.addSubMenu(
			ui
				.createMenu('DEV')
				.addItem('Test', 'menu.test')
				.addItem('Update menu', 'onOpen')
		)

		.addToUi();
};

export { menu };
