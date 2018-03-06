#!/usr/bin/env bash

rm -fr demo/.git

echo "did you run webpack?"

cd demo



git init
git add .
git commit . -m "commit" 
git remote add heroku git@heroku.com:editable-html-demo.git
git push --force heroku master

