import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

import { input, select } from '@inquirer/prompts';
import { TEMPLATES } from './templates.js';
import { INVALID_PACKAGE_NAME } from './errors.js';

export async function init() {
  const projectName = await getProjectName();
  const templateName = await getProjectTemplate(TEMPLATES);

  const template = TEMPLATES.find((template) => template.name === templateName);

  spawnSync('git', ['clone', template.repository], {
    stdio: 'inherit',
  });

  await fs.rename(
    path.join(process.cwd(), template.folder),
    path.join(process.cwd(), projectName)
  );

  const packageJson = await fs.readFile(
    path.join(process.cwd(), projectName, 'package.json'),
    'utf-8'
  );

  const packageData = JSON.parse(packageJson);
  packageData.name = projectName;

  await fs.writeFile(
    path.join(process.cwd(), projectName, 'package.json'),
    JSON.stringify(packageData, null, 2)
  );

  await fs.rm(path.join(process.cwd(), projectName, '.git'), {
    recursive: true,
  });

  spawnSync('git', ['init'], {
    cwd: path.join(process.cwd(), projectName),
    stdio: 'inherit',
  });

  console.log('Project initialized');
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
  if (packageNameRegex.test(value)) return true;
  return false;
};

const getProjectTemplate = async (templates) => {
  return select({
    message: 'Select template',
    choices: templates.map((template) => {
      return {
        title: template.name,
        value: template.name,
      };
    }),
  });
};
