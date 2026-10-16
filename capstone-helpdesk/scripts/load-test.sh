#!/usr/bin/env bash
set -euo pipefail

# HelpDesk Pro Load Test Script
# Generates continuous traffic to demonstrate HPA auto-scaling

TARGET_URL="${URL:-http://helpdesk.local/api/tickets/stats}"
CONCURRENCY="${CONCURRENCY:-10}"
REQUESTS="${REQUESTS:-1000}"

echo "================================================="
echo "Starting HelpDesk Pro Load Generator"
echo "Target URL:  $TARGET_URL"
echo "Requests:    $REQUESTS"
echo "Concurrency: $CONCURRENCY"
echo "================================================="

for i in $(seq 1 "$REQUESTS"); do
  curl -s -o /dev/null "$TARGET_URL" || true
  if [ $((i % 100)) -eq 0 ]; then
    echo "Sent $i / $REQUESTS requests..."
  fi
done

echo "✅ Load test completed successfully."
echo "Check HPA status with: kubectl get hpa -n helpdesk -w"
