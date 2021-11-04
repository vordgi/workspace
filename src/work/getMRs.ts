import getVariables from './variables';
import fetch from 'node-fetch';

type GitTaskType = {web_url: string; state: string}
const getMRs = async () => {
	const { sourceBranch, project, gitlabToken } = await getVariables();

	const MRsResp = await fetch(`https://gitlab.com/api/v4/projects/${project.id}/merge_requests/?source_branch=${sourceBranch}`, {
		method: 'GET',
		headers: {
			'PRIVATE-TOKEN': gitlabToken,
			'Content-Type': 'application/json'
		},
	});
	
	const MRsBody: GitTaskType[] | {error_description: string} = await MRsResp.json();
	
	if (!Array.isArray(MRsBody)) {
		console.log(`\n\tError: Can't get merge requests. ${MRsBody.error_description}\n`);
		process.exit();
	}
	
	const mergeRequests = MRsBody.map(({web_url, state}, i) => (`${i + 1}. ${web_url} (${state})`));

	if (!MRsBody.length) return ['Merge requests for this task not found'];
	return mergeRequests;
};

export default getMRs;