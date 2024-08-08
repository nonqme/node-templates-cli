#!/usr/bin/env node

import sade from 'sade';

import { init } from '../src/index.js';

const prog = sade('nt');

prog.version('0.0.1');

prog.command('init').action(() => {
  init();
});

prog.parse(process.argv);
