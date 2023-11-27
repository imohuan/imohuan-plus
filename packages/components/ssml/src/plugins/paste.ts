import { Fragment, Node, Schema, Slice } from "prosemirror-model";
import { Plugin } from "prosemirror-state";

import { groupNode } from "../config";
import { randId } from "../helper";

// 递归遍历并处理节点
const processNode = (idMap: Map<string, string>, node: Node) => {
  // node.isLeaf 对于voice节点来说无法正确判断
  if (groupNode.includes(node.type) && node.attrs?.id) {
    const id = node.attrs.id;
    if (!idMap.has(id)) idMap.set(id, randId());
    return node.type.create({ ...node.attrs, id: idMap.get(id) });
  } else if (node.isLeaf) {
    // 如果是叶子节点，直接返回节点
    return node;
  } else {
    // 否则，递归处理子节点
    let newContent: any = [];
    node.forEach((child) => newContent.push(processNode(idMap, child)));
    return node.copy(Fragment.fromArray(newContent));
  }
};

/**
 * 粘贴的时候判断一组的节点是否只复制了单个，如果是则补全
 * 粘贴组节点的时候对每一组组节点id进行修改
 */
export const paste = (): Plugin => {
  return new Plugin({
    props: {
      handlePaste(view, event, slice) {
        const counts: any = {};

        if (slice.content.size === 0) return false;
        if (!slice.content.firstChild) return false;

        // 重新修改Slice，将内部的组件点id进行重新生成
        const newContent: any[] = [];
        const idMap = new Map();
        slice.content.forEach((node) => newContent.push(processNode(idMap, node)));
        slice = new Slice(Fragment.fromArray(newContent), slice.openStart, slice.openEnd);

        // 获取粘贴的文档所有组节点
        slice.content.descendants((node) => {
          if (groupNode.includes(node.type)) {
            const { id, type } = node.attrs;
            if (!counts[id]) counts[id] = { left: 0, right: 0, node };
            if (type === "left" || type === "right") counts[id][type]++;
          }
        });

        // 判断粘贴到的组节点是否出现缺少
        const fileterCounts = Object.keys(counts).filter(
          (id) => counts[id].left !== counts[id].right
        );
        // 不缺少，则可以直接进行粘贴
        if (fileterCounts.length === 0) {
          const transaction = view.state.tr.replaceSelection(slice);
          view.dispatch(transaction);
          return true;
        }

        // 反则进行补全
        fileterCounts.forEach((id) => {
          const node = counts[id]["node"];
          const { left, right } = counts[id];
          const child = slice.content.firstChild!;
          let n, modifiedChild;

          if (left < right) {
            n = node.type.create({ type: "left", id });
            modifiedChild = child.copy(child.content.addToStart(n));
          }

          if (left > right) {
            n = node.type.create({ type: "right", id });
            modifiedChild = child.copy(child.content.addToEnd(n));
          }

          // slice.content[frag] => &.content.firstChild => paragraph节点列表
          // slice不允许被修改，所以这里新建一个新的Slice对象
          // 问题，当粘贴的内容包含多个组节点的时候，最外缺少一个组节点导致报错，原因是因为复制后的节点id相同，导致 left 和 right 为 3 , 4， 导致判断出错modifiedChild未定义
          const newContent = slice.content.replaceChild(0, modifiedChild!);
          slice = new Slice(newContent, slice.openStart, slice.openEnd);
        });

        view.dispatch(view.state.tr.replaceSelection(slice));
        return true;
      }
    }
  });
};
