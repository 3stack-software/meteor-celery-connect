#Celery Connect

Just set environment `CELERY_BROKER_URL` when starting Meteor, and then start calling the CeleryClient `Celery`

See 3stack:celery-shoot @ https://github.com/3stack-software/celery-shoot

#Changes

## 3.0.0

 * Switched from `3stack:celery` to `3stack:celery-shoot` as core library. `celery-shoot` now has built-in support
   for Meteor & `Fibers`, and uses the latest [node `amqp` library](https://github.com/dropbox/amqp-coffee)

 * API has changed dramatically. Please see examples at [`celery-shoot`](https://github.com/3stack-software/celery-shoot)

 * You no longer need to provide all queues to `CELERY_QUEUES` - however the first QUEUE will be used as default.

 * `CELERY_BROKER_URL` must include every field (user/pass, host, port & vhost) `amqp://guest:guest@localhost:5672//`

 * Due to internal library change - Disconnects/Reconnects are now handled much better!

## 2.0.0

 * Updated to `3stack:celery` `v2.0` - `QUEUES` now work by sharing a single client/connection.
    Just pass `ROUTES` when creating the client, or call `Celery.createTask('MyTask', {queue: 'queueToUse'})`
    NOTE: Must add all queues you intend to use to `CELERY_QUEUES` (won't automatically connect).

 * Connection on startup is no longer synchronous / blocking. Calling a task before a connection is established will
    throw an error.

 *  Added `CELERY_ROUTES` - provide a mapping ot tasks to queues in the following format:

    ```
    queue_name=task_1,task_2,task_3;another_queue=task_4,task_5;
    ```

## 1.1.0

 * Added `CELERY_QUEUES` environment variable; list of queues you'd like to connect to. Defaults to "celery".
