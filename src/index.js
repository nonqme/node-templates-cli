import { spawnSync } from 'node:child_process';

import { input, select } from '@inquirer/prompts';

const TEMPLATES = [
  {
    name: 'typescript',
    folder: 'node-typescript-template',
    repository: 'https://github.com/nonqme/node-typescript-template.git',
  },
  {
    name: 'javascript',
    folder: 'node-javascript-template',
    repository: 'https://github.com/nonqme/node-javascript-template.git',
  },
];

export async function init(options) {
  const template = options.template;

  const packageNameRegex =
    /^(?:@[a-z0-9-_]{1,213}\/)?[a-z0-9][a-z0-9-_]{0,212}$/;

  const name = await input({
    message: 'Enter project name',
    validate: (value) => {
      if (!packageNameRegex.test(value)) {
        return 'Invalid package name';
      }

      return true;
    },
  });

  console.log(`Creating project: ${name}`);

  if (template && !TEMPLATES.some((t) => t.name === template)) {
    console.error('Invalid template');
    return;
  }

  const selectedTemplate =
    template ||
    (await select({
      message: 'Select a template',
      choices: TEMPLATES.map((t) => ({
        name: t.name,
        value: t.name,
      })),
    }));

  const { repository } = TEMPLATES.find((t) => t.name === selectedTemplate);

  spawnSync('git', ['clone', repository], {
    stdio: 'inherit',
  });
}
