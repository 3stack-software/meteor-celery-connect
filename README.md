#Celery Connect

Just set environment `CELERY_BROKER_URL` when starting Meteor, and then start calling the CeleryClient `Celery`

See 3stack:celery  @ https://github.com/3stack-software/meteor-celery

#Changes

## 1.1.0

Added `CELERY_QUEUES` environment variable; list of queues you'd like to connect to. Defaults to "celery".
