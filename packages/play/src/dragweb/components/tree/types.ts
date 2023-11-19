export type DirectionType = "before" | "after" | "over" | "none";

export interface TreeNodeItem {
  title: string;
  children?: TreeNodeItem[];
  option: {
    title: string;
    disabled: boolean;
    noChildren: boolean;
  };
  [key: string]: any;
}

export interface DragItemData {
  el: HTMLElement;
  parent: TreeNodeItem[];
  current: TreeNodeItem;
  container: HTMLElement;
}

export interface DragData {
  start: DragItemData | null;
  end: DragItemData | null;
}
