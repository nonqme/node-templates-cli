import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

import { input, select } from '@inquirer/prompts';
import { TEMPLATES } from './templates.js';
import { INVALID_PACKAGE_NAME } from './errors.js';

export async function init() {
  try {
    const projectName = await getProjectName();
    const templateName = await getProjectTemplate(TEMPLATES);

    const template = TEMPLATES.find(
      (template) => template.name === templateName
    );

    cloneRepository(template.repository);

    const projectPath = path.join(process.cwd(), projectName);

    await renameFolder(path.join(process.cwd(), template.folder), projectPath);
    await updatePackageJson(projectPath, projectName);
    await removeGitFolder(projectPath);
    initializeGitRepository(projectPath);

    console.log('Project initialized');
  } catch (error) {
    console.error('Error initializing project:', error);
  }
}

const getProjectName = async () => {
  return input({
    message: 'Enter project name:',
    validate: (value) => validatePackageName(value) || INVALID_PACKAGE_NAME,
  });
};

const validatePackageName = (value) => {
  const packageNameRegex =
    /^(?:@[a-z0-9-_]{1,213}\/)?[a-z0-9][a-z0-9-_]{0,212}$/;
  return packageNameRegex.test(value);
};

const getProjectTemplate = async (templates) => {
  return select({
    message: 'Select template',
    choices: templates.map((template) => ({
      title: template.name,
      value: template.name,
    })),
  });
};

const cloneRepository = (repository) => {
  spawnSync('git', ['clone', repository], { stdio: 'inherit' });
};

const renameFolder = async (oldPath, newPath) => {
  await fs.rename(oldPath, newPath);
};

const updatePackageJson = async (projectPath, projectName) => {
  const packageJsonPath = path.join(projectPath, 'package.json');
  const packageJson = await fs.readFile(packageJsonPath, 'utf-8');
  const packageData = JSON.parse(packageJson);
  packageData.name = projectName;
  await fs.writeFile(packageJsonPath, JSON.stringify(packageData, null, 2));
};

const removeGitFolder = async (projectPath) => {
  await fs.rm(path.join(projectPath, '.git'), { recursive: true });
};

const initializeGitRepository = (projectPath) => {
  spawnSync('git', ['init'], { cwd: projectPath, stdio: 'inherit' });
};
