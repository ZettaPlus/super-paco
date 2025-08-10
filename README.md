### Instalar como App (no programadores)

macOS:
- Abrir Terminal y pegar:
  ```bash
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" || true
  brew install rustup-init && rustup-init -y && source ~/.cargo/env
  npm i -g @tauri-apps/cli
  ```
- Descargar el instalador (DMG) desde la sección Actions de GitHub cuando se publique, o construir localmente:
  ```bash
  npm i
  npm run desktop:build
  open src-tauri/target/release/bundle/dmg
  ```

Windows:
- Abrir PowerShell como administrador y ejecutar:
  ```powershell
  Set-ExecutionPolicy Bypass -Scope Process -Force
  ./scripts/desktop.ps1 build
  ```
- El instalador MSI queda en `src-tauri\target\release\bundle\msi`.

Linux:
- Requisitos estándar de Tauri. Luego:
  ```bash
  npm i && npm run desktop:build
  ```

### Para desarrolladores
- Web dev: `npm run dev`
- Desktop dev: `npm run desktop:dev`
- CI (GitHub Actions): workflow `build-desktop` genera instaladores para macOS/Windows/Linux.
