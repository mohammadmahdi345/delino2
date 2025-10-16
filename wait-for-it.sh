#!/usr/bin/env bash
# wait-for-it.sh
# Usage: ./wait-for-it.sh host:port -- command args

set -e

HOSTPORT="$1"
shift

HOST=$(echo $HOSTPORT | cut -d: -f1)
PORT=$(echo $HOSTPORT | cut -d: -f2)

echo "Waiting for $HOST:$PORT ..."

until nc -z "$HOST" "$PORT"; do
  >&2 echo "MySQL is unavailable - sleeping"
  sleep 2
done

>&2 echo "MySQL is up - executing command"
exec "$@"
