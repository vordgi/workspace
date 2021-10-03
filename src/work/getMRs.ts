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

	const MRsBody: GitTaskType[] = await MRsResp.json();
	const mergeRequests = MRsBody.map(({web_url, state}, i) => (`${i + 1}. ${web_url} (${state})`));

	if (!MRsBody) {
		console.log('Can\'t get merge requests');
		process.exit();
	}
	if (!MRsBody.length) return ['Merge requests for this task not found'];
	return mergeRequests;
};

export default getMRs;