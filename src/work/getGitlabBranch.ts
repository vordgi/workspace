import getVariables from './variables';
import fetch from 'node-fetch';

type Branch = {name: string, merged: boolean, message?: undefined}
type BranchError = {name?: undefined, merged?: undefined, message: string}

type GetGitlabBranch = (branch?: string) => Promise<Branch | BranchError>

const getGitlabBranch: GetGitlabBranch = async (branch) => {
	const { project, gitlabToken } = await getVariables();

	const branchResp = await fetch(`https://gitlab.com/api/v4/projects/${project.id}/repository/branches/${branch}`, {
		method: 'GET',
		headers: {
			'PRIVATE-TOKEN': gitlabToken,
			'Content-Type': 'application/json'
		},
	});

	const branchBody: Branch = await branchResp.json();

	return branchBody;
};

export default getGitlabBranch;