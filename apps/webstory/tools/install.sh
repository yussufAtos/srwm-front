#!/bin/sh

help() {
  echo "Usage: $0"
}

DEPLOY_DIR="webstory"
DEPLOY_DIR2="\/home\/iris-sr-wm\/java\/tomcat\/webapps\/webstory"
DEV="vspar-iris-d-wsback-31.afp.com"

ZIP_FILE=$WORKSPACE/dist/webstory-frontend.zip
ZIP_FILE_BASENAME=$(basename $ZIP_FILE)

BASE_DIR="/home/"
TMP_DIR="tmp"

echo "Deploying $ZIP_FILE to machine $DEV"
scp $ZIP_FILE root@$DEV:~/
#ssh root@$DEV "cd $BASE_DIR && rm -fr $TMP_DIR && mkdir $TMP_DIR && cd $TMP_DIR && unzip ~/$ZIP_FILE_BASENAME && cd .. && rm -fr $DEPLOY_DIR && mv $TMP_DIR/$DEPLOY_DIR ."
ssh root@$DEV "cd $BASE_DIR && rm -fr $TMP_DIR && mkdir $TMP_DIR && cd $TMP_DIR && unzip ~/$ZIP_FILE_BASENAME && cd .. && rm -fr $DEPLOY_DIR2 && mkdir $DEPLOY_DIR2 && mv $TMP_DIR/* $DEPLOY_DIR2 && rm -f ~/$ZIP_FILE_BASENAME"
