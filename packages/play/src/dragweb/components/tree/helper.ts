export const getDistance = (distance: number, height = 0) => {
  if (distance < 1) {
    return Number((height * distance).toFixed(2));
  } else {
    return distance;
  }
};

// 获取目标元素在父节点中的索引
export const getParentIndex = (el: HTMLElement): number => {
  const parent = el.parentElement;
  if (parent) {
    const children = parent.children;
    for (let i = 0; i < children.length; i++) {
      if (children[i] === el) {
        return i;
      }
    }
  }
  return -1;
};

/**
 * 计算鼠标在元素中的位置
 * @param quantity 判断距离
 * @param offset 鼠标位置
 * @param container 元素高宽
 * @returns {number} 返回位置信息 -1， 0， 1
 */
export const getDistanceInElement = (
  quantity: number,
  offset: { x: number; y: number },
  container: { width: number; height: number },
  shaft: "x" | "xy" | "y" | "auto" = "auto"
) => {
  const { x, y } = offset;
  const { width, height } = container;
  const distanceX = getDistance(quantity, width);
  const distanceY = getDistance(quantity, height);

  const xl = x < width / 2 && y < distanceX;
  const xr = x > width / 2 && y > distanceX;
  const yl = y < height / 2 && y < distanceY;
  const yr = y > height / 2 && y > distanceY;

  if (shaft === "x") {
    return xl ? -1 : xr ? 1 : 0;
  } else if (shaft === "y") {
    return yl ? -1 : yr ? 1 : 0;
  } else if (shaft === "xy") {
    return xl || yl ? -1 : xr || yr ? 1 : 0;
  } else {
    return width > height ? (xl ? -1 : xr ? 1 : 0) : yl ? -1 : yr ? 1 : 0;
  }
};

// 判断父节点中是否存在子节点
export const hasChildrenElement = (parent: HTMLElement, el: HTMLElement) => {
  console.log("hasChildrenElement", parent, el, parent == el);
  if (parent === el) return true;
  const childrens: HTMLElement[] = parent.children as any;
  if (childrens.length === 0) return false;

  for (let i = 0; i < childrens.length; i++) {
    const item = childrens[i];
    const result = hasChildrenElement(item, el);
    if (result) return true;
  }
  return false;
};
