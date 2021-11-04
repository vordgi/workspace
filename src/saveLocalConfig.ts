import inquirer from 'inquirer';
import { getLocalConfig } from './getConfig';
import cacache from 'cacache';

const saveLocalConfig = async () => {
	const config = getLocalConfig();
	const prompt = inquirer.createPromptModule();

	const {success} = await prompt([{
		type: 'confirm',
		name: 'success',
		message: 'Are you sure, that you want to save your local config globally? (Y):',
		default: true
	}]);
	if (success){
		await cacache.put('/tmp/ws', 'ws-config', JSON.stringify(config, null, 2));
		console.log('\n\tSaved. For update configration run "wrsp c"\n');
	}
};

export default saveLocalConfig;