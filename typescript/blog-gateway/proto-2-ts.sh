#!/bin/bash

# Define the directory where you want to start searching for .proto files
start_dir="./proto"

# Define the command to execute
command="yarn protoc \
  --plugin=./node_modules/.bin/protoc-gen-ts_proto \
  --proto_path=./proto
  --ts_proto_opt=lowerCaseServiceMethods=true \
  --ts_proto_opt=outputClientImpl=false \
  --ts_proto_opt=outputEncodeMethods=false \
  --ts_proto_opt=outputJsonMethods=false \
  --ts_proto_opt=outputPartialMethods=false \
  --ts_proto_opt=stringEnums=true \
  --ts_proto_opt=returnObservable=true \
  --ts_proto_opt=exportCommonSymbols=false \
  --ts_proto_out=./src/micros"

# Function to process files in a directory
process_files() {
  for file in "$1"/*; do
    if [[ -d "$file" ]]; then
      # If it's a directory, recurse into it
      process_files "$file"
    elif [[ "${file##*.}" == "proto" ]]; then
      # If it's a .proto file, execute the command
      echo "Processing: $file"
      $command "$file"
    fi
  done
}

if [ "$#" -eq 1 ]; then
  # Check if a file location argument is provided
  $command "$1"
else
  # Start processing files from the specified directory
  process_files "$start_dir"
fi