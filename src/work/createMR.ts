import getVariables from './variables';
import fetch from 'node-fetch';

interface JiraTaskType {
	fields: {
		creator: {displayName: string};
		description: {content: any};
		summary: string;
		issuetype: {name: string};
		assignee: {displayName: string};
	};
}
const createMR = async (jiraTaskObj:JiraTaskType) => {
	const { jiraTask, sourceBranch, jiraWorkspace, project, gitlabToken, targetBranch } = await getVariables();
	const mergeBody = {
		source_branch: sourceBranch?.toLowerCase(),
		target_branch: targetBranch || 'master',
		remove_source_branch: true,
		title: `${jiraTask?.toLowerCase()}. ${jiraTaskObj.fields.summary}`,
		description: `[${jiraTask?.toUpperCase()}](https://${jiraWorkspace}.atlassian.net/browse/${jiraTask?.toUpperCase()})

creator: ${jiraTaskObj.fields.creator.displayName}

assignee: ${jiraTaskObj.fields.assignee.displayName}

issue type: ${jiraTaskObj.fields.issuetype.name}`
	};
	const MRResp = await fetch(`https://gitlab.com/api/v4/projects/${project.id}/merge_requests`, {
		method: 'POST',
		headers: {
			'PRIVATE-TOKEN': gitlabToken,
			'Content-Type': 'application/json'
		} as {[key:string]: string},
		body: JSON.stringify(mergeBody)
	});
	
	const MRBody = await MRResp.json();
	
	if (MRBody.web_url) {
		console.log(`MR: ${MRBody.web_url}`);
	} else {
		console.log(`\n\tError: Can't create merge. ${MRBody.error_description}\n`);
		process.exit();
	}
	return MRBody;
};

export default createMR;