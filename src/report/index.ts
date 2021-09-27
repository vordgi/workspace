#! /usr/bin/env node

import getTasks from './getTasks';
import getVariables, { args } from './variables';
import fs from 'fs';

const report = async () => {
	const variables = await getVariables();

	if (args['--help']) {
		console.log(`
        '--variant', '-v' {String} - list | points
        '--write', '-w' {Boolean} - write file in current folder instead logging.
        '--help', '-h' {Boolean} - help
    `);
		process.exit();
	}

	if (!args['--variant']) {
		console.log('   Error: You didn\'t choose report variant. Please add with -v flag');
		process.exit();
	}

	if (args['--variant'] !== 'list' && args['--variant'] !== 'points' ) {
		console.log('   Error: Please, choose valid report variant. Use --help flag for more info');
		process.exit();
	}
	if (args['--variant'] === 'list') {
		const jiraTasks = await getTasks(variables);
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
		console.log('   Coming soon');
		process.exit();
	}
};

export default report;