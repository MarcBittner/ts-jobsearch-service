#!/usr/bin/env bash

unset me executionDirectory sourceDirectory runtime importFiles binaryRequirements tapRequirements
set -a
runtime="$(date +%y%m%d_%H%M%S)"
me="$(basename "$(test -L "$0" && readlink "$0" || echo "$0")")"
executionDirectory="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
sourceDirectory="$( cd -- "$(dirname -- "$(readlink -- "${BASH_SOURCE[0]}")")" >/dev/null 2>&1 && pwd )"


#SYSLOG_FACILITY='local7'
LOG_TAG='ts-jobsearch-service-build' # Optional syslog app name
LOG_LEVEL='DEBUG'
DATETIME_FORMAT="+%Y-%m-%dT%H:%M:%S%z" # "+%FT%T%Z"
#LOG_FILE="${logFileName-"${me}.$(date +%FT%T%Z).log"}"
LOG_FILE="${logFileName-"${me}.log"}"

  # Define imports

importFiles=(
            "${variablesFile-"build.variables"}"
            "${functionsFile-"build.functions"}"
            "${bashlogFile-"build.bashlog"}"
            )

  # Define nonce import function

# importOrAbort() {
#   local importFile debug
#
#   while [[ ${1} ]]; do
#       case "${1}" in
#         --file)
#           importFile=${2}
#           shift
#           ;;
#         --debug)
#           debugOutput=1
#           ;;
#         *)
#           echo "Unknown parameter: ${1}" >&2
#           return 1
#           ;;
#       esac
#
#       if ! shift; then
#         echo 'Missing parameter argument.' >&2
#         return 1
#       fi
#     done
#
#   if [ -r ${importFile} ]; then
#       . ${importFile}
#       [[ debugOutput -gt 0 ]] &&
#       echo "Successfully sourced ${importFile}"
#   else
#       [[ debugOutput -gt 0 ]] &&
#       echo "failed to import ${importFile}: aborting"
#       exit 1
#   fi
# }

# Loop through files to source

# for import in "${importFiles[@]}"
#   do
#     [[ debugOutput -gt 0 ]] && echo "Sourcing ${sourceDirectory}/${import}"
#     importOrAbort --file ${sourceDirectory}/${import}
#   done
# set +a

[ -r ${importFile} ] && . ./lib/build.variables
[ -r ${importFile} ] && . ./lib/build.functions
[ -r ${importFile} ] && . ./lib/build.bashlog


  importModules=(
              "dotenv"
              "node-schedule"
              "axios"
              "csv-writer"
              "ffs"
              "linkedin-api-client"
              )

# Optionally set -x with a friendly variable

[[ bash_debug -gt 0 ]] && set -x

_bashlog info  "$(rm -f ./src/*.js 2>&1 | tee /dev/tty)"
_bashlog info  "$(rm -f ./dist/*.js 2>&1 | tee /dev/tty)"
_bashlog info  "$(npm install ${importModules[@]}  2>&1 | tee /dev/tty)"
_bashlog info  "$(npx tsc --build --listEmittedFiles 2>&1 | tee /dev/tty)"
