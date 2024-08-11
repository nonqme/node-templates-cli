import fs from 'node:fs/promises';
import { exec } from 'node:child_process';
import path from 'node:path';

import { input, select } from '@inquirer/prompts';

import { INVALID_PACKAGE_NAME } from './constants.js';

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
  const packageJsonPath = path.join(projectPath, 'package.json');
  const packageJson = await fs.readFile(packageJsonPath, 'utf-8');
  const packageData = JSON.parse(packageJson);
  packageData.name = projectName;
  await fs.writeFile(packageJsonPath, JSON.stringify(packageData, null, 2));
};

const removeGitFolder = async (projectPath) => {
  await fs.rm(path.join(projectPath, '.git'), { recursive: true });
};

const initializeGitRepository = async (projectPath) => {
  return new Promise((resolve, reject) => {
    exec('git init', { cwd: projectPath }, (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(stderr));
      }
      resolve(stdout);
    });
  });
};

const cloneGitRepository = async (repository, folderName) => {
  return new Promise((resolve, reject) => {
    exec(`git clone ${repository} ${folderName}`, (error, stdout, stderr) => {
      if (error) {
        const errorMessage = stderr.split(': ')[1].trim();
        return reject(
          new Error(`${errorMessage[0].toUpperCase()}${errorMessage.slice(1)}`)
        );
      }
      resolve(stdout);
    });
  });
};

const installDependencies = async (projectPath) => {
  return new Promise((resolve, reject) => {
    exec('npm install', { cwd: projectPath }, (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(stderr));
      }
      resolve(stdout);
    });
  });
};

export {
  getProjectName,
  getProjectTemplate,
  updatePackageJson,
  removeGitFolder,
  initializeGitRepository,
  cloneGitRepository,
  installDependencies,
};
