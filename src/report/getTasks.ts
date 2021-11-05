import fetchTasks from './fetchTasks';

type GetTasks = (arg: {
	authToken: string;
	jiraWorkspace: string;
	startDate: Date;
	endDate: Date;
	fields?: string[];
}) => Promise<string[]>

const getTasks: GetTasks = async ({ authToken, jiraWorkspace, startDate, endDate, fields = ['summary'] }) => {
	const startDateString = startDate.toISOString().slice(0, 10);
	const endDateString = endDate.toISOString().slice(0, 10);

	const jql = `assignee in (currentUser()) AND resolved >= ${startDateString} AND resolved <= ${endDateString} AND status = Resolved ORDER BY created ASC`;

	const fieldsKeys = fields?.map(field => field.split('.')[0]);
	const tasks = await fetchTasks({ authToken, jiraWorkspace, jql, fieldsKeys });
	const issues = tasks.issues;
	if (tasks.total > 100) {
		const count = Math.ceil(tasks.total / 100) - 1;
		for (let i = 1; i <= count; i++) {
			const tasksAdditional = await fetchTasks({ authToken, jiraWorkspace, jql, fieldsKeys, startAt: i * 100 });
			issues.push(...tasksAdditional.issues);
		}
	}

	const jiraTasks = issues.map(({ key, fields: respFields }) => {
		const fieldsValues = fields.map(field => {
			const [key, ...subkeys] = field.split('.');
			const value = subkeys.reduce((acc, subkey) => {
				if (typeof acc !== 'object') {
					console.log(`\n\tError: Invalid field ${field}\n`);
					process.exit()
				}
				return acc[subkey];
			}, respFields[key]);
			return value;
		});
		return (`${key} ${fieldsValues.join(' / ')}`);
	});
	return jiraTasks;
};

export default getTasks;
