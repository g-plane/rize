(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{52:function(t,s,a){"use strict";a.r(s);var n=a(0),e=Object(n.a)({},function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"faq"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#faq","aria-hidden":"true"}},[t._v("#")]),t._v(" FAQ")]),t._v(" "),a("h2",{attrs:{id:"为什么叫-“rize”"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#为什么叫-“rize”","aria-hidden":"true"}},[t._v("#")]),t._v(" 为什么叫 “Rize”?")]),t._v(" "),a("p",[t._v("“Rize” 是《"),a("a",{attrs:{href:"https://zh.moegirl.org/%E8%AF%B7%E9%97%AE%E6%82%A8%E4%BB%8A%E5%A4%A9%E8%A6%81%E6%9D%A5%E7%82%B9%E5%85%94%E5%AD%90%E5%90%97",target:"_blank",rel:"noopener noreferrer"}},[t._v("请问您今天要来点兔子吗？"),a("OutboundLink")],1),t._v("》中的一个角色。")]),t._v(" "),a("p",[t._v("她全名是“天天座理世”，日语写作“リゼ”。")]),t._v(" "),a("p",[t._v("所以 “Rize” 的发音是 /ɾize/，而不是 /raɪzɪ/.")]),t._v(" "),a("h2",{attrs:{id:"你为什么会创建这个库？"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#你为什么会创建这个库？","aria-hidden":"true"}},[t._v("#")]),t._v(" 你为什么会创建这个库？")]),t._v(" "),a("p",[t._v("Puppeteer 在控制 Chromium/Chrome 方面干得很好，我们也可以利用 puppeteer 来做爬虫、自动化 UI 测试等等。然而，编写使用 puppeteer 的代码并不优雅、并不简单。")]),t._v(" "),a("p",[t._v("下面是一个直接使用 puppeteer 的例子：")]),t._v(" "),a("div",{staticClass:"language-javascript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{attrs:{class:"token keyword"}},[t._v("const")]),t._v(" puppeteer "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token function"}},[t._v("require")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token string"}},[t._v("'puppeteer'")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token keyword"}},[t._v("async")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{attrs:{class:"token keyword"}},[t._v("const")]),t._v(" browser "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("await")]),t._v(" puppeteer"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{attrs:{class:"token function"}},[t._v("launch")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),a("span",{attrs:{class:"token keyword"}},[t._v("const")]),t._v(" page "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("await")]),t._v(" browser"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{attrs:{class:"token function"}},[t._v("newPage")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),a("span",{attrs:{class:"token keyword"}},[t._v("await")]),t._v(" page"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{attrs:{class:"token function"}},[t._v("goto")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token string"}},[t._v("'https://github.com'")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),a("span",{attrs:{class:"token keyword"}},[t._v("await")]),t._v(" page"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{attrs:{class:"token function"}},[t._v("screenshot")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" path"),a("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{attrs:{class:"token string"}},[t._v("'github.png'")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),a("span",{attrs:{class:"token keyword"}},[t._v("await")]),t._v(" browser"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{attrs:{class:"token function"}},[t._v("close")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),a("p",[t._v("正如您所见，puppeteer 的大多数的操作是异步的。因此我们必须使用 ES2017 的语法 "),a("code",[t._v("async/await")]),t._v("。（你说使用 "),a("code",[t._v("Promise")]),t._v("？那只会让代码变得难以阅读！）")]),t._v(" "),a("p",[t._v("这还只是一个小小的例子。要是在一个大项目里，将会满是 "),a("code",[t._v("await")]),t._v(" 关键字。")]),t._v(" "),a("p",[t._v("这就是我创建这个库的原因。"),a("em",[t._v("并且受到了 jQuery 和 Laravel Dusk 的启发。")])]),t._v(" "),a("p",[t._v("现在来看看使用 Rize 的例子：")]),t._v(" "),a("div",{staticClass:"language-javascript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{attrs:{class:"token keyword"}},[t._v("const")]),t._v(" Rize "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token function"}},[t._v("require")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token string"}},[t._v("'rize'")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{attrs:{class:"token keyword"}},[t._v("const")]),t._v(" rize "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{attrs:{class:"token class-name"}},[t._v("Rize")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\nrize\n  "),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{attrs:{class:"token function"}},[t._v("goto")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token string"}},[t._v("'https://github.com'")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{attrs:{class:"token function"}},[t._v("saveScreenshot")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token string"}},[t._v("'github.png'")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{attrs:{class:"token function"}},[t._v("end")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),a("p",[t._v("不再有多余的代码，同时变得优雅！")]),t._v(" "),a("p",[t._v("另外，这个库还提供了一些有用的用于测试的断言方法，例如 "),a("code",[t._v("assertUrlIs")]),t._v("。")]),t._v(" "),a("h2",{attrs:{id:"我还能访问-puppeteer-的浏览器实例并且调用-puppeteer-的-api-吗？"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#我还能访问-puppeteer-的浏览器实例并且调用-puppeteer-的-api-吗？","aria-hidden":"true"}},[t._v("#")]),t._v(" 我还能访问 puppeteer 的浏览器实例并且调用 puppeteer 的 API 吗？")]),t._v(" "),a("p",[t._v("当然可以！")]),t._v(" "),a("p",[t._v("Rize 并不会阻止您调用 puppeteer 所有可用的方法。您只需要访问 "),a("code",[t._v("Rize")]),t._v(" 实例上的 "),a("code",[t._v("browser")]),t._v(" 或 "),a("code",[t._v("page")]),t._v(" 属性：")]),t._v(" "),a("div",{staticClass:"language-javascript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{attrs:{class:"token keyword"}},[t._v("const")]),t._v(" Rize "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token function"}},[t._v("require")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token string"}},[t._v("'rize'")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{attrs:{class:"token keyword"}},[t._v("const")]),t._v(" rize "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{attrs:{class:"token class-name"}},[t._v("Rize")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\nrize"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("browser  "),a("span",{attrs:{class:"token comment"}},[t._v("// 这等同于 puppeteer.Browser")]),t._v("\nrize"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("page     "),a("span",{attrs:{class:"token comment"}},[t._v("// 这等同于 puppeteer.Page")]),t._v("\n")])])]),a("h2",{attrs:{id:"我可以将这个库和其它的测试框架一起使用吗（例如-jest、-mocha-等等）？"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#我可以将这个库和其它的测试框架一起使用吗（例如-jest、-mocha-等等）？","aria-hidden":"true"}},[t._v("#")]),t._v(" 我可以将这个库和其它的测试框架一起使用吗（例如 Jest、 mocha 等等）？")]),t._v(" "),a("p",[t._v("您可以使用任何您喜欢的测试框架。")]),t._v(" "),a("h3",{attrs:{id:"对于-jest-用户"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#对于-jest-用户","aria-hidden":"true"}},[t._v("#")]),t._v(" 对于 Jest 用户")]),t._v(" "),a("p",[t._v("我们推荐使用 Jest。您不需要修改任何配置。")]),t._v(" "),a("h3",{attrs:{id:"对于-mocha-用户"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#对于-mocha-用户","aria-hidden":"true"}},[t._v("#")]),t._v(" 对于 Mocha 用户")]),t._v(" "),a("p",[t._v("您不需要修改任何配置。")]),t._v(" "),a("p",[t._v("不过，由于 Mocha 的限制，您不能同时使用 "),a("code",[t._v("done")]),t._v(" 回调和 "),a("code",[t._v("async/await")]),t._v("。")]),t._v(" "),a("p",[t._v("您应该像下面这样做：")]),t._v(" "),a("div",{staticClass:"language-javascript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{attrs:{class:"token function"}},[t._v("describe")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token string"}},[t._v("'some tests'")]),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{attrs:{class:"token function"}},[t._v("it")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token string"}},[t._v("'a test'")]),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("async")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{attrs:{class:"token keyword"}},[t._v("const")]),t._v(" rize "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{attrs:{class:"token class-name"}},[t._v("Rize")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),a("span",{attrs:{class:"token comment"}},[t._v("// 做点别的……")]),t._v("\n    "),a("span",{attrs:{class:"token keyword"}},[t._v("await")]),t._v(" rize"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{attrs:{class:"token function"}},[t._v("end")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),a("p",[t._v("下面是个反面例子：")]),t._v(" "),a("div",{staticClass:"language-javascript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-javascript"}},[a("code",[a("span",{attrs:{class:"token function"}},[t._v("describe")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token string"}},[t._v("'some tests'")]),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{attrs:{class:"token function"}},[t._v("it")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token string"}},[t._v("'a test'")]),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("async")]),t._v(" done "),a("span",{attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{attrs:{class:"token keyword"}},[t._v("const")]),t._v(" rize "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{attrs:{class:"token class-name"}},[t._v("Rize")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),a("span",{attrs:{class:"token comment"}},[t._v("// 做点别的……")]),t._v("\n    rize"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{attrs:{class:"token function"}},[t._v("end")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("done"),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),a("h3",{attrs:{id:"对于-ava-用户"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#对于-ava-用户","aria-hidden":"true"}},[t._v("#")]),t._v(" 对于 AVA 用户")]),t._v(" "),a("p",[t._v("您应该在 "),a("code",[t._v("package.json")]),t._v(" 中把 "),a("code",[t._v("failWithoutAssertions")]),t._v(" 设为 "),a("code",[t._v("false")]),t._v("。")])])},[],!1,null,null,null);e.options.__file="faq.md";s.default=e.exports}}]);