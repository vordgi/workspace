import pkgConfig from '../config.json';
import path from 'path';
import fs from 'fs';
import cacache from 'cacache';

export type ConfigType = typeof pkgConfig

const checkConfig = (config:Partial<ConfigType>) => {
	let configError: boolean = !config.jira?.email || !config.jira?.name || !config.jira?.token;
	if (configError) {
		console.log('\n\tError: Invalid jira config\n');
		process.exit();
	}
	config.gitlabProjects?.forEach((project, i) => {
		configError = !!Object.values(project).find(value => !value);
		if (configError) {
			console.log(`\n\tError: Invalid gitlabProjects[${i}] config\n`);
			process.exit();
		}
	});
};

export const getLocalConfig = () => {
	const customConfigPath = path.resolve('workspace.base.json');
	if (!fs.existsSync(customConfigPath)) {
		console.log(`\n\tError: Local configuration file not found. Please create "workspace.base.json" file in current directory.\n`);
		process.exit();
	}
	const customConfig:Partial<ConfigType> = JSON.parse(fs.readFileSync(customConfigPath, 'utf8'));
	checkConfig(customConfig);
	return customConfig as ConfigType;
};

const getConfig = async () => {
	const customConfigPath = path.resolve('workspace.config.json');
	if (fs.existsSync(customConfigPath)) {
		const customConfig:Partial<ConfigType> = JSON.parse(fs.readFileSync(customConfigPath, 'utf8'));
		checkConfig(customConfig);
		return customConfig as ConfigType;
	}
	const localConfigPath = path.join(__dirname, '../config.local.json');
	if (fs.existsSync(localConfigPath)) {
		const customConfig:Partial<ConfigType> = JSON.parse(fs.readFileSync(localConfigPath, 'utf8'));
		checkConfig(customConfig);
		return customConfig as ConfigType;
	}
	const { data } = await cacache.get('/tmp/ws', 'ws-config');

	const cachedConfig = JSON.parse(data.toString());

	if (cachedConfig?.jira) return cachedConfig as ConfigType;
	console.log('\n\tError: Please configure application.\n');
	process.exit();
};

export default getConfig;
