#!/bin/sh
set -e

host="$1"
shift

until PGPASSWORD=postgres psql -h "$host" -U "postgres" -c '\q' > /dev/null 2>&1; do
  echo "⏳ Waiting for DB on $host..."
  sleep 1
done

echo "✅ DB is up - running command"
exec "$@"
