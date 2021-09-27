#! /usr/bin/env node

import settingApp from './settings';

const command = process.argv[2];

(async () => {
	if (command === '--help' || command === '-h') {
		console.log(`
		'--help', '-h' {Boolean} - help - view commands and args
		'report' {Boolean} - get reports
		'configure', 'c' {Boolean} - configure workspace
		'work' {Boolean} - work with tasks in jira and git
	`);
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

