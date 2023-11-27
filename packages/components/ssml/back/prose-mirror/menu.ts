import { toggleMark } from "prosemirror-commands";
import { NodeSelection } from "prosemirror-state";
import { Items } from "./plugin/menu";
import { schema } from "./schema";
import { random } from "lodash-es";

/** 图标 */
import WaitSvg from "@/icons/controller/wait.svg";
import SpeedSvg from "@/icons/controller/speed.svg";

export const menuList: Items[] = [
  {
    label: "停顿",
    icon: WaitSvg,
    enable: "none",
    type: schema.nodes.break,
    command: (state, dispatch, view) => {
      const tr = state.tr;
      const { from } = state.selection;
      const node = schema.nodes.break.create({ time: random(100, 500) });
      tr.insert(from, node);
      // 选中节点
      // const nS = NodeSelection.create(tr.doc, from);
      // tr.setSelection(nS);
      dispatch && dispatch(tr);
      return true;
    }
  },
  {
    label: "变速",
    icon: SpeedSvg,
    enable: "select",
    type: schema.nodes.speedLeft,
    command: (state, dispatch, view) => {
      const tr = state.tr;
      const { from, to } = state.selection;
      const id = Math.random().toString(32).slice(3, 10);
      const speed = random(0.5, 1.2).toFixed(2);
      tr.insert(from, schema.nodes.speedLeft.create({ id: id + "-l", speed }));
      tr.insert(to + 2, schema.nodes.speedRight.create({ id: id + "-r", speed }));
      tr.addMark(from, to + 3, schema.marks.speed.create({ id: 2222 }));
      // 选中节点
      // const nS = NodeSelection.create(tr.doc, from);
      // tr.setSelection(nS);
      dispatch && dispatch(tr);
      return true;
    }
  },
  {
    label: "Mark",
    icon: SpeedSvg,
    enable: "select",
    type: schema.marks.speed,
    command: toggleMark(schema.marks.speed, { id: Math.random().toString(36).slice(3, 10) })
  },
  {
    label: "Ss",
    icon: WaitSvg,
    enable: "none",
    type: schema.nodes.special_span,
    command: (state, dispatch, view) => {
      const tr = state.tr;
      const { from } = state.selection;
      const node = schema.nodes.special_span.create({ time: random(100, 500) });
      tr.insert(from, node);
      // 选中节点
      // const nS = NodeSelection.create(tr.doc, from);
      // tr.setSelection(nS);
      dispatch && dispatch(tr);
      return true;
    }
  },
  {
    label: "测试",
    icon: SpeedSvg,
    enable: "select",
    type: schema.marks.speed,
    command: (state, dispatch, view) => {
      // console.log(state.tr.doc.toString());
      return false;
    }
  }
];
