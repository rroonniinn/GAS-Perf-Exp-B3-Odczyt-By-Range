/**
 * Odpala triggera
 *
 * @param {string} callback Nazwa funkcji do odpalenia
 */
const startTimeTrigger = callback => {
	ScriptApp.newTrigger(callback)
		.timeBased()
		.everyMinutes(1)
		// .atHour(7)
		// .everyDays(1)
		.create();
};

/**
 * Usuwa wsztstkie triggery
 *
 */

const cancelTimeTriggers = () => {
	const triggers = ScriptApp.getProjectTriggers();
	triggers.forEach(trigger => {
		if (trigger.getTriggerSource() === ScriptApp.TriggerSource.CLOCK) {
			ScriptApp.deleteTrigger(trigger);
		}
	});
};

export { startTimeTrigger, cancelTimeTriggers };
