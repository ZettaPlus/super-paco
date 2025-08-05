// utils/config.ts
export function saveConfig(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data))
  }
  export function loadConfig<T>(key: string, defaults: T): T {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : defaults
  }
  