#!/usr/bin/env bash
set -e

echo ">> Setting up TraceHub Inventory (backend + frontend)..."

# --- Backend ---
cd backend
if [ ! -f .env ]; then
  cp .env.example .env
  # Generate real random JWT secrets for this Codespace instead of the placeholder text
  JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
  JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
  # Point CLIENT_URL at the forwarded Codespaces URL for the frontend, if available
  if [ -n "$CODESPACE_NAME" ]; then
    CLIENT_URL="https://${CODESPACE_NAME}-5173.app.github.dev"
    sed -i "s|^CLIENT_URL=.*|CLIENT_URL=${CLIENT_URL}|" .env
  fi
  sed -i "s|^JWT_SECRET=.*|JWT_SECRET=${JWT_SECRET}|" .env
  sed -i "s|^JWT_REFRESH_SECRET=.*|JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}|" .env
  echo "   Created backend/.env with generated JWT secrets (SQLite, stub email transport)."
fi
npm install
npm run seed
cd ..

# --- Frontend ---
cd frontend
if [ ! -f .env ]; then
  cp .env.example .env
  if [ -n "$CODESPACE_NAME" ]; then
    API_URL="https://${CODESPACE_NAME}-5000.app.github.dev/api"
    sed -i "s|^VITE_API_URL=.*|VITE_API_URL=${API_URL}|" .env
  fi
  echo "   Created frontend/.env pointing at the forwarded API URL."
fi
npm install
cd ..

echo ">> Setup complete. Backend and frontend will start automatically."
echo ">> Super Admin login: check backend/.env for SUPER_ADMIN_EMAIL / SUPER_ADMIN_PASSWORD"
