export function appendToSearchParams(
  newParams: Record<string, string>,
  currentParams: URLSearchParams
) {
  return new URLSearchParams({
    ...Object.fromEntries(currentParams.entries()),
    ...newParams,
  }).toString();
}
