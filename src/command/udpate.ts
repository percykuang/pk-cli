import chalk from 'chalk';
import process from 'child_process';
import ora from 'ora';

import { log } from '@/utils';

const spinner = ora({
  text: '更新中...',
  spinner: {
    interval: 100,
    frames: ['', '◐', '◓', '◑', '◒'].map((frame) => chalk.green(frame)),
  },
});

const update = () => {
  spinner.start();
  process.exec('npm install @werk/cli@latest -g', (error) => {
    spinner.stop();
    if (error) {
      spinner.fail(chalk.red('更新失败'));
      log.error(String(error));
      return;
    }
    spinner.succeed(chalk.green('更新成功'));
  });
};

export default update;
