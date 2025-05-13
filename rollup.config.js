import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

import path from 'path';
import { defineConfig } from 'rollup';
import externals from 'rollup-plugin-node-externals';
import typescript from 'rollup-plugin-typescript2';
import { fileURLToPath } from 'url';

// 获取绝对路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRootDir = path.resolve(__dirname);

export default defineConfig([
  {
    input: {
      // 入口文件
      index: 'src/index.ts',
    },
    output: [
      {
        // 输出目录
        dir: 'dist',
        // 输出格式，cjs表示commonjs格式，es表示es模块格式，umd表示umd模块格式，iife表示自执行函数格式，auto表示自动判断
        format: 'es',
      },
    ],
    plugins: [
      // 配置路径别名
      alias({
        entries: [{ find: '@', replacement: path.resolve(projectRootDir, 'src') }],
      }),
      // 解析node_modules中的模块
      nodeResolve(),
      externals({
        // 意味着开发依赖会被打包进最终产物
        devDeps: false,
      }),
      // 解析json文件
      json(),
      // 解析ts文件
      typescript(),
      // 解析commonjs模块
      commonjs(),
      // 压缩代码
      terser(),
    ],
  },
]);
