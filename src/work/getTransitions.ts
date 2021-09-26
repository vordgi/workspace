import fetch from 'node-fetch';

type getTransitionsArgs = {
    jiraWorkspace: string, 
    task: string, 
    token: string
}

const getTransitions = async ({jiraWorkspace, task, token}: getTransitionsArgs) => {
	const jiraResp = await fetch(`https://${jiraWorkspace}.atlassian.net/rest/api/3/issue/${task}/transitions`, {
		"headers": {
			"accept": "application/json,text/javascript,*/*",
			"content-type": "application/json",
			"Authorization": `Basic ${token}`,
		},
		"method": "GET",
	});
	const jiraData = await jiraResp.json();
	return jiraData;
};

export default getTransitions;