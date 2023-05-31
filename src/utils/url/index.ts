export function getSearchParams<T>() {
  const params: Record<string, any> = {};
  location.search
    .substr(1)
    .split("&")
    .forEach((item) => {
      const pair = item.split("=");
      params[pair[0]] = pair[1];
    });
  for (let [k, v] of Object.entries(params)) {
    if (v.toString() !== "NaN") {
      params[k] = Number.parseFloat(v);
    } else if (v === "true") {
      params[k] = true;
    } else if (v === "false") {
      params[k] = false;
    }
  }
  return params as T;
}
