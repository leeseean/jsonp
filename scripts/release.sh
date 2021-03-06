#!/bin/bash

set -e

echo "Select a option to release (input a serial number)："
echo

select VERSION in patch minor major "Specific Version"
  do
    echo
    if [[ $REPLY =~ ^[1-4]$ ]]; then
      if [[ $REPLY == 4 ]]; then
        read -p "Enter a specific version: " -r VERSION
        echo
        if [[ -z $REPLY ]]; then
          VERSION=$REPLY
        fi
      fi

      read -p "Release $VERSION - are you sure? (y/n) " -n 1 -r
      echo

      if [[ $REPLY =~ ^[Yy]$ ]]; then

        npm version $VERSION
        NEW_VERSION=$(node -p "require('./package.json').version")
        echo Releasing ${NEW_VERSION} ...

        # get new version number
        yarn build

        yarn publish --new-version ${NEW_VERSION}
        echo "✅  Released to npm."

        yarn run changelog
        git add CHANGELOG.md
        git commit -m "chore: changelog"
        git push
        git push origin refs/tags/v${NEW_VERSION}
        echo "✅  Released to Github."
      else
        echo Cancelled
      fi
      break
    else
      echo Invalid \"${REPLY}\"
      echo "To continue, please input a serial number(1-4) of an option."
      echo
    fi
  done