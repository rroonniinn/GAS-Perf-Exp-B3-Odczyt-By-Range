/* eslint-disable max-lines-per-function */
import { copySheetsToOther } from '../../../GAS | Library/v02/gas/copySheetsToOther';

/**
 * Tu są zadania służące do unifikacji wszystkich plików eksperymentów.
 * Unifikacje te są wynikiem analizy z 2020.04.01 (środa)
 */

//  dla odczytów
// const SOURCE = '1kW9g13lpUbQiQZ332syHChAqumrUbddu_Wn0gOhO2ZU';
// dla zapisów
const SOURCE = '1KzxmZnfJZcDkWCvtyUkR_Gn2QudR1SKttI1Zwfg8v9A';

const files = [
	// {
	// 	descA: 'Odczyt',
	// 	descB: 'By Range',
	// 	geo: 'Hub',
	// 	descC: 'wierszy w zakresie',
	// 	headerColor: '#34a853',
	// 	target: '1yFDSVKjrQRHhRSM9dNS51VF7GbHMNthol0P1AD9RkOg',
	// },
	// {
	// 	descA: 'Odczyt',
	// 	descB: 'By Range',
	// 	geo: 'Local',
	// 	descC: 'wierszy w zakresie',
	// 	headerColor: '#34a853',
	// 	target: '1wtb3RoJ0j3lM1jHfZruZxVyBNkA66O90NMxK45WpKdo',
	// },
	// {
	// 	descA: 'Odczyt',
	// 	descB: 'Entry by Entry',
	// 	geo: 'External',
	// 	descC: 'indywidualnych modyfikacji',
	// 	headerColor: '#34a853',
	// 	target: '1EsvH17ViVMMrCBTAhX_FwdpslwxQnDzWT0Dci8_HcHE',
	// },
	// {
	// 	descA: 'Odczyt',
	// 	descB: 'Entry by Entry',
	// 	geo: 'Local',
	// 	descC: 'indywidualnych modyfikacji',
	// 	headerColor: '#34a853',
	// 	target: '17b7wnpgB-WRTSSscHl6NoK4IIe4RfF5Gpa6OfUPXCVM',
	// },
	// {
	// 	descA: 'Odczyt',
	// 	descB: 'Entry by Entry',
	// 	geo: 'Hub',
	// 	descC: 'indywidualnych modyfikacji',
	// 	headerColor: '#34a853',
	// 	target: '1eg_tJFHzue08t-UycGXE7Gj4SNiAeKlGGX4FZz4qICs',
	// },
	// {
	// 	descA: 'Zapis',
	// 	descB: 'By Range',
	// 	geo: 'External',
	// 	descC: 'wierszy w zakresie',
	// 	headerColor: '#ea4335',
	// 	target: '1KzxmZnfJZcDkWCvtyUkR_Gn2QudR1SKttI1Zwfg8v9A',
	// },
	// {
	// 	target: '1v88rH8-Z0rmly2FBE26eOEfngPW8hnUGQ6wsjehcirI',
	// 	geo: 'Local',
	// 	descA: 'Zapis',
	// 	descB: 'By Range',
	// 	descC: 'wierszy w zakresie',
	// 	headerColor: '#ea4335',
	// },
	// {
	// 	target: '1RGJnjQ86VKcf0kx1F4aUjunosaZ_Y0-e9pSTBU7AeTk',
	// 	geo: 'Hub',
	// 	descA: 'Zapis',
	// 	descB: 'By Range',
	// 	descC: 'wierszy w zakresie',
	// 	headerColor: '#ea4335',
	// },

	{
		target: '1vlw4rsft39S7KdatpkuIRzx1eoLZEMLJmeSnoS6fN44',
		geo: 'External',
		descA: 'Zapis',
		descB: 'Entry by Entry',
		descC: 'indywidualnych modyfikacji',
		headerColor: '#ea4335',
	},
	{
		target: '1VYO0IWb24aaf4RRz3Bo01dsF1wuKk75Vvmhb-AWsKoI',
		geo: 'Local',
		descA: 'Zapis',
		descB: 'Entry by Entry',
		descC: 'indywidualnych modyfikacji',
		headerColor: '#ea4335',
	},
	{
		target: '1go0ZdOM6qC0AQrYdTtCqLKeC8p1hHod9sAX3qgzon5M',
		geo: 'Hub',
		descA: 'Zapis',
		descB: 'Entry by Entry',
		descC: 'indywidualnych modyfikacji',
		headerColor: '#ea4335',
	},
];

const unify = ({ descA, descB, geo, descC, headerColor, target }) => {
	// Usuń istniejące zbedne pliki
	SpreadsheetApp.openById(target)
		.getSheets()
		.filter(sheet => !sheet.getName().includes('T:'))
		.forEach(sheet => sheet.getParent().deleteSheet(sheet));

	//  Kopia dashboardu
	const spreadsheet = copySheetsToOther(SOURCE, target, sheet =>
		sheet.getName().includes('Wyniki')
	)
		.getSheetByName('Wyniki')
		.activate()
		.getRange('D2')
		.setValue(geo)
		.getSheet()
		.getRange('B2')
		.setValue(descA)
		.getSheet()
		.getRange('C2')
		.setValue(descB)
		.getSheet()
		.getRange('B3')
		.setValue(descC)
		.getSheet()
		.getParent();

	// Przesunięcie Wyników na pierwszą pozycję
	spreadsheet.moveActiveSheet(1);

	// Wprowadzenie poprawek do innych arkuszy
	spreadsheet
		.getSheets()
		.filter(sheet => sheet.getName().includes('T:'))
		.forEach(sheet => {
			sheet
				.getRange('BC6:BC14')
				.clearContent()
				.getSheet()
				.getRange('BC6')
				.setFormula(
					'={"Min vs Med";ArrayFormula(AZ7:AZ14/BA7:BA14)}'
				)
				.getSheet()
				.getRange('BE6:BE14')
				.clearContent()
				.setNumberFormat('0.00')
				.getSheet()
				.getRange('BE6')
				.setFormula(
					'={"Max vs Med";ArrayFormula(AY7:AY14/BA7:BA14)}'
				)
				.getSheet()
				.getRange('A1:BK2')
				.setBackground(headerColor)
				.getSheet()
				.getRange('AT1')
				.setFormula(
					'=Wyniki!B2&" : "&Wyniki!C2&" : "&Wyniki!D2&" : "&1&" "&Wyniki!B3'
				);

			/* Dodanie formatowania warunkowego */

			const range = sheet.getRange('BE7:BE14');
			const rule = SpreadsheetApp.newConditionalFormatRule()
				.setGradientMaxpoint('#ea4335')
				.setGradientMinpoint('#ffffff')
				.setRanges([range])
				.build();

			const rules = sheet.getConditionalFormatRules();
			rules.push(rule);
			sheet.setConditionalFormatRules(rules);
		});
};

const unifyAll = () => files.forEach(unify);

export { unifyAll };
