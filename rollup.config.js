import { defineConfig } from "rollup";
import externals from "rollup-plugin-node-externals";
import nodeResolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

export default defineConfig([
  {
    input: {
      // 入口文件
      index: "src/index.ts",
    },
    output: [
      {
        // 输出目录
        dir: "dist",
        // 输出格式，cjs表示commonjs格式，es表示es模块格式，umd表示umd模块格式，iife表示自执行函数格式，auto表示自动判断
        format: "es",
      },
    ],
    plugins: [
      // 解析node_modules中的模块
      nodeResolve(),
      externals({
        // 可以识别 package.json 中的 devDependencies 依赖，当做外部依赖
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
