import fetch from 'node-fetch';

type ObjectType = {[key: string]: string | number | ObjectType}

type IssueType = {key: string; fields: ObjectType}

type JiraResponseType = {issues: IssueType[]; total: number; startAt: number}

type FetchTasks = (arg: {
	authToken: string;
	jiraWorkspace: string;
	jql: string;
	startAt?: number;
	fieldsKeys: string[];
}) => Promise<JiraResponseType>

const fetchTasks: FetchTasks = async ({authToken, jiraWorkspace, jql, startAt = 0, fieldsKeys}) => {
	const jiraResp = await fetch(`https://${jiraWorkspace}.atlassian.net/rest/api/3/search`, {
		headers: {
			'accept': 'application/json,text/javascript,*/*',
			'content-type': 'application/json',
			'Authorization': `Basic ${authToken}`,
		},
		method: 'POST',
		body: JSON.stringify({
			jql,
			maxResults: 100,
			fields: fieldsKeys,
			startAt
		})
	});
	const jiraData: JiraResponseType = await jiraResp.json();
	return jiraData;
};

export default fetchTasks;