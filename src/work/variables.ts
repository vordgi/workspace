import arg from 'arg';
import getConfig, { ConfigType } from '../getConfig';
import type { GitlabProject } from '../types/gitlab';

export const args = arg({
	'--merge': Boolean,
	'--comment': Boolean,
	'--jira-task': String,
	'--project': String,
	'--help': Boolean,
	'--target-branch': String,
	'--source-branch': String,
    
	'-m': '--merge',
	'-c': '--comment',
	'-j': '--jira-task',
	'-p': '--project',
	'-h': '--help',
	'-t': '--target-branch',
	'-s': '--source-branch',
});


const getProject = (config: ConfigType) => {
	const argProject = args['--project'];
	let project: GitlabProject;
	if (argProject) {
		const configProject =config.gitlabProjects.find(({shortName, fullName}) => (
			shortName === argProject || fullName === argProject
		));
		if (configProject) project = configProject;
		else {
			console.log('   Error: Can\'t find this project. Please add it into config');
			process.exit();
		}
	} else {
		const configProject = config.gitlabProjects.find(({fullName}) => fullName === config.defaultProject);
		if (configProject) project = configProject;
		else {
			console.log('   Error: You didn\'t add default project. Please add it into config');
			process.exit();
		}
	}
	return project;
};
const getVariables = async () => {
	const config = await getConfig();

	const authToken = Buffer.from(`${config.jira.email}:${config.jira.token}`).toString('base64');
	const variables = {
		authToken,
		jiraWorkspace: config.jira.name,
		gitlabToken: config.gitlab.token,
		jiraTask: args['--jira-task'],
		project: getProject(config),
		merge: args['--merge'],
		comment: args['--comment'],
		targetBranch: args['--target-branch'] || 'master',
		sourceBranch: args['--source-branch'] || args['--jira-task'],
	};
	return variables;
};

export default getVariables;