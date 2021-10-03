#! /usr/bin/env node

import saveLocalConfig from './saveLocalConfig';
import settingApp from './settings';

const command = process.argv[2];

(async () => {
	if (command === '--help' || command === '-h') {
		console.log(`
		'--help', '-h' {Boolean} - help - view commands and args
		'configure', 'c' {Boolean} - configure workspace
		'save' {Boolean} - save base configuration (workspace.base.json) globally
		'work' {Boolean} - work with tasks in jira and git
		'report' {Boolean} - get reports
	`);
		process.exit();
	}

	if (command === 'save') {
		await saveLocalConfig();
		process.exit();
	}

	if (command === 'report') {
		const { default: report } = await import('./report');
		await report();
		process.exit();
	}

	if (command === 'configure' || command === 'c') {
		await settingApp();
		process.exit();
	}
	if (command === 'report') {
		await settingApp();
		process.exit();
	}
	const { default: work } = await import('./work');
	await work();
})();
