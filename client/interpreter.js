import { getBuiltins } from './builtins';
import * as stateManager from './state';

export function reset() {
  stateManager.updateState(stateManager.getInitialState());
}

export function step(canvas, context, lines, updateLines) {
  const source = (
    lines
      .map((e, i, a) => a[(a.length -1) -i])
      .join('\n')
  );

  const scope = {
    canvas,
    context,
    ...getBuiltins(context, canvas, lines, updateLines),
    ...stateManager.getState(),
  };

  const keys = Object.keys(scope);

  new Function(
    ...keys,
    source,
  ).apply(
    this,
    keys.map(key => scope[key])
  );

  stateManager.incr('tick');
}
