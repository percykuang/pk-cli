#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 创建锁文件路径
const lockFilePath = path.join(rootDir, '.version-bump-lock');

// 检查是否已经在处理版本升级
function isVersionBumpInProgress() {
  return fs.existsSync(lockFilePath);
}

// 设置版本升级锁
function setVersionBumpLock() {
  fs.writeFileSync(lockFilePath, Date.now().toString());
}

// 清除版本升级锁
function clearVersionBumpLock() {
  if (fs.existsSync(lockFilePath)) {
    fs.unlinkSync(lockFilePath);
  }
}

// 读取最近的提交信息
function getLatestCommitMessage() {
  try {
    return execSync('git log -1 --pretty=%B').toString().trim();
  } catch (error) {
    console.error('获取最近提交信息失败:', error);
    return '';
  }
}

// 检查提交是否是自动版本升级提交
function isVersionBumpCommit(commitMessage) {
  return (
    commitMessage.includes('版本升级至') ||
    commitMessage.includes('version bump') ||
    commitMessage.includes('bump version')
  );
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

  // 如果没有明确指定，默认为null
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
  try {
    // 检查是否已经在处理版本升级
    if (isVersionBumpInProgress()) {
      console.log('版本升级已在进行中，跳过本次操作');
      return;
    }

    const commitMessage = getLatestCommitMessage();

    // 检查是否是自动版本升级提交
    if (isVersionBumpCommit(commitMessage)) {
      console.log('检测到自动版本升级提交，跳过本次操作');
      return;
    }

    // 设置锁，防止重复执行
    setVersionBumpLock();

    const versionType = determineVersionBump(commitMessage);
    bumpVersion(versionType);
  } finally {
    // 清除锁
    clearVersionBumpLock();
  }
}

main();
