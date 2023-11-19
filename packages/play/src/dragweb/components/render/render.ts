import { RenderVNode } from "@/types/render";
import { defineComponent, PropType, resolveComponent, h } from "vue";

export default defineComponent({
  props: { vnode: { type: Object as PropType<RenderVNode>, required: true } },
  setup() {},
  render() {
    const { tag, attr } = this.$props.vnode;
    let component = null;
    try {
      // 这里如果是解析HTML默认的标签，会报错，所以需要捕获异常
      component = resolveComponent(tag);
    } catch (e) {}
    const { __text, __html, ...__attr } = attr;
    const slots: any = {};

    if (__html || __text) {
      slots.default = () => __html || __text;
    }

    return h(component as any, __attr, slots);
  }
});
