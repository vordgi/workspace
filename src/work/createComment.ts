/* eslint-disable @typescript-eslint/ban-ts-comment */
import getVariables from "./variables";
import fetch from 'node-fetch';

const getBody = (url: string) => {
	const bodyData = JSON.stringify({
		body: {
			version:1,
			type:"doc",
			content:[{
				"type": "paragraph",
				"content": [
					{
						"type": "text",
						"text": "MR: "
					},
					{
						"type": "text",
						"text": url,
						"marks": [
							{
								"type": "link",
								"attrs": {
									"href": url
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
		"headers": {
			"accept": "application/json,text/javascript,*/*",
			"content-type": "application/json",
			"Authorization": `Basic ${authToken}`,
		},
		"body": getBody(mrUrl),
		"method": "POST",
	});
	if (jiraResp.ok) {
		console.log('Comment added');
	} else {
		console.log("Can't write comment");
	}
};

export default createComment;