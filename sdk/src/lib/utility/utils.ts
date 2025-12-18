import { Dict } from "./ik-type-def-collection";

export function getInt(x: unknown): number {
  if (typeof x === 'undefined') {
    return NaN
  }
  if (typeof x === 'number') {
    return Number.isFinite(x) ? x : NaN
  }
  if (typeof x === 'string' && /^[0-9]+$/.test(x)) {
    return parseInt(x, 10)
  }
  return NaN
}

export function namedNodeMapToObject(source: NamedNodeMap): Dict {
  let target: Dict = {};
  Object.keys(source).forEach(index => {
    const name = source[index].name;
    const value = source[index].value;
    target[name] = value;
  });
  return target;
};

export function setElementAttributes(element: any, attributesLiteral: Dict, selector: string): void {
  Object.keys(attributesLiteral).forEach(attrName => {
    if (attrName.startsWith('ng-') || attrName.startsWith('_ng')) {
      element.removeAttribute(attrName);
      return;
    }
    element.setAttribute(attrName, attributesLiteral[attrName]);
    // This is required otherwise video attributes like muted, controls, autoplay do not work as expected.
    if (selector === 'ik-video') {
      const videoPlaybackAttributes = ['autoplay', 'muted', 'controls', 'loop'];
      if (videoPlaybackAttributes.includes(attrName)) {
        element[attrName] = true;
      }
    }
  });
}