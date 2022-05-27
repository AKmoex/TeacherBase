module.exports = {
  "singleQuote":true,  //字符串用单引号，默认双引号
  "printWidth": 100, // 超过最大值换行,默认80
  "tabWidth": 2, // 默认缩进字节数
  "useTabs": false, // 默认缩进不使用tab，使用空格
  "semi": false, // 句尾不添加分号，默认加
  "trailingComma": "none",//对象最后一个元素不加尾逗号，默认es5加逗号
  "bracketSpacing": true, // 默认在对象，数组括号与文字之间加空格 "{ foo: bar }"
  "endOfLine": "lf", // 默认行结尾是 \n 
  "ignorePath": ".prettierignore", // 不使用prettier格式化的文件填写在项目的.prettierignore文件中
  "proseWrap": "preserve", // 默认值。因为使用了一些折行敏感型的渲染器（如GitHub comment）而按照markdown文本样式进行折行
  "htmlWhitespaceSensitivity": "ignore",//html中空格不敏感
  "vueIndentScriptAndStyle": false,//默认Vue script和style标签中的内容不缩进
}