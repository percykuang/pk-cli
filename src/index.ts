#!/usr/bin/env node
import { Command } from 'commander';

import { create, update } from '@/command';

import { version } from '../package.json';

const program = new Command('werk-cli');

program.version(version, '-v, --version');

program.command('update').description('更新werk-cli').action(update);

program
  .command('create')
  .description('创建一个新项目')
  .argument('[name]', '项目名称（可选）')
  .action(create);

program.parse();
