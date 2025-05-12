import simpleGit, { SimpleGitOptions } from "simple-git";
import createLogger from "progress-estimator";
import chalk from "chalk";

// 初始化进度条
const logger = createLogger({
  spinner: {
    interval: 100,
    frames: ["", "◐", "◓", "◑", "◒"].map((frame) => chalk.green(frame)),
  },
});

const gitOptions: Partial<SimpleGitOptions> = {
  baseDir: process.cwd(),
  binary: "git",
  maxConcurrentProcesses: 6,
};

export const clone = async (
  gitUrl: string,
  projectName: string,
  options: string[]
) => {
  const git = simpleGit(gitOptions);

  // 添加环境变量跳过 SSH 主机验证
  git.env(
    "GIT_SSH_COMMAND",
    "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"
  );

  try {
    await logger(git.clone(gitUrl, projectName, options), "代码下载中...", {
      // 预计时间
      estimate: 7000,
    });
    console.log(chalk.green("代码下载成功！"));
    console.log(chalk.blackBright("============================="));
    console.log(chalk.blackBright("======== 欢迎使用 pk-cli =========="));
    console.log(chalk.blackBright("============================="));
    console.log(
      chalk.blackBright("======== 请使用 pnpm install 安装依赖 ==========")
    );
    console.log(chalk.blackBright("======= pnpm run dev 运行项目 =========="));
  } catch (error) {
    console.error(error);
    console.error(chalk.red("代码下载失败！"));
  }
};
