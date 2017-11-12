#!/bin/sh

APP_NAME="service-cache"


################################
#      STOP PM2 INSTANCE	   #
################################
pm2 stop "$APP_NAME"
