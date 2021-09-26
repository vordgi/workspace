import arg from 'arg';
import getConfig from '../getConfig';

export const args = arg({
	'--variant': String,
	'--help': Boolean,
	'--write': Boolean,

	'-v': '--variant',
	'-w': '--write',
	'-h': '--help',
});

const getVariables = async () => {
	const config = await getConfig();
	
	const authToken = Buffer.from(`${config.jira.email}:${config.jira.token}`).toString('base64');
	const variables = {
		authToken,
		jiraWorkspace: config.jira.name,
	};
	return variables;
};

export default getVariables;