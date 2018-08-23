module.exports = {
  evergreen: true,
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Documentation of Rize',
      description: 'Rize is a high-level, fluent and chainable API provided library which let you use puppeteer simply.',
    },
    '/zh-CN/': {
      lang: 'zh-CN',
      title: 'Rize 文档',
      description: 'Rize 是一个提供顶层的、流畅并且可以链式调用的 API 的库，它能让您简单地使用 puppeteer。',
    },
  },
  themeConfig: {
    locales: {
      '/': {
        selectText: 'Languages',
        label: 'English',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        sidebar: [
          '/',
          '/getting-started',
          '/page',
          '/interaction',
          '/find-elements',
          '/testing',
          '/retrieval',
          '/faq',
        ],
      },
      '/zh-CN/': {
        selectText: '选择语言',
        label: '简体中文',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '最后更新于',
        sidebar: [
          '/zh-CN/',
          '/zh-CN/getting-started',
          '/zh-CN/page',
          '/zh-CN/interaction',
          '/zh-CN/find-elements',
          '/zh-CN/testing',
          '/zh-CN/retrieval',
          '/zh-CN/faq',
        ],
      },
    },
    nav: [
      { text: 'API', link: 'https://rize.js.org/api/modules/_index_.html' },
    ],
    repo: 'g-plane/rize',
    repoLabel: 'GitHub',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: true,
  }
}
