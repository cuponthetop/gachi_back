#/bin/bash

kill $(ps aux | grep <process_name> | grep -v "grep" | cut -d " " -f2)

git pull

gulp babel

node build/index.js > out-gachi.log 2> err-gachi.log &
