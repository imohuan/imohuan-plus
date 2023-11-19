import { isFunction, get } from "lodash-es";

type HandleEvent = (event: MouseEvent) => void;

interface DraggableOptions {
  start: HandleEvent | any;
  move: HandleEvent | any;
  end: HandleEvent | any;
}

const callFunction = (dragOptions: DraggableOptions, name: "start" | "move" | "end", ...args: any[]) => {
  const func = get(dragOptions, name, false);
  if (isFunction(func)) func(...args);
};

export const setDrag = (el: HTMLElement, dragOptions: DraggableOptions) => {
  const handleStart = (e: MouseEvent) => {
    callFunction(dragOptions, "start", e);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
  };

  const handleMove = (e: MouseEvent) => {
    callFunction(dragOptions, "move", e);
  };

  const handleEnd = (e: MouseEvent) => {
    callFunction(dragOptions, "end", e);
    window.removeEventListener("mousemove", handleMove);
    window.removeEventListener("mouseup", handleEnd);
  };

  el.addEventListener("mousedown", handleStart);
};

export const setDragMove = (el: HTMLElement, move: (el: HTMLElement, event: MouseEvent) => void) => {
  let startEl: HTMLElement;
  const defaultHandleMove = (e: MouseEvent) => move(startEl, e);
  setDrag(el, { start: (e: MouseEvent) => (startEl = e.target as any), move: defaultHandleMove, end: defaultHandleMove });
};

export const getParseInt = (num: number, fractionDigits = 2): number => {
  return +num.toFixed(fractionDigits);
};

export const getPosition = (el: HTMLElement, e: MouseEvent) => {
  const rect = el.getBoundingClientRect();
  const { x, y } = { x: e.clientX, y: e.clientY };
  const targetX = (x < rect.left ? rect.left : x > rect.right ? rect.right : x) - rect.left;
  const targetY = (y < rect.top ? rect.top : y > rect.bottom ? rect.bottom : y) - rect.top;
  const scaleX = getParseInt(targetX / rect.width);
  const scaleY = getParseInt(targetY / rect.height);
  return { x: targetX, y: targetY, scaleX, scaleY };
};
