export interface RenderOption {
  col: number;
  disable: boolean;
  isDrop: boolean;
}

export interface RenderVNode {
  tag: string;
  attr: any;
  option?: Partial<RenderOption>;
}

export interface RenderViewList {
  title: string;
  list: {
    show: RenderVNode;
    list: RenderVNode[];
  }[];
}

export interface ResponsiveItem {
  name: string;
  description: string;
  width: number | string;
  height: number | string;
  list?: ResponsiveItem[];
}

export interface Responsive {
  pc: ResponsiveItem;
  moblie: ResponsiveItem;
}
