#!/usr/bin/env bash
# Runs every time the Codespace starts. Launches both servers in the background
# with logs written to /tmp so they don't block the terminal.

cd "$(dirname "$0")/.."

echo ">> Starting TraceHub Inventory API (port 5000)..."
(cd backend && nohup npm run dev > /tmp/tracehub-backend.log 2>&1 &) 

echo ">> Starting TraceHub Inventory web app (port 5173)..."
(cd frontend && nohup npm run dev -- --host 0.0.0.0 > /tmp/tracehub-frontend.log 2>&1 &)

sleep 2
echo ">> Both servers launching. Logs: /tmp/tracehub-backend.log and /tmp/tracehub-frontend.log"
echo ">> Open the 'Ports' tab in VS Code and click the forwarded 5173 URL to view the app."
