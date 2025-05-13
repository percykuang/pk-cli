# 自动版本控制

本项目使用语义化版本控制（Semantic Versioning）来管理版本号。版本号格式为：`主版本号.次版本号.修订号`。

## 自动版本升级

系统会根据提交信息中的关键字自动升级版本号：

1. 当提交信息包含 `(major):` 或以 `major:` 开头时，自动升级主版本号
2. 当提交信息包含 `(minor):` 或以 `minor:` 开头时，自动升级次版本号
3. 当提交信息包含 `(patch):` 或以 `patch:` 开头时，自动升级修订号

> **注意**：系统会自动检测并跳过自动生成的版本升级提交，以防止版本号无限升级的问题。

## 提交信息示例

```
feat(major): 完全重构API，不兼容旧版本
```

```
feat(minor): 添加新功能，向后兼容
```

```
fix(patch): 修复某个bug
```

## 手动版本升级

如果需要手动升级版本号，可以使用以下命令：

```bash
# 升级修订号 (0.0.1 -> 0.0.2)
npm run release:patch

# 升级次版本号 (0.0.1 -> 0.1.0)
npm run release:minor

# 升级主版本号 (0.0.1 -> 1.0.0)
npm run release:major
```

## 提交规范

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/) 规范来规范提交信息格式。

基本格式为：

```
<类型>[可选的作用域]: <描述>

[可选的正文]

[可选的脚注]
```

常用的类型包括：

- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档变更
- `style`: 代码格式（不影响代码运行的变动）
- `refactor`: 重构（既不是新增功能，也不是修改bug的代码变动）
- `perf`: 性能优化
- `test`: 增加测试
- `chore`: 构建过程或辅助工具的变动
- `revert`: 回退
- `build`: 打包
- `ci`: CI相关变更
- `patch`: 小版本升级
- `minor`: 中版本升级
- `major`: 大版本升级
