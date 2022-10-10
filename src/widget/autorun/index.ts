class Autorun {
  filterParserHold() {
    // todo 更严格的验证
    // const node = app.data('node');
    // const article = node.article;
    // const links = maybeNode.getElementsByTagName('a');
    // // 维基百科 0.31 左右
    // if (links.length > 16 && linkDensity(maybeNode) > 0.35) {
    //   // console.log('linkDensity --->', links.length, linkDensity(maybeNode));
    //   return false;
    // }
    return false;
  }
}

window.definePlugin('autorun', Autorun);
