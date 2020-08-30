

# Split "db:port" from arguments
ARGS=(${1//:/ })

DB=${ARGS[0]}
PORT=${ARGS[1]}

if [[ $DB == "pg" ]]; then

  psql \
    --host localhost \
    --port $PORT \
    --username admin --no-password \
    --dbname async_experiment

fi