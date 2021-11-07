#! /usr/bin/env node

import createComment from './createComment';
import createMR from './createMR';
import getVariables, { args } from './variables';
import getTask from './getTask';
import getMRs from './getMRs';

const help = `
	'--jira-task', '-j' {String} - name of current task into jira (for ex NT-2020)
	'--source-branch', '-s' {String} - source branch (by default equal with --jira-task oprion)
	'--target-branch', '-t' {String} - target branch (default - "master")
	'--project', '-p' {String} - full or short name of giltab project (make sure, that you add them into config)
	'--merge', '-m' {Boolean} - use if you want create merge for task in gitlab
	'--comment', '-c' {Boolean} - use if you want create comment with link to current mr (only with -m flag)
	'--help', '-h' {Boolean} - help
`

const work = async () => {
	if (args['--help']) {
		console.log(help);
		process.exit();
	}

	if (!args['--jira-task']) {
		console.log('\n\tError: You didn\'t add current task. Please add with -j flag\n');
		process.exit();
	}

	const task = await getTask();

	if (!task?.id) {
		console.log('\n\tError: Task not found\n');
		process.exit();
	}

	if (args['--comment'] && !args['--merge']) {
		console.log('\n\tError: You can\'t create comment without merge. Please use -m flag\n');
		process.exit();
	}
	if (args['--merge']) {
		const mr = await createMR(task);
		if (args['--comment']) {
			await createComment(mr.web_url);
		}
		process.exit();
	}
	if (args['--jira-task']) {
		const { jiraWorkspace } = await getVariables();
		const mergeRequests = await getMRs();
		console.log(`
	Jira: https://${jiraWorkspace}.atlassian.net/browse/${args['--jira-task']?.toLowerCase()} (${task.fields.status.name}).

	Gitlab:
	${mergeRequests.map(el => `${el}`).join(';\n\t')}.
`);
		process.exit();
	}
};

export default work;
