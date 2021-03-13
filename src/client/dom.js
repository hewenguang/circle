export function tag(node, tagName){
  return node && node.tagName && utils.toLower(node.tagName) === tagName;
}

export function setStyle(node, attr, value) {
  if (!node || !utils.isString(attr) || utils.isUndefined(value)) {
    return;
  }
  const attrValue = utils.isNumber(value) && !['zIndex', 'opacity'].includes(attr) ? `${value}px` : value;
  node.style[attr] = attrValue;
}

export function setAttr(node, attr, value){
  if (!node || !node.setAttribute || !utils.isString(attr) || utils.isUndefined(value)) {
    return;
  }
  const attrValue = utils.isNumber(value) && !['zIndex', 'opacity'].includes(attr) ? `${value}px` : value;    
  switch (attr) {
    case 'innerHTML':
    case 'innerText':
    case 'className':
    case 'textContent':
      node[attr] = attrValue;
      break;
    case 'style':
      utils.each(value, (itemValue, itemKey) => {
        setStyle(node, itemKey, itemValue);
      });
    break;
    default:
      node.setAttribute(attr, attrValue);
  }
}

export function create(tagName, attrs){
  const node = document.createElement(tagName);
  utils.each(attrs, (value, key) => {
    setAttr(node, key, value);
  });
  return node;
}

export function remove(node){
  node && node.parentElement && node.parentElement.removeChild(node);
}

export function getAttr(node, attr) {
  if (!node || !node.getAttribute || !utils.isString(attr)) {
    return;
  }
  return node.getAttribute(attr);
}

export function removeAttr(node, attr) {
  if (!node || !node.removeAttribute || !utils.isString(attr)) {
    return;
  }
  node.removeAttribute(attr);
}

export function getStyle(node, property) {
  if (node[property]) {
    return node[property];
  }
  if (node.style[property]) {
    return node.style[property];
  }
  if (window.getComputedStyle) {
    return window.getComputedStyle(node, null)[property];
  }
  if (node.currentStyle) {
    return node.currentStyle[property];
  }
}

export function position(node) {
  if (!node || !node.getBoundingClientRect) {
    return;
  }
  return node.getBoundingClientRect();
}

export function visible(node) {
  if (!utils.isElement(node)) {
    return false;
  }
  if (tag(node, 'body')) {
    return true;
  }
  if (
    '0' === getStyle(node, 'opacity') ||
    'none' === getStyle(node, 'display') ||
    'hidden' === getStyle(node, 'visibility')
  ) {
    return false;
  }
  const nodeRect = position(node);
  return nodeRect.height > 0 || nodeRect.width > 0; 
}

export function parents(node, maxAncestor = 3, condition) {
  let i = 0;
  let tempNode = node.parentElement;
  const ancestors = [];
  while (tempNode && !tag(tempNode, 'html')) {
    if(utils.isFunction(condition) && condition(tempNode)){
      ancestors.push(tempNode);
      if (++i >= maxAncestor) {
        break;
      }
    }
    tempNode = tempNode.parentElement;
  }
  return ancestors;
}

export function nodeText(node) {
  if (node && node.nodeType && node.nodeType === 1) {
    return (node.innerText || '').replace(/&nbsp;/ig, '');
  }
  return '';
}

export function linkDensity(node) {
  const links = node.getElementsByTagName('a');
  let linkTextLength = 0;
  utils.each(links, (link) => {
    linkTextLength += nodeText(link).length;
  });
  const nodeTextLength = nodeText(node).length;
  return linkTextLength / (nodeTextLength <= 0 ? 1 : nodeTextLength);
}

export function disableStyleSheets(disabled, callback){
  utils.each(document.styleSheets, styleSheet => {
    if(utils.isFunction(callback) && callback(styleSheet)){
      styleSheet.disabled = disabled;
    }
  });
}

export function siblings(node, callback) {
  if (!node || !node.parentElement) {
    return;
  }
  let tempNode = node.parentElement.firstElementChild;
  while (tempNode && !tag(tempNode, 'body')) {
    if (tempNode !== node) {
      utils.isFunction(callback) && callback(tempNode);
    }
    tempNode = tempNode.nextElementSibling;
  }
}

export function parentExcept(node, callback) {
  if (!node || !node.parentElement) {
    return;
  }
  let tempNode = node;
  while (tempNode && !tag(tempNode, 'body')){
    siblings(tempNode, item => {
      utils.isFunction(callback) && callback(item);
    });
    tempNode = tempNode.parentElement;
    // utils.isFunction(parentCallback) && parentCallback(tempNode);
  }
  // utils.isFunction(parentCallback) && parentCallback(tempNode);
}

// export function parentBoth(node,target){
//   for(;node;node = node.parentElement){
//     if(node.contains(target)){
//       return node;
//     }
//   }
// }

// export function getSelector(node, withoutClass, index = 1){
//   if(!utils.isElement(node)){
//     console.error('node utils.is valid');
//     return;
//   }
//   const id = node.id;
//   if (id) {
//     return `#${id}`;
//   }
//   if (tag(node, 'body')){
//     return 'body';
//   }
//   let selector = `> ${utils.toLower(node.tagName)}`;
//   if(!withoutClass || index <= 1){
//     const className = node.className.trim();
//     const classes = className.length > 0 ? className.split(' ') : [];
//     classes.length > 0 && (selector += `.${classes.join('.')}`);
//   }
//   const parentElement = node.parentElement;
//   if(parentElement){
//     return getSelector(parentElement, withoutClass, index + 1) + ' ' + selector;
//   } else {
//     return selector;
//   }
// }
