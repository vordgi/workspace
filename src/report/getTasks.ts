import fetchTasks from './fetchTasks';

type GetTasks = (arg: {
	authToken: string;
	jiraWorkspace: string;
	startDate: Date;
	endDate: Date;
}) => Promise<string[]>

const getTasks: GetTasks = async ({authToken, jiraWorkspace, startDate, endDate}) => {
	const startDateString = startDate.toISOString().slice(0,10);
	const endDateString = endDate.toISOString().slice(0,10);

	const jql = `assignee in (currentUser()) AND resolved >= ${startDateString} AND resolved <= ${endDateString} AND status = Resolved ORDER BY created ASC`;

	const tasks = await fetchTasks({authToken, jiraWorkspace, jql});
	const issues = tasks.issues;
	if (tasks.total > 100) {
		const count = Math.ceil(tasks.total / 100) - 1;
		for (let i = 1; i <= count; i++) {
			const tasksAdditional = await fetchTasks({authToken, jiraWorkspace, jql, startAt: i * 100});
			issues.push(...tasksAdditional.issues);
		}
	}

	const jiraTasks = issues.map(({key, fields: {summary} = {}}) => (`${key} ${summary}`));
	return jiraTasks;
};

export default getTasks;