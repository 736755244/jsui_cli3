<p align="center">
  <a href="https://at.aotu.io/">
    <img width="200" src="https://github.com/736755244/JSUI/examples/assets/img/logo.png">
  </a>
</p>

# 公告
感谢支持，欢迎一起学习交流。

# JoySuch UI

`JoySuch-UI` 是一款基于 `Vue.js 2.0` 的前端 UI 组件库，主要用于快速开发 PC 网站中后台产品
[演示地址](https://736755244.github.io/IView)


## 浏览器支持

- 现代浏览器和 IE9 及以上

## 安装

- npm 

```bash
npm install joysuch_cli3 --save
```

## 使用

```js
import JSUI from 'joysuch_cli3' // 引入组件库
import 'joysuch_cli3/lib/theme-default/index.css' // 引入样式库

Vue.use(JSUI)

```

## 贡献

如果你在使用 `JoySuchUI` 时遇到问题，或者有好的建议，欢迎给我们提 [Issue](https://github.com/736755244/JSUI/issues) 或 [Pull Request](https://github.com/736755244/JSUI/pulls)


## Pull requests 规范

**Working on your first Pull Request?** You can learn how from this *free* series
[How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

All pull requests are welcome. Thanks for taking the time to contribute.

- Create an issue about the features, such as new components.
- Fork the repo to your own account.
- Clone your fork.
- Create a new branch base on `dev`, if you want to add new component, the branch name should be formatted as `component-[Component Name]`. (e.g. `component-steps`) And the commit info should be formatted as `[Component Name]: Info about commit`.
- Make sure that running `npm run prepublish` outputs the correct files.
- Rebase before creating a PR to keep commit history clear. (Merge request to branch `dev`)
- Provide some description about your PR.
