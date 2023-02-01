export function applyStyleIf(predicate: boolean, style: string) {
  if (predicate) return style;
  return "";
}

export function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function mockPromise<T>(props: {
  ms: number;
  resolve: boolean;
  response: T;
}) {
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      if (props.resolve) resolve(props.response);
      else reject(props.response);
    }, props.ms);
  });
}
