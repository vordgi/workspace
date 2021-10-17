import inquirer from 'inquirer';
import getConfig from './getConfig';
import cacache from 'cacache';

const settingApp = async () => {
	const config = await getConfig();
	const prompt = inquirer.createPromptModule();

	const jiraConfig = await prompt([
		{
			type: 'input',
			name: 'email',
			message: 'Jira email:',
			default: config.jira.email
		},{
			type: 'input',
			name: 'name',
			message: 'Jira workspace name:',
			default: config.jira.name
		},{
			type: 'input',
			name: 'token',
			message: 'Jira token:',
			default: config.jira.token,
		},
	]);

	const gitlabConfig = await prompt([{
		type: 'input',
		name: 'token',
		message: 'Private gitlab token:',
		default: config.gitlab?.token
	}]);

	const gitlabProjects = [];
	for (const project of config.gitlabProjects) {
		const {method} = await prompt([{
			type: 'list',
			name: 'method',
			message: `Gitlab project "${project.fullName}"`,
			choices: ['continue', 'update', 'remove'],
			default: 'continue'
		}]);
		if (method === 'continue') {
			gitlabProjects.push(project);
			continue;
		}
		if (method === 'remove') continue;
		const gitlabProject = await prompt([
			{
				type: 'input',
				name: 'fullName',
				message: 'Gitlab project full name:',
				default: project.fullName
			},{
				type: 'input',
				name: 'shortName',
				message: 'Gitlab project short name:',
				default: project.shortName
			},{
				type: 'input',
				name: 'id',
				message: 'Gitlab project id:',
				default: project.id
			},
		]);
		gitlabProjects.push(gitlabProject);
	}
	let {addProject} = await prompt([{
		type: 'confirm',
		name: 'addProject',
		message: 'Add project (N):',
		default: false
	}]);
	while (addProject) {
		const gitlabProject = await prompt([
			{
				type: 'input',
				name: 'fullName',
				message: 'Gitlab project full name:',
			},{
				type: 'input',
				name: 'shortName',
				message: 'Gitlab project short name:',
			},{
				type: 'input',
				name: 'id',
				message: 'Gitlab project id:',
			},
		]);
		const createProject = await prompt([{
			type: 'confirm',
			name: 'addProject',
			message: 'Add project (N):',
			default: false
		}]);
		addProject = createProject.addProject;
		gitlabProjects.push(gitlabProject);
	}
	const { defaultProject } = await prompt([{
		type: 'list',
		name: 'defaultProject',
		message: 'Default project:',
		choices: gitlabProjects.map((project) => project.fullName),
		default: config.defaultProject
	}]);
    
	await cacache.put('/tmp/ws', 'ws-config', JSON.stringify({
		jira: jiraConfig,
		gitlab: gitlabConfig,
		gitlabProjects,
		defaultProject
	}, null, 2));
	console.log('Saved');
};

export default settingApp;