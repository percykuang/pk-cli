import { input, select } from "@inquirer/prompts";
import "tslib";
import { clone } from "../utils/clone";
import path from "path";
import fs from "fs-extra";
export interface TemplateInfo {
  name: string;
  downloadUrl: string;
  description: string;
  branch: string;
}

export const templates: Map<string, TemplateInfo> = new Map([
  [
    "vite-vue3-typescript-template",
    {
      name: "vite-vue3-typescript-template",
      downloadUrl: "git@github.com:percykuang/css-scope-loader.git",
      description: "vite-vue3-typescript-template",
      branch: "main",
    },
  ],
  [
    "vite-vue3-typescript-template-dev10",
    {
      name: "vite-vue3-typescript-template",
      downloadUrl: "git@gitee.com:sohucw/admin-pro.git",
      description: "vite-vue3-typescript-template",
      branch: "dev10",
    },
  ],
]);

export async function isOverwrite(dir: string): Promise<boolean> {
  console.warn(`目标目录 ${dir} 已存在`);
  return await select({
    message: "是否覆盖？",
    choices: [
      {
        name: "是",
        value: true,
      },
      {
        name: "否",
        value: false,
      },
    ],
  });
}

export async function create(projectName: string) {
  // 初始化模板列表
  const templateList = Array.from(templates).map(
    (item: [string, TemplateInfo]) => {
      const [name, info] = item;
      return {
        name,
        value: name,
        description: info.description,
      };
    }
  );
  if (!projectName) {
    projectName = await input({
      message: "请输入项目名称",
    });
  }

  // 如果文件夹已经存在，提示用户是否覆盖
  const filePath = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(filePath)) {
    const isExist = await isOverwrite(filePath);
    if (isExist) {
      await fs.remove(filePath);
    } else {
      return;
    }
  }

  const templateName = await select({
    message: "请选择模板",
    choices: templateList,
  });
  const info = templates.get(templateName);

  console.log("info", info);
  if (info) {
    clone(info.downloadUrl, projectName, ["-b", info.branch]);
  }
}
