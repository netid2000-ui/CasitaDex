#!/bin/sh
set -eu
base=/Volumes/FA-Development/Designs-by-FA
export OLLAMA_HOST=127.0.0.1:11434
export OLLAMA_MODELS="$base/Tools/Ollama/models"
export OLLAMA_NO_CLOUD=1 OLLAMA_NUM_PARALLEL=1 OLLAMA_MAX_LOADED_MODELS=1 OLLAMA_KEEP_ALIVE=0 OLLAMA_CONTEXT_LENGTH=8192 OLLAMA_FLASH_ATTENTION=1
if curl -fsS --max-time 2 http://127.0.0.1:11434/api/version >/dev/null; then
  printf '%s\n' 'Existing loopback Ollama server is running; verify configuration before review.'
  exit 0
fi
exec /opt/homebrew/bin/ollama serve
