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

export default function (el: HTMLElement, dragOptions: DraggableOptions) {
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
}
