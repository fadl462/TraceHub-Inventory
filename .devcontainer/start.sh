#!/usr/bin/env bash
# Runs every time the Codespace starts. Launches both servers in the background
# with logs written to /tmp so they don't block the terminal.

cd "$(dirname "$0")/.."

# Belt-and-suspenders: devcontainer.json already declares both ports as
# "visibility": "public", but Codespaces has been observed silently
# reverting a port to Private after a stop/restart in practice. Force it
# again here on every start. Best-effort only - if `gh` isn't authenticated
# yet for some reason, this just prints a warning instead of blocking startup.
if [ -n "$CODESPACE_NAME" ] && command -v gh >/dev/null 2>&1; then
  echo ">> Ensuring ports 5000 and 5173 are Public..."
  gh codespace ports visibility 5000:public -c "$CODESPACE_NAME" 2>&1 || echo "   (couldn't set port 5000 - check it manually in the Ports tab if the app doesn't load)"
  gh codespace ports visibility 5173:public -c "$CODESPACE_NAME" 2>&1 || echo "   (couldn't set port 5173 - check it manually in the Ports tab if the app doesn't load)"
fi

echo ">> Starting TraceHub Inventory API (port 5000)..."
(cd backend && nohup npm run dev > /tmp/tracehub-backend.log 2>&1 &) 

echo ">> Starting TraceHub Inventory web app (port 5173)..."
(cd frontend && nohup npm run dev -- --host 0.0.0.0 > /tmp/tracehub-frontend.log 2>&1 &)

sleep 2
echo ">> Both servers launching. Logs: /tmp/tracehub-backend.log and /tmp/tracehub-frontend.log"
echo ">> Open the 'Ports' tab in VS Code and click the forwarded 5173 URL to view the app."
