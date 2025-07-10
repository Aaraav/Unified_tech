#!/bin/sh

echo "⏳ Waiting for DB on db:5432..."
until nc -z db 5432; do
  echo "🔁 Waiting for database..."
  sleep 2
done

echo "✅ DB is ready!"

echo "🛠 Running Prisma migration..."
npx prisma migrate deploy

echo "🚀 Starting auth service..."
exec node src/server.js
