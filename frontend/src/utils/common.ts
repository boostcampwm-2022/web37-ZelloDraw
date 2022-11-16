export function getParam(key: string): string {
    const params = new URLSearchParams(location.search);
    return params.get(key) ?? '';
}
