import arg from 'arg';
import getConfig from '../getConfig';

export const args = arg({
	'--help': Boolean,
	'--variant': String,
	'--write': Boolean,
	'--start-date': String,
	'--end-date': String,
	'--field': [String],

	'-h': '--help',
	'-v': '--variant',
	'-w': '--write',
	'-s': '--start-date',
	'-e': '--end-date',
	'-f': '--field',
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