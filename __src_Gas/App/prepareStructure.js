/* eslint-disable max-nested-callbacks */
/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */
import { createFolder } from '../../../GAS | Library/v01/gas/createFolder';
import { getIdFromUrl } from '../../../GAS | Library/v02/gas/getIdFromUrl';
import { copyFile } from '../../../GAS | Library/v01/gas/copyFile';
import { getFiles } from '../../../GAS | Library/v01/gas/getFiles';
import { getFolders } from '../../../GAS | Library/v01/gas/getFolders';
import { getSheet } from '../../../GAS | Library/v02/gas/getSheet';
import { disp } from '../../../GAS | Library/v01/gas/disp';
import { letterToColumn } from '../../../GAS | Library/v01/gas/letterToColumn';
import { columnToLetter } from '../../../GAS | Library/v01/gas/columnToLetter';
import { copySheetsToOther } from '../../../GAS | Library/v02/gas/copySheetsToOther';

import { WHERE_TO_PRINT } from './config';

// Helper
const shorter = {
	External: 'ext',
	Local: 'loc',
	Hub: 'hub',
};
const longer = {
	ext: 'External',
	loc: 'Local',
	hub: 'Hub',
};

/* ************************ TEMPLATY  ************************** */

// URL z plikami do eksperymentów External
const EXT_FILES =
	'https://drive.google.com/drive/folders/1IjAM_9_Vas3KjUOOIlDNXnRHmfrtdrLB';

// URL z plikami do eksperymentów Hub
const HUB_FILES =
	'https://drive.google.com/drive/folders/15MVQPjdUC3nuiZbT1-NQHAb-cW_owqFL';

// URL z templatem pliku do którego wklejamy dane
const fileToPrintTemplate =
	'https://docs.google.com/spreadsheets/d/1qzjglCx1JvaRjntAHZ-NnQz7I09bea1oGoPrwVpDAcw/edit#gid=1387586056';

// Nazwa z podfolderem dla plików do zadań
const SUB_DIR_NAME = '_Pliki do zadań';

/* ******************* INDYWIDUALNE DLA EKSPERYMENTU  ****************** */

// URL z głownym katalogiem dla określonego eksperymentu
const EXPERIMENT_DIR =
	'https://drive.google.com/drive/folders/1bRrTHHx6rx8kfV0nQZsyfn77kFlku0OU';

// Typ eksperymentu:
const EXP_NAME = 'Odczyt';

// Rodzaj eksperymentu
const PREFIX = 'By Range';

/**
 * Struktura plików
 * Drugi parametr - czy tworzyć podkatalog na pliki
 * @type {array[]}
 */
const DIRS = [
	[`01. ${PREFIX} : External`, true],
	[`02. ${PREFIX} : Local`, false],
	[`03. ${PREFIX} : Hub`, true],
];

// Kolor nagłówka
const HEADER_COL = '#56a834';

// Tytuł do headerów
const TITLE = 'odczyt niezależnych zakresów';

// Tytuł do headerów dla indywidualnych wyników
const getTittle = quant =>
	quant === 1 ? 'wiersz w zakresie' : 'wierszy w zakresie';

/* ******************* FUNKCJE  ****************** */

/**
 * Krok 1
 * Tworzy katalogi (wraz z podkatalogami)
 */
const createFolderStructure = () =>
	DIRS.forEach(([dirName, createSub]) => {
		const newDir = createFolder(getIdFromUrl(EXPERIMENT_DIR), dirName);
		if (createSub) {
			createFolder(newDir, SUB_DIR_NAME);
		}
	});

/**
 * Krok 2
 * Kopuje do struktury pliki z testowymi danymi
 * dla external i hub. Zwraca w kosoli URLe do
 * wklejenia do configu
 */

