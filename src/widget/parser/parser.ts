/**
 * 感谢关注 Circle 阅读助手
 * 为了保持核心竞争力，我们的算法不开源哈。下面是对我们算法的简单实现，或许可以给你一个思路。
 * 如需要商务合作，请联系我，联系方式见官网
 */

export default async function (context: Document) {
  let maybeNode = {
    score: 0,
  };
  const nodes = context.body.getElementsByTagName('p');
  for (var i = 0, len = nodes.length; i < len; i++) {
    const node = nodes[i];
    let score = 1;
    const text = node.innerText;
    score += text.split(/：|。|；|，|,|\.|\?|”/).length;
    score += Math.min(Math.floor(text.length / 100), 3);
    // @ts-ignore
    typeof node.score !== 'number' && (node.score = 0);
    // @ts-ignore
    node.score += score;
    // @ts-ignore
    node.setAttribute('score', node.score);
    // @ts-ignore
    node.score > maybeNode.score && (maybeNode = node);
    let index = 0;
    let tempNode = node.parentElement;
    while (tempNode && tempNode.tagName !== 'BODY') {
      if (/div|article|section/i.test(tempNode.tagName)) {
        // @ts-ignore
        typeof tempNode.score !== 'number' && (tempNode.score = 0);
        // @ts-ignore
        tempNode.score += score / (index < 2 ? index + 2 : index * 3);
        // @ts-ignore
        tempNode.setAttribute('score', tempNode.score);
        // @ts-ignore
        tempNode.score > maybeNode.score && (maybeNode = tempNode);
        if (++index >= 3) {
          break;
        }
      }
      tempNode = tempNode.parentElement;
    }
  }
  return {
    time: '',
    cover: '',
    url: context.URL,
    article: maybeNode,
    title: context.title,
  };
}
