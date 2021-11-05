import getGitlabBranch from './getGitlabBranch';
import inquirer from 'inquirer';

const checkBranch = async (branch:string) => {
    const prompt = inquirer.createPromptModule();
    const branchData = await getGitlabBranch(branch);

    if (branchData.merged) {
        const { isOk } = await prompt([{
            type: 'confirm',
            name: 'isOk',
            message: `Branch '${branch}' already merged. Are you sure, that want to continue? (Y):`,
            default: true
        }]);
        if (!isOk) process.exit()
    } else if (branchData.message) {
        const { isOk } = await prompt([{
            type: 'confirm',
            name: 'isOk',
            message: `Error with '${branch}': ${branchData.message}. Are you sure, that want to continue? (Y):`,
            default: true
        }]);
        if (!isOk) process.exit()
    }
}

export default checkBranch;
