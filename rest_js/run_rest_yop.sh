#!/bin/bash
# run_web_ui.sh

cd $(dirname $0)

# start the REST API server in background
echo "Start the micro-service server ..."
## create the key and certificate for ssl
#openssl genrsa -out srv_yop.key 2018
#chmod a-w srv_yop.key
#chmod go-r srv_yop.key
#openssl req -new -x509 -nodes -sha256 -days 365 -key srv_yop.key -out srv_yop.crt
#exit
## launch the https restful micro-service
npm run clean_yop
npm run build_yop
gnome-terminal --working-directory=$(pwd) -- bash -c 'npm run serve_yop'

# give time to the server to start its service
echo "waiting almost 10 seconds ..."
sleep 2

# Testing the restful-API
curl -X GET -k "https://localhost:8443/calc_age?birth_year=1978"
echo -e "\n"
curl -X GET -k "https://localhost:8443/calc_birth_year?age=25"
echo -e "\n"

# To help the user to set this web-site as exception for the browser to allow self-certified micro-service for the cross-origin-request
sensible-browser "https://localhost:8443/calc_age?birth_year=1998"


# stop the micro-service
# Type ctrl-c in the server terminal
#ps aux | grep node
#killall node
#sleep 1
ps aux | grep node



