import path from 'node:path';

import { Spinner } from '@topcli/spinner';

import { LOG_MESSAGES, TEMPLATES } from './constants.js';
import {
  cloneGitRepository,
  getProjectName,
  getProjectTemplate,
  initializeGitRepository,
  installDependencies,
  removeGitFolder,
  updatePackageJson,
} from './utils.js';

export async function init() {
  const spinner = new Spinner();
  try {
    const projectName = await getProjectName();
    const projectPath = path.join(process.cwd(), projectName);
    const templateName = await getProjectTemplate(TEMPLATES);
    const template = TEMPLATES.find(
      (template) => template.name === templateName
    );
    console.clear();
    spinner.start(LOG_MESSAGES.START_CLONING);
    await cloneGitRepository(template.repository, projectName);
    spinner.succeed(LOG_MESSAGES.CLONING_SUCCESS);
    spinner.start(LOG_MESSAGES.START_UPDATING);
    await updatePackageJson(projectPath, projectName);
    spinner.succeed(LOG_MESSAGES.UPDATING_SUCCESS);
    spinner.start(LOG_MESSAGES.START_REMOVING);
    await removeGitFolder(projectPath);
    spinner.succeed(LOG_MESSAGES.REMOVING_SUCCESS);
    spinner.start(LOG_MESSAGES.START_INITIALIZING);
    await initializeGitRepository(projectPath);
    spinner.succeed(LOG_MESSAGES.INITIALIZING_SUCCESS);
    spinner.start(LOG_MESSAGES.START_INSTALLING);
    await installDependencies(projectPath);
    spinner.succeed(LOG_MESSAGES.INSTALLING_SUCCESS);
  } catch (error) {
    spinner.failed(`Error: ${error.message}`);
  }
}
