/**
 * Kolory eksperymentu
 */
const colors = {
	light: '#34a853',
	dark: '#1f8b3c',
	accent: '#ffff00',
};

/**
 * Ustawienie całego eksperymentu
 * @type {import('../../GAS | Library/v02/experiments/types').ExpSetup} EXP_SETUP
 */

const EXP_SETUP = {
	title: 'Odczyt : By Range : 1 min',
	method: 'Single Random',
	structure: {
		fixed: 'col',
		fixedSize: 15,
		randomData: true,
	},
	samples: {
		s1: 100,
		s2: 200,
		s3: 500,
		s4: 1000,
		s5: 2000,
		s6: 4000,
		s7: 8000,
		s8: 16000,
	},
	results: {
		loc: {
			prefix: 'A',
			name: 'Local',
			colorLight: colors.light,
			colorDark: colors.dark,
			accentColor: colors.accent,
			sheetsMeaning: {
				a: '1 row',
				b: '5 rows',
				c: '10 rows',
				d: '25 rows',
				e: '50 rows',
				f: '100 rows',
			},
		},
		hub: {
			prefix: 'B',
			name: 'Hub',
			colorLight: colors.light,
			colorDark: colors.dark,
			accentColor: colors.accent,
			sheetsMeaning: {
				a: '1 row',
				b: '5 rows',
				c: '10 rows',
				d: '25 rows',
				e: '50 rows',
				f: '100 rows',
			},
		},
		ext: {
			prefix: 'C',
			name: 'External',
			colorLight: colors.light,
			colorDark: colors.dark,
			accentColor: colors.accent,
			sheetsMeaning: {
				a: '1 row',
				b: '5 rows',
				c: '10 rows',
				d: '25 rows',
				e: '50 rows',
				f: '100 rows',
			},
		},
	},
	misc: {
		resultsTemplate:
			'https://docs.google.com/spreadsheets/d/139mlb1yO8e_T8Bs25yX5kTiHaCvSNRuQf8RRyH2WpTg/edit#gid=1941260253',
		printToSubname: 'Wyniki',
		dataFolder: '_Pliki',
		externalsSheetName: 'Dane',
		externalsPrefix: 'file',
		scriptFileSufix: 'Skrypt + Local',
		hubName: 'externalHub',
		dashboardName: 'Dashboard',
		dashboardMainSheet: 'Dashboard',
		dashboardDataSheet: 'h_dropData',
		dashboardTemplate:
			'https://docs.google.com/spreadsheets/d/1uPhrwk4YD0-7ZXDVdKKUZ5ACjk-WCfbhBBqIAe4SiUI/edit#gid=880283590',
		dashboardColor: colors.light,
	},
};

export { EXP_SETUP };
