import { Command } from "commander";
import { version } from "../package.json";
import { create } from "./command/create";

const program = new Command("nova-cli");

program.version(version, "-v, --version");

program
  .command("create")
  .description("创建一个新项目")
  .argument("[name]", "项目名称（可选）")
  .action((dirName) => {
    create(dirName);
  });

// 解析命令行参数
program.parse();