const createFilesForExt = () => {
	/*  Externals  */

	// Pobierz id folderu dla External
	const [[extDataFolder]] = getFolders(
		getIdFromUrl(EXPERIMENT_DIR),
		'title contains "External"'
	)
		.map(folder => folder.getId())
		.map(folderId => getFolders(folderId).map(files => files.getId()));

	// Skopuj pliki z templatu do właściwego katalogu:
	getFiles(getIdFromUrl(EXT_FILES))
		.map(file => [file.getId(), file.getName()])
		.forEach(([fileId, name]) => {
			copyFile(extDataFolder, name, fileId);
		});

	// Pobierz adresy do plików dla eksperymentów ext
	const extUrls = getFiles(extDataFolder)
		.map(file => [file.getName().replace('res', 'l'), file.getUrl()])
		.reduce((obj, [name, url]) => {
			obj[name] = url;
			return obj;
		}, {});

	console.log('EXT_SHEET_URL', extUrls); // Docelowy obiekt wkleja do konsoli

	/* Hub */

	// Pobierz id folderu dla Hub
	const [[hubDataFolder]] = getFolders(
		getIdFromUrl(EXPERIMENT_DIR),
		'title contains "Hub"'
	)
		.map(folder => folder.getId())
		.map(folderId => getFolders(folderId).map(files => files.getId()));

	// Skopuj pliki z templatu do właściwego katalogu:
	getFiles(getIdFromUrl(HUB_FILES))
		.map(file => [file.getId(), file.getName()])
		.forEach(([fileId, name]) => {
			copyFile(hubDataFolder, name, fileId);
		});

	const [hubUrl] = getFiles(hubDataFolder).map(file => file.getUrl());

	console.log('HUB_URL', hubUrl); // Docelowy url
};

/**
 * Krok 3
 * Kopuje, zmienia kolor tła oraz zwraca URLe (w konsoli)
 * dla plików do których eksperyment wkleja wyniki / czasy
 */

const createWhereToPrintFiles = () => {
	const result = {};
	getFolders(getIdFromUrl(EXPERIMENT_DIR)).forEach(folder => {
		const folderName = folder.getName();
		const folderType = /\w+$/.exec(folderName)[0];
		const fileId = copyFile(
			folder.getId(),
			`${EXP_NAME} : ${PREFIX} - ${folderType} `,
			getIdFromUrl(fileToPrintTemplate)
		);

		getSheet('Wyniki', fileId)
			.getRange('A1')
			.setBackground(HEADER_COL)
			.setValue(`${folderType} - ${TITLE}`)
			.getSheet()
			.getParent()
			.getSheets()
			.filter(sheet => sheet.getName() !== 'Wyniki')
			.forEach(sheet =>
				sheet.getRange('A1:BJ2').setBackground(HEADER_COL)
			);

		result[shorter[folderType]] = SpreadsheetApp.openById(
			fileId
		).getUrl();
	});

	console.log(result);
};

const setTitle = () => {
	// File
	const fileUrl =
		'https://docs.google.com/spreadsheets/d/1EsvH17ViVMMrCBTAhX_FwdpslwxQnDzWT0Dci8_HcHE/edit#gid=717913167';

	const [[geo]] = Object.entries(WHERE_TO_PRINT.geo).filter(
		([, url]) => getIdFromUrl(url) === getIdFromUrl(fileUrl)
	);

	const allSheets = SpreadsheetApp.openByUrl(fileUrl).getSheets();

	allSheets
		.filter(sheet => sheet.getName().includes('T: '))
		.forEach(sheet => {
			/* 1. Zmiana tytułów */

			const quant = Number(/\d+/.exec(sheet.getName())[0]);
			const desc = `${EXP_NAME} : ${PREFIX} : ${
				longer[geo]
			} : ${quant} ${getTittle(quant)}`;

			sheet.getRange('AT1').setValue(desc);

			/* 2. Dodanie Mediany */
			const medianaMissing =
				sheet.getRange('BA6').getValue() !== 'Med';

			if (medianaMissing) {
				sheet
					.insertColumnAfter(letterToColumn('AZ'))
					.getRange('BA7:BA14')
					.setFormulas([
						['=MEDIAN(G3:G)'],
						['=MEDIAN(L3:L)'],
						['=MEDIAN(Q3:Q)'],
						['=MEDIAN(V3:V)'],
						['=MEDIAN(AA3:AA)'],
						['=MEDIAN(AF3:AF)'],
						['=MEDIAN(AK3:AK)'],
						['=MEDIAN(AP3:AP)'],
					])
					.getSheet()
					.getRange('AU5')
					.clearFormat()
					.getSheet()
					.getRange('BA7:BA13')
					.setBorder(
						null,
						null,
						true,
						null,
						null,
						true,
						'black',
						SpreadsheetApp.BorderStyle.DASHED
					)
					.getSheet()
					.getRange('BA6')
					.setValue('Med')
					.setBorder(
						null,
						null,
						true,
						null,
						null,
						true,
						'black',
						SpreadsheetApp.BorderStyle.SOLID_MEDIUM
					)
					.getSheet()
					.getRange('AU5:BA5')
					.setFontFamily('Roboto Condensed')
					.setBackground('#ffe599')
					.setBorder(
						true,
						null,
						true,
						null,
						null,
						true,
						'black',
						SpreadsheetApp.BorderStyle.SOLID
					)
					.setVerticalAlignment('middle')
					.mergeAcross()
					.getSheet()
					.getRange('AW:BA')
					.setHorizontalAlignment('center');
			}

			/* 3. Ustawienie szerokości kolumn i wyrównania */

			sheet
				.setColumnWidths(letterToColumn('AU'), 2, 120)
				.setColumnWidths(letterToColumn('AW'), 9, 60)
				.setColumnWidths(letterToColumn('BB'), 1, 30);

			/* 3. Modyfikuje wykres podstawowy */

			const allCharts = sheet
				.getCharts()
				.map(chart =>
					columnToLetter(
						chart.getContainerInfo().getAnchorColumn()
					)
				);

			const [mainChart] = sheet
				.getCharts()
				.filter(
					chart =>
						columnToLetter(
							chart.getContainerInfo().getAnchorColumn()
						) === 'AU'
				);

			if (mainChart) {
				const newMainChart = mainChart
					.modify()
					.setChartType(Charts.ChartType.LINE)
					// .setOption('curveType', 'function')
					.addRange(sheet.getRange('AU6:AU14'))
					.addRange(sheet.getRange('AX6:AX14'))
					.addRange(sheet.getRange('BA6:BA14'))
					// Font dla wszystkich elementów
					.setOption('fontName', 'Roboto Condensed')
					.setOption('series', {
						0: {
							type: 'line',
							color: '#4285f4',
							curveType: 'function',
							lineWidth: 4,
							pointSize: 7,
							dataLabel: 'value',
							dataLabelPlacement: 'above',
							annotations: {
								textStyle: {
									color: '#4285f4',
									fontSize: 12,
									fontName: 'Roboto Condensed',
								},
								stem: { color: '#4285f4' },
							},
							pointShape: 'circle',
						},
						1: {
							type: 'line',
							color: '#ea4335',
							curveType: 'function',
							lineWidth: 4,
							pointSize: 7,
							dataLabel: 'value',
							dataLabelPlacement: 'below',
							annotations: {
								textStyle: {
									color: '#ea4335',
									fontSize: 12,
									fontName: 'Roboto Condensed',
								},
								stem: { color: '#ea4335' },
							},
						},
					})
					.setOption('vAxes', {
						0: {
							textStyle: { color: 'black', fontSize: 12 },
						},
					})
					.setOption('vAxis', {
						fontName: 'Roboto Condensed',
						textStyle: {
							color: 'black',
							fontSize: 12,
						},
					})
					.setOption('title', 'Czas Średnia vs Mediana')
					.setOption('titleTextStyle', {
						color: '#434343',
						fontSize: 16,
						bold: false,
						italic: false,
					})
					.setOption('width', 759)
					.setOption('height', 300)
					.setPosition(16, letterToColumn('AU'), 0, 0)
					.build();

				sheet.updateChart(newMainChart);
			} else {
				console.log(allCharts);
			}
		});

	/**
	 * Kopiuj rozkład dniowy i wyniki z templatu
	 */

	// copySheetsToOther(
	// 	'1qzjglCx1JvaRjntAHZ-NnQz7I09bea1oGoPrwVpDAcw',
	// 	getIdFromUrl(fileUrl),
	// 	sheet => !sheet.getName().includes('T:')
	// );

	/**
	 * Modyfikacja ekranu z posdumowanniem
	 */

	// const [summaryAvg] = allSheets.filter(
	// 	sheet => sheet.getName() === 'Wyniki'
	// );

	// const avgMissing = summaryAvg.getRange('J3').getValue() !== 'Avg';

	// if (avgMissing) {
	// 	summaryAvg
	// 		.insertColumnAfter(letterToColumn('I'))
	// 		.getRange('J3:J11')
	// 		.setFormulas([
	// 			['="Avg"'],
	// 			['=AVERAGE(D4:I4)'],
	// 			['=AVERAGE(D5:I5)'],
	// 			['=AVERAGE(D6:I6)'],
	// 			['=AVERAGE(D7:I7)'],
	// 			['=AVERAGE(D8:I8)'],
	// 			['=AVERAGE(D9:I9)'],
	// 			['=AVERAGE(D10:I10)'],
	// 			['=AVERAGE(D11:I11)'],
	// 		])
	// 		.setBorder(
	// 			null,
	// 			null,
	// 			true,
	// 			null,
	// 			null,
	// 			true,
	// 			'#999999',
	// 			SpreadsheetApp.BorderStyle.SOLID
	// 		)
	// 		.getSheet()
	// 		.getRange('J3')
	// 		.setBorder(
	// 			null,
	// 			null,
	// 			true,
	// 			null,
	// 			null,
	// 			true,
	// 			'black',
	// 			SpreadsheetApp.BorderStyle.SOLID_MEDIUM
	// 		)
	// 		.getSheet()
	// 		.getRange('J11')
	// 		.setBorder(
	// 			null,
	// 			null,
	// 			true,
	// 			null,
	// 			null,
	// 			true,
	// 			'black',
	// 			SpreadsheetApp.BorderStyle.SOLID_MEDIUM
	// 		)
	// 		.getSheet()
	// 		.getRange('J3:J12')
	// 		.setBorder(
	// 			null,
	// 			true,
	// 			null,
	// 			null,
	// 			null,
	// 			null,
	// 			'black',
	// 			SpreadsheetApp.BorderStyle.DOTTED
	// 		)
	// 		.getSheet()
	// 		.getRange('J12')
	// 		.setFormulas([['=AVERAGEA(D4:I11)']])
	// 		.getSheet();

	// 	summaryAvg.getRange('L19').clearContent();
	// 	summaryAvg
	// 		.getRange('K19')
	// 		.setFormula(
	// 			'={"Średnia";ArrayFormula(IF(A20:A<>"";(C20:C+D20:D+E20:E+F20:F+G20:G+H20:H+I20:I)/8;))}'
	// 		);
	// }

	// /* Dodanie formatowania warunkowego */

	// const range = summaryAvg.getRange('D4:I11');
	// const rule = SpreadsheetApp.newConditionalFormatRule()
	// 	.setGradientMaxpointWithValue(
	// 		'#ea4335',
	// 		SpreadsheetApp.InterpolationType.PERCENT,
	// 		'100'
	// 	)
	// 	.setGradientMidpointWithValue(
	// 		'#ffffff',
	// 		SpreadsheetApp.InterpolationType.PERCENT,
	// 		'50'
	// 	)
	// 	.setGradientMinpointWithValue(
	// 		'#34a853',
	// 		SpreadsheetApp.InterpolationType.PERCENT,
	// 		'0'
	// 	)
	// 	.setRanges([range])
	// 	.build();

	// const rules = summaryAvg.getConditionalFormatRules();
	// rules.push(rule);
	// summaryAvg.setConditionalFormatRules(rules);

	// summaryAvg
	// 	.getRange('D4:I11')
	// 	.setBorder(null, null, null, null, false, false);

	// /* Przygotowanie arkusza dla wyników Med */

	// if (!allSheets.find(sheet => sheet.getName() === 'Wyniki Med')) {
	// 	summaryAvg.activate();
	// 	summaryAvg
	// 		.getParent()
	// 		.duplicateActiveSheet()
	// 		.setName('Wyniki Med');
	// }

	// const [summaryMed] = allSheets.filter(
	// 	sheet => sheet.getName() === 'Wyniki Med'
	// );

	// summaryMed
	// 	.getRange('D4:I4')
	// 	.setFormulas([
	// 		[
	// 			"=ArrayFormula(VLOOKUP($C$4:$C$11;'T: 1'!$AU$7:$BA$14;7;0))",
	// 			"=ArrayFormula(VLOOKUP($C$4:$C$11;'T: 5'!$AU$7:$BA$14;7;0))",
	// 			"=ArrayFormula(VLOOKUP($C$4:$C$11;'T: 10'!$AU$7:$BA$14;7;0))",
	// 			"=ArrayFormula(VLOOKUP($C$4:$C$11;'T: 25'!$AU$7:$BA$14;7;0))",
	// 			"=ArrayFormula(VLOOKUP($C$4:$C$11;'T: 50'!$AU$7:$BA$14;7;0))",
	// 			"=ArrayFormula(VLOOKUP($C$4:$C$11;'T: 100'!$AU$7:$BA$14;7;0))",
	// 		],
	// 	]);

	// /**
	//  * Wstawienie wykresu
	//  */

	// const chartA = summaryMed
	// 	.newChart()
	// 	.setChartType(Charts.ChartType.LINE)
	// 	.addRange(summaryMed.getRange('D3:I3'))
	// 	.addRange(summaryMed.getRange('D12:I12'))
	// 	.setTransposeRowsAndColumns(true)
	// 	.setPosition(14, letterToColumn('C'), 0, 0)
	// 	.setOption(
	// 		'title',
	// 		'Średni czas operacji (liczba wierszy w zakresie) '
	// 	)
	// 	.setOption('titleTextStyle', {
	// 		color: '#434343',
	// 		fontSize: 16,
	// 		bold: false,
	// 		italic: false,
	// 	})
	// 	.setOption('width', 570)
	// 	.setOption('height', 300)
	// 	.setOption('fontName', 'Roboto Condensed')
	// 	.setOption('series', {
	// 		0: {
	// 			type: 'line',
	// 			color: '#4285f4',
	// 			curveType: 'function',
	// 			lineWidth: 4,
	// 			pointSize: 7,
	// 			dataLabel: 'value',
	// 			dataLabelPlacement: 'above',
	// 			annotations: {
	// 				textStyle: {
	// 					color: '#4285f4',
	// 					fontSize: 12,
	// 					fontName: 'Roboto Condensed',
	// 				},
	// 				stem: { color: '#4285f4' },
	// 			},
	// 			pointShape: 'circle',
	// 		},
	// 	})
	// 	.build();

	// summaryMed.insertChart(chartA);

	// const chartB = summaryMed
	// 	.newChart()
	// 	.setChartType(Charts.ChartType.LINE)
	// 	.addRange(summaryMed.getRange('C4:C11'))
	// 	.addRange(summaryMed.getRange('J4:J11'))
	// 	.setTransposeRowsAndColumns(false)
	// 	.setPosition(14, letterToColumn('L'), 0, 0)
	// 	.setOption('title', 'Średni czas operacji (wielkość arkusza) ')
	// 	.setOption('titleTextStyle', {
	// 		color: '#434343',
	// 		fontSize: 16,
	// 		bold: false,
	// 		italic: false,
	// 	})
	// 	.setOption('width', 570)
	// 	.setOption('height', 300)
	// 	.setOption('fontName', 'Roboto Condensed')
	// 	.setOption('series', {
	// 		0: {
	// 			type: 'line',
	// 			color: '#4285f4',
	// 			curveType: 'function',
	// 			lineWidth: 4,
	// 			pointSize: 7,
	// 			dataLabel: 'value',
	// 			dataLabelPlacement: 'above',
	// 			annotations: {
	// 				textStyle: {
	// 					color: '#4285f4',
	// 					fontSize: 12,
	// 					fontName: 'Roboto Condensed',
	// 				},
	// 				stem: { color: '#4285f4' },
	// 			},
	// 			pointShape: 'circle',
	// 		},
	// 	})
	// 	.build();

	// summaryMed.insertChart(chartB);
};

export {
	createFolderStructure,
	createFilesForExt,
	createWhereToPrintFiles,
	setTitle,
};
