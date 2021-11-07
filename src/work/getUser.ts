import fetch from 'node-fetch';

type getUserArgs = {
    jiraWorkspace: string | undefined;
    authToken: string | undefined;
}

const getUser = async ({ jiraWorkspace, authToken }: getUserArgs) => {
	const jiraResp = await fetch(`https://${jiraWorkspace}.atlassian.net/rest/api/4/user/`, {
		headers: {
			accept: 'application/json,text/javascript,*/*',
			'content-type': 'application/json',
			Authorization: `Basic ${authToken}`
		},
		method: 'GET'
	});
	const jiraData = await jiraResp.json();
	if (jiraData.errorMessages) {
		console.log(`\n\tError: Can't get jira task. ${jiraData.errorMessages.join(', ')}\n`);
		process.exit();
	}
	return jiraData;
};

export default getUser;
