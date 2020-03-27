import { createFolder } from '../../../GAS | Library/v01/gas/createFolder';
import { getIdFromUrl } from '../../../GAS | Library/v02/gas/getIdFromUrl';
import { copyFile } from '../../../GAS | Library/v01/gas/copyFile';
import { getFiles } from '../../../GAS | Library/v01/gas/getFiles';
import { getFolders } from '../../../GAS | Library/v01/gas/getFolders';
import { getSheet } from '../../../GAS | Library/v02/gas/getSheet';

// Helper
const shorter = {
	External: 'ext',
	Local: 'loc',
	Hub: 'hub',
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

export {
	createFolderStructure,
	createFilesForExt,
	createWhereToPrintFiles,
};
