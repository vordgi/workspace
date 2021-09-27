import fetch from 'node-fetch';

type GetTasks = (arg: {
	authToken: string
	jiraWorkspace: string
}) => Promise<string[]>

const getTasks: GetTasks = async ({authToken, jiraWorkspace}) => {
	const curDate = new Date();
	const curDateString = curDate.toISOString().slice(0,10);
	curDate.setMonth(curDate.getMonth() - 1);
	const prevDateString = curDate.toISOString().slice(0,10);

	const jiraResp = await fetch(`https://${jiraWorkspace}.atlassian.net/rest/api/3/search`, {
		"headers": {
			"accept": "application/json,text/javascript,*/*",
			"content-type": "application/json",
			"Authorization": `Basic ${authToken}`,
		},
		"method": "POST",
		body: JSON.stringify({
			"jql": `assignee in (currentUser()) AND resolved >= ${prevDateString} AND resolved <= ${curDateString} AND status = Resolved ORDER BY created ASC`,
			"maxResults": 100,
			"fieldsByKeys": false,
			"fields": [
				"summary",
			],
			"startAt": 0
		})
	});
	const jiraData: {issues: {key: string; fields: {summary: string}}[]} = await jiraResp.json();
	const jiraTasks = jiraData.issues.map(({key, fields: {summary} = {}}) => (`${key} ${summary}`));
	return jiraTasks;
};

export default getTasks;