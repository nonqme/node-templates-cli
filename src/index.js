import fs from 'node:fs/promises';
import path from 'node:path';
import { exec } from 'node:child_process';

import { input, select } from '@inquirer/prompts';
import { TEMPLATES } from './templates.js';
import { INVALID_PACKAGE_NAME } from './errors.js';

export async function init() {
  try {
    const projectName = await getProjectName();
    const projectPath = path.join(process.cwd(), projectName);
    const templateName = await getProjectTemplate(TEMPLATES);
    const template = TEMPLATES.find(
      (template) => template.name === templateName
    );
    await cloneGitRepository(template.repository, projectName);
    await updatePackageJson(projectPath, projectName);
    await removeGitFolder(projectPath);
    await initializeGitRepository(projectPath);
  } catch (error) {
    console.error(error.message);
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

const updatePackageJson = async (projectPath, projectName) => {
  console.log('Updating package.json...');
  const packageJsonPath = path.join(projectPath, 'package.json');
  const packageJson = await fs.readFile(packageJsonPath, 'utf-8');
  const packageData = JSON.parse(packageJson);
  packageData.name = projectName;
  await fs.writeFile(packageJsonPath, JSON.stringify(packageData, null, 2));
  console.log('package.json updated successfully!');
};

const removeGitFolder = async (projectPath) => {
  console.log('Removing .git folder...');
  await fs.rm(path.join(projectPath, '.git'), { recursive: true });
  console.log('.git folder removed successfully!');
};

const initializeGitRepository = async (projectPath) => {
  return new Promise((resolve, reject) => {
    exec('git init', { cwd: projectPath }, (error, stdout, stderr) => {
      console.log('Initializing git repository...');
      if (error) {
        return reject(new Error(stderr));
      }
      console.log('Git repository initialized successfully!');
      resolve(stdout);
    });
  });
};

const cloneGitRepository = async (repository, folderName) => {
  return new Promise((resolve, reject) => {
    exec(`git clone ${repository} ${folderName}`, (error, stdout, stderr) => {
      console.log('Cloning template repository...');
      if (error) {
        const errorMessage = stderr.split(': ')[1].trim();
        return reject(
          new Error(`${errorMessage[0].toUpperCase()}${errorMessage.slice(1)}`)
        );
      }
      console.log('Template repository cloned successfully!');
      resolve(stdout);
    });
  });
};
