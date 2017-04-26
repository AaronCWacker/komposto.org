import {
  getInitialState, updateState, getState,
  setState, exists, set as setKey, get as getKey
} from './state';

export const setup = context => (key, value) => (
  !exists(key) && setKey(key, value)
);

export const set = context => (key, value) => (
  setKey(key, value)
);

export const get = context => (key, value) => (
  getKey(key, value)
);

export const radian = context => degree => (
  degree * Math.PI / 180
);

export const rotate = context => degree => (
  context.rotate(radian(context)(degree))
);

export const translate = context => (x, y) => (
  context.translate(x, y)
);

export const pushMatrix = context => _ => (
  context.save()
);

export const popMatrix = context => _ => (
  context.restore()
);

export const moveTo = context => (x1, y1) => (
  context.translate(x1, y1),
  context.moveTo(0, 0)
);

export const width = (_, canvas) => (x1, y1) => (
  canvas.width
);

export const height = (_, canvas) => (x1, y1) => (
  canvas.height
);

export const fill = context => style => (
  context.fillStyle = style
);

export const stroke = context => style => (
  context.strokeStyle = style
);

export const lineTo = context => (x1, y1) => (
  context.beginPath(),
  context.moveTo(0, 0),
  context.lineTo(x1, y1),
  context.stroke(),
  context.closePath()
);

export const rect = context => (x1, y1, width, height) => (
  context.fillRect(x1, y1, width, height)
);

export const line = context => (x1, y1, x2, y2) => (
  moveTo(context)(x1, y1),
  lineTo(context)(x2, y2)
);

export const circle = context => (x1 = 0, y1 = 0, radius = 5) => (
  context.beginPath(),
  context.arc(x1, y1, radius, 0, 2 * Math.PI, false),
  context.fill(),
  context.closePath()
);

export const range = _ => (start, end, step) => {
  const _end = end || start;
  const _start = end ? start : 0;
  const _step = step || 1;
  return (
    Array(
      (_end - _start) / _step
    ).fill(
      0
    ).map(
      (v, i) => _start + (i * _step)
    )
  )
};

export const random = _ => (min, max) => (
  typeof min !== 'undefined'
  ? Math.floor(Math.random() * (max - min + 1 ) + min)
  : Math.random()
);

export const rollDice = _ => _ => (
  random(_)(1, 6)
);

export const flipCoin = _ => (times = 1) => (
  new Array(times)
    .fill(0)
    .map(() => Boolean(random(_)(0, 1)))
    .reduce(
      (prev, curr) => prev && curr,
      true
    )
);

export const clear = (context, canvas) => (x1, y1, width, height) => (
  context.clearRect(
    -1 * canvas.width, 
    -1 * canvas.height,
    +2 * canvas.width,
    +2 * canvas.height
  )
);

export const choice = _ => iterable => (
  iterable[
    random()(0, iterable.length - 1)
  ]
);

export const randColor = _ => _ => (
  '#' + (
    (1<<24) * Math.random() | 0
  ).toString(16)
);

export const duplicateLine = (
  context, canvas, lines, updateLines
) => (
  lineNo, condition = true
) => {
  if (!condition) {
    return;
  }

  updateLines(
    lines.reduce(
      (prev, line, index) => {
        if (lines.length - index === lineNo) {
          return prev.concat(line, line);
        } else {
          return prev.concat(line);
        }
      },
      []
    )
  );
}

export const insertLine = (
  context, canvas, lines, updateLines
) => (
  lineNo, newLine, condition = true
) => {
  if (!condition) {
    return;
  }

  updateLines(
    lines.reduce(
      (prev, line, index) => {
        if (lines.length - index === lineNo) {
          return prev.concat(newLine, line);
        } else {
          return prev.concat(line);
        }
      },
      []
    )
  );
}

export const removeLine = (
  context, canvas, lines, updateLines
) => (
  lineNo, condition = true
) => {
  if (!condition) {
    return;
  }

  updateLines(
    lines.filter(
      (line, index) => lines.length - index !== lineNo
    )
  );
}

export const changeLine = (
  context, canvas, lines, updateLines
) => (
  lineNo, newLine, condition = true
) => {
  if (!condition) {
    return;
  }

  updateLines(
    lines.map(
      (line, index) => (
        lines.length - index === lineNo
      ) ? newLine
        : line
    )
  );
}

export const toggleComment = (
  context, canvas, lines, updateLines
) => (
  lineNo, condition = true
) => {
  if (!condition) {
    return;
  }

  updateLines(
    lines.map(
      (line, index) => {
        if (index === lineNo) {
          return (
            line.slice(0, 2) === '//'
              ? line.slice(2)
              : '//' + line
          );
        }

        return line;
      }
    )
  );
}

export const getLine = (
  context, canvas, lines, updateLines
) => (
  lineNo
) => {
  return lines[lines.length - lineNo];
}

export const searchAndReplace = (
  context, canvas, lines, updateLines
) => (
  find, replace, condition = true
) => {
  if (!condition) {
    return;
  }

  updateLines(
    lines.map(
      line => (
        line.indexOf('searchAndReplace') === -1
          // do not include itself
          ? line.split(find).join(replace)
          : line
      )
    )
  );
}


const builtins = {
  moveTo,
  lineTo,
  line,
  rect,
  circle,
  clear,
  setup,
  set,
  get,
  fill,
  stroke,
  width,
  height,
  radian,
  translate,
  rotate,
  pushMatrix,
  popMatrix,
  range,
  random,
  rollDice,
  choice,
  randColor,
  duplicateLine,
  removeLine,
  searchAndReplace,
  toggleComment,
  changeLine,
  insertLine,
  getLine,

  // aliases
  dice: rollDice,
  coin: flipCoin,
  duplicate: duplicateLine,
  remove: removeLine,
  change: changeLine,
  insert: insertLine,
  replace: searchAndReplace,
  toggle: toggleComment,
};

const injectArgs = (func, ...args) => (
  (...inner) => 
    func
      .apply(undefined, args)
      .apply(undefined, inner)
); 

export function getBuiltins(...args) {
  return (
    Object
      .keys(builtins)
      .reduce(
        (prev, current) => (
          prev[current] = (
            injectArgs(builtins[current], ...args)
          ),
          prev
        ),
        {}
      )
  );
};
