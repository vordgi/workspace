/* eslint-disable @typescript-eslint/ban-ts-comment */
import getVariables from './variables';
import fetch from 'node-fetch';

const getBody = (url: string) => {
	const bodyData = JSON.stringify({
		body: {
			version:1,
			type:'doc',
			content:[{
				'type': 'paragraph',
				'content': [
					{
						'type': 'text',
						'text': 'MR: '
					},
					{
						'type': 'text',
						'text': url,
						'marks': [
							{
								'type': 'link',
								'attrs': {
									'href': url
								}
							}
						]
					}
				]
			}]
		},
	});
	return bodyData;
};

// @ts-ignore
const createComment = async (mrUrl: string) => {  
	const {jiraTask, authToken, jiraWorkspace} = await getVariables();
	const jiraResp = await fetch(`https://${jiraWorkspace}.atlassian.net/rest/api/3/issue/${jiraTask}/comment`, {
		'headers': {
			'accept': 'application/json,text/javascript,*/*',
			'content-type': 'application/json',
			'Authorization': `Basic ${authToken}`,
		},
		'body': getBody(mrUrl),
		'method': 'POST',
	});
	if (!jiraResp.ok) {
		const jiraData = await jiraResp.json();
		if (jiraData.errorMessages) {
			console.log(`\n\tError: Can't get jira task. ${jiraData.errorMessages.join(', ')}\n`);
			process.exit();
		}
	} else {
		console.log('Comment added');
	}
};

export default createComment;