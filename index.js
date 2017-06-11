"use strict";

const getInstalledPath = require('get-installed-path');
const fs = require('fs-extra');
const path = require('path');

const mermaidRegex = /^```mermaid((.*\n)+?)?```$/im;
const pluginName = 'mermaid-2';

function getAssets() {
  const theme = this.config.get('pluginsConfig.mermaid-2.theme') || null;
  const css = [
    'mermaid/mermaid.css'
  ];

  if (theme) {
    css.push('mermaid/mermaid.' + theme + '.css');
  }

  fs.copySync(path.join(getInstalledPath.sync('mermaid', {local: true}), 'dist'),
      path.join(this.output.root(), 'gitbook', 'gitbook-plugin-mermaid-2', 'mermaid'));

  return {
    assets: './book',
    css: css,
    js: [
      'mermaid/mermaid.js',
      'plugin.js'
    ]
  }
}

function beforePage(page) {
  let match;

  while (match = mermaidRegex.exec(page.content)) {
    var rawBlock = match[0];
    var mermaidContent = match[1];
    page.content = page.content.replace(rawBlock, '<div class="mermaid">' +
        mermaidContent + '</div>');
  }

  return page;
}

module.exports = {
  book: getAssets,
  hooks: {
    'page:before': beforePage
  }
};
