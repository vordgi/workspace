import fetch from 'node-fetch';
import getVariables from './variables';

const getTask = async () => {
	const {jiraWorkspace, jiraTask, authToken} = await getVariables();
	const jiraResp = await fetch(`https://${jiraWorkspace}.atlassian.net/rest/api/3/issue/${jiraTask}`, {
		'headers': {
			'accept': 'application/json,text/javascript,*/*',
			'content-type': 'application/json',
			'Authorization': `Basic ${authToken}`,
		},
		'method': 'GET',
	});
	const jiraData = await jiraResp.json();
	return jiraData;
};

export default getTask;