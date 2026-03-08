const fs = require("node:fs/promises")
const path = require("node:path")

const appRunContent = (executableName) => `#!/bin/bash
set -e

THIS="$0"
args=("$@")
NUMBER_OF_ARGS="$#"

if [ -z "$APPDIR" ] ; then
  path="$(dirname "$(readlink -f "\${THIS}")")"
  while [[ "$path" != "" && ! -e "$path/AppRun" ]]; do
    path=\${path%/*}
  done
  APPDIR="$path"
fi

export PATH="\${APPDIR}:\${APPDIR}/usr/sbin:\${PATH}"
export XDG_DATA_DIRS="./share/:/usr/share/gnome:/usr/local/share/:/usr/share/:\${XDG_DATA_DIRS}"
export LD_LIBRARY_PATH="\${APPDIR}/usr/lib:\${LD_LIBRARY_PATH}"
export XDG_DATA_DIRS="\${APPDIR}"/usr/share/:"\${XDG_DATA_DIRS}":/usr/share/gnome/:/usr/local/share/:/usr/share/
export GSETTINGS_SCHEMA_DIR="\${APPDIR}/usr/share/glib-2.0/schemas:\${GSETTINGS_SCHEMA_DIR}"

BIN="\${APPDIR}/${executableName}"
DEFAULT_ARGS=(--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage)

if [ "$NUMBER_OF_ARGS" -eq 0 ] ; then
  exec "$BIN" "\${DEFAULT_ARGS[@]}"
else
  exec "$BIN" "\${DEFAULT_ARGS[@]}" "\${args[@]}"
fi
`

exports.default = async function afterPack(context) {
  if (context.electronPlatformName !== "linux") return

  const appRunPath = path.join(context.appOutDir, "AppRun")
  const executableName = context.packager.executableName

  await fs.writeFile(appRunPath, appRunContent(executableName), {mode: 0o755})
  await fs.chmod(appRunPath, 0o755)
}