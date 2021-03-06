#! /usr/bin/env node

import getTasks from './getTasks';
import getVariables, { args } from './variables';
import fs from 'fs';

const help = `
	'--variant', '-v' {String} - list | points
	'--write', '-w' {Boolean} - write file in current folder instead logging
	'--start-date', '-s' {String} - start date (f.e. 2021-11-21, by default - exactly a month ago)
	'--end-date', '-e' {String} - end date (f.e. 2021-12-21, by default - today date)
	'--field', '-f' {String[]} - field key (f.e. ['summary', 'reporter.displayName'], by default - ['summary'])
	'--help', '-h' {Boolean} - help
`

const report = async () => {
	const variables = await getVariables();

	if (args['--help']) {
		console.log(help);
		process.exit();
	}

	if (!args['--variant']) {
		console.log('\n\tError: You didn\'t choose report variant. Please add with -v flag\n');
		process.exit();
	}

	if (args['--variant'] !== 'list' && args['--variant'] !== 'points') {
		console.log('\n\tError: Please, choose valid report variant. Use --help flag for more info\n');
		process.exit();
	}

	let endDate = new Date();
	if (args['--end-date']) {
		const argEndDate = new Date(args['--end-date']);
		if (Number.isNaN(argEndDate)) {
			console.log('\n\tError: Please, write correct end date (f.e. 2021-12-21)\n');
			process.exit();
		} else {
			endDate = argEndDate;
		}
	}

	const curDate = new Date();
	curDate.setMonth(curDate.getMonth() - 1);
	let startDate = curDate;
	if (args['--start-date']) {
		const argStartDate = new Date(args['--start-date']);
		if (Number.isNaN(argStartDate)) {
			console.log('\n\tError: Please, write correct start date (f.e. 2021-12-21)\n');
			process.exit();
		} else {
			startDate = argStartDate;
		}
	}

	if (args['--variant'] === 'list') {
		const jiraTasks = await getTasks({ ...variables, startDate, endDate, fields: args['--field'] });
		const tasksRow = jiraTasks.join(';\n') + '.';
		if (args['--write']) {
			fs.writeFileSync('./tasks.txt', tasksRow, {
				encoding: 'utf-8'
			});
		} else {
			console.log(tasksRow);
		}
		process.exit();
	}
	if (args['--variant'] === 'points') {
		console.log('\n\tComing soon\n');
		process.exit();
	}
	console.log(`\n\tError: Unknown options. Please, use valid options: ${help}`);
	process.exit();
};

export default report;
