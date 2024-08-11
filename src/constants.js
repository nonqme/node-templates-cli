export const TEMPLATES = [
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

export const LOG_MESSAGES = {
  START_CLONING: 'Cloning repository...',
  CLONING_SUCCESS: 'Repository cloned successfully!',
  START_INSTALLING: 'Installing dependencies...',
  INSTALLING_SUCCESS: 'Dependencies installed successfully!',
  START_INITIALIZING: 'Initializing git repository...',
  INITIALIZING_SUCCESS: 'Git repository initialized successfully!',
  START_UPDATING: 'Updating package.json...',
  UPDATING_SUCCESS: 'package.json updated successfully!',
  START_REMOVING: 'Removing .git folder...',
  REMOVING_SUCCESS: '.git folder removed successfully!',
};

export const INVALID_PACKAGE_NAME =
  'Please respect npm package name rules (https://docs.npmjs.com/cli/v10/configuring-npm/package-json#name)';
