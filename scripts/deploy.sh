#!/bin/bash

output=$(cd ./packages/sui/suipin && sui client publish --silence-warnings)

extract_package_id() {
    echo "$output" | grep -A 4 "Published Objects" | grep "PackageID:" | sed 's/.*PackageID: \([0-9a-fA-Fx]*\).*/\1/'
}

extract_object_id() {
    local search_pattern="$1"
    echo "$output" | grep -B 4 "$search_pattern" | grep "ObjectID:" | sed 's/.*ObjectID: \([0-9a-fA-Fx]*\).*/\1/'
}

packageId=$(extract_package_id)

# env_info="VITE_NETWORK=testnet
# VITE_PACKAGE_ID=$packageId"

# echo "$env_info" > "./packages/frontend/.env.local"
# echo "$env_info"

contract_const_info="export const SUIPIN = {
  testnet: {
    packageId: '$packageId',
  },
}"

echo "$contract_const_info" > "./packages/frontend/src/constants/contract.ts"
echo "$contract_const_info"
