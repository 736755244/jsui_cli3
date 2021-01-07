const path = require('path')

const MarkdownItContainer = require('markdown-it-container')
const striptags = require('./config/strip-tags')
const utils = require('./config/utils')

const CopyWebpackPlugin = require('copy-webpack-plugin')

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}
  
module.exports = {
    // 修改默认的入口
    pages: {
        index: {
            entry: 'examples/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            title: '首页',
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        }
    },
    lintOnSave: false,
    productionSourceMap: false,
    devServer: {
        // index: 'main.html', // 为了可以展示目录
        // contentBase: __dirname, // 默认值就是项目根目录
        port: 8083,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        }
    },
    configureWebpack: {
      resolve: {
        modules: [
          resolve('src'),
          resolve('node_modules')
        ],
        alias: {
          '@': resolve('example'),
          '~': resolve('packages')
        }
      }
    },
    chainWebpack: config => {
        // vue默认@指向src目录，这里要修正为examples，另外新增一个~指向packages
        config.resolve.alias
            .set('@', path.resolve('examples'))
            .set('~', path.resolve('packages'));
        // lib目录是组件库最终打包好存放的地方，不需要eslint检查
        // examples/docs是存放md文档的地方，也不需要eslint检查
        config.module
            .rule('eslint')
            .exclude.add(path.resolve('lib'))
            .end()
            .exclude.add(path.resolve('examples/docs'))
            .end();
        // packages和examples目录需要加入编译
        config.module
            .rule('js')
            .include.add(/packages/)
            .end()
            .include.add(/examples/)
            .end()
            .use('babel')
            .loader('babel-loader')
            .tap(options => {
                // 修改它的选项...
                return options;
            });
        config.module.rule('md')
            .test(/\.md/)
            .use('vue-loader')
            .loader('vue-loader')
            .end()
            .use('vue-markdown-loader')
            .loader('vue-markdown-loader/lib/markdown-compiler')
            .options({
                raw:true,
                preprocess: (MarkdownIt, source) => {
                    MarkdownIt.renderer.rules.table_open = function () {
                      return '<table class="table">'
                    }
                    MarkdownIt.renderer.rules.fence = utils.wrapCustomClass(MarkdownIt.renderer.rules.fence)
                
                    // ```html `` 给这种样式加个class hljs
                    //  但是markdown-it 有个bug fence整合attr的时候直接加载class数组上而不是class的值上
                    //  markdown-it\lib\renderer.js 71行 这么修改可以修复bug
                    //  tmpAttrs[i] += ' ' + options.langPrefix + langName; --> tmpAttrs[i][1] += ' ' + options.langPrefix + langName;
                    // const fence = MarkdownIt.renderer.rules.fence 
                    // MarkdownIt.renderer.rules.fence = function(...args){
                    //   args[0][args[1]].attrJoin('class', 'hljs')
                    //   var a = fence(...args)
                    //   return a
                    // }
                
                    // ```code`` 给这种样式加个class code_inline
                    const code_inline = MarkdownIt.renderer.rules.code_inline
                    MarkdownIt.renderer.rules.code_inline = function(...args){
                      args[0][args[1]].attrJoin('class', 'code_inline')
                      return code_inline(...args)
                    }
                    return source
                  },
                  use: [
                    [MarkdownItContainer, 'demo', {
                      validate: params => params.trim().match(/^demo\s*(.*)$/),
                      render: function(tokens, idx) {
                
                        var m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
                
                        if (tokens[idx].nesting === 1) {
                          var desc = tokens[idx + 2].content;
                          const html = utils.convertHtml(striptags(tokens[idx + 1].content, 'script'))
                          // 移除描述，防止被添加到代码块
                          tokens[idx + 2].children = [];
                
                          return `<demo-block>
                                        <div slot="desc">${html}</div>
                                        <div slot="highlight">`;
                        }
                        return '</div></demo-block>\n';
                      }
                    }]
                  ]
            })
    },
    configureWebpack: {
      plugins: [
        new CopyWebpackPlugin([
          { 
            from: './packages/theme-default/lib',
            to:'./theme-default/',
            ignore: ['node_modules']
          }
        ])
      ]
    }
};
