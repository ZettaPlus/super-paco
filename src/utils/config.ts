// utils/config.ts
export function saveConfig<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data))
}

export function loadConfig<T>(key: string, defaults: T): T {
  const raw = localStorage.getItem(key)
  return raw ? (JSON.parse(raw) as T) : defaults
}
  