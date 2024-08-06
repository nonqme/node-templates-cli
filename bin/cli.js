#!/usr/bin/env node

import sade from 'sade';

const prog = sade('nt');

prog.version('0.0.1');

prog.command('init').action(() => {
  console.log('init');
});

prog.parse(process.argv);
