export function isNumber(val) {
  return Number(parseFloat(val)) == val;
}

export function prepend(lines, command) {
  return [
    command,
    ...lines
  ];
}

export function update(lines, no, command) {
  return lines.map(
    (line, index) => (
      no !== (lines.length - index)
        ? line
        : command
    )
  );
}

export function remove(lines, no) {
  return lines.filter(
    (_, index) => (
      no !== lines.length - index
    )
  );
}

export function insert(lines, no, command) {
  return lines.reduce(
    (prev, line, index) => (
      no !== (lines.length - index)
        ? prev.concat(line)
        : prev.concat(line, command)
    ),
    []
  );
}

export function parse(lines, command) {
  const modifier = command.slice(0, 1);
  const rest = command.slice(1);
  const commandPosition = command.indexOf(' ');
  const hasNumberModifier = isNumber(rest.slice(0, commandPosition));
  // TODO:
  // Write a proper abstraction for modifiers
  if (modifier === '/') {
    return (
      hasNumberModifier
      ? update(
          lines,
          Number(rest.slice(0, commandPosition)),
          rest.slice(commandPosition)
        )
      : lines
    );
  } else if (modifier === '+') {
    return (
      hasNumberModifier
      ? insert(
          lines,
          Number(rest.slice(0, commandPosition)),
          rest.slice(commandPosition)
        )
      : lines
    );
  } else if (modifier === '-') {
    return (
      hasNumberModifier
      ? remove(
         lines,
         Number(rest.slice(0, commandPosition))
       )
      : lines
    )
  } else {
    return prepend(lines, command)
  }
}
