import { paste } from '../../../GAS | Library/v02/gas/paste';

const removeExtremes = () => {
	const sheet = SpreadsheetApp.getActive().getActiveSheet();
	const typeRange = 'V4:W4';
	const dataRange = 'A3:E';
	const avgRange = 'X5';
	const maxMult = 5;

	const [[structure, type]] = sheet.getRange(typeRange).getValues();
	const [[average]] = sheet.getRange(avgRange).getValues();

	const data = sheet
		.getRange(dataRange)
		.getValues()
		.map(([date, exisStructure, t, task, exisType]) => {
			if (
				exisStructure === structure &&
				exisType === type &&
				t > average * maxMult
			) {
				return ['-', '-', '-', '-', '-'];
			}
			return [new Date(date), exisStructure, t, task, exisType];
		});

	paste(sheet, 'A3', data, { restrictCleanup: 'preserve' });
};

export { removeExtremes };
