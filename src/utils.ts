export function prettifyName(name: string) {
  const parts = name.split(',');
  if (parts.length === 1) {
    return parts[0];
  }
  if (parts.length === 2) {
    return parts[0] + ', ' + parts[1];
  }

  let prettifiedName = parts[0] + ',';
  for (let i = 1; i < parts.length; i++) {
    prettifiedName += ' ' + parts[i];
  }
  return prettifiedName;
}
