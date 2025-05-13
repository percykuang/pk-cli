#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 读取最近的提交信息
function getLatestCommitMessage() {
  try {
    return execSync('git log -1 --pretty=%B').toString().trim();
  } catch (error) {
    console.error('获取最近提交信息失败:', error);
    return '';
  }
}

// 根据提交信息确定版本升级类型
function determineVersionBump(commitMessage) {
  if (commitMessage.includes('(major):') || commitMessage.match(/^major(\(.+\))?:/)) {
    return 'major';
  } else if (commitMessage.includes('(minor):') || commitMessage.match(/^minor(\(.+\))?:/)) {
    return 'minor';
  } else if (commitMessage.includes('(patch):') || commitMessage.match(/^patch(\(.+\))?:/)) {
    return 'patch';
  }

  // 如果没有明确指定，默认为补丁版本
  return null;
}

// 执行版本升级
function bumpVersion(type) {
  if (!type) {
    console.log('没有检测到版本升级标记，跳过版本升级');
    return;
  }

  try {
    console.log(`执行 ${type} 版本升级...`);
    execSync(`npm version ${type} --no-git-tag-version`, { stdio: 'inherit' });

    // 获取新版本号
    const packageJsonPath = path.join(rootDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const newVersion = packageJson.version;

    console.log(`版本已升级至 ${newVersion}`);

    // 提交版本变更
    execSync('git add package.json', { stdio: 'inherit' });
    execSync(`git commit --amend --no-edit`, { stdio: 'inherit' });

    console.log('版本升级完成');
  } catch (error) {
    console.error('版本升级失败:', error);
    process.exit(1);
  }
}

// 主函数
function main() {
  const commitMessage = getLatestCommitMessage();
  const versionType = determineVersionBump(commitMessage);
  bumpVersion(versionType);
}

main();
