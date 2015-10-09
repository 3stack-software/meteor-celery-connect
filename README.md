#Celery Connect

Configures a default `Celery` connection, via environment variables.

Just set environment `CELERY_BROKER_URL` when starting Meteor, and then start calling the CeleryClient `Celery`

See 3stack:celery-shoot @ https://github.com/3stack-software/celery-shoot for more details on celery tasks.

## Environment Variables / Options

 * `CELERY_BROKER_URL` - Must use the full amqp address, eg. `amqp://guest:guest@localhost:5672//`.
    It must include username, password, host, and vhost.
 * `CELERY_DEFAULT_EXCHANGE` - Set's the default exchange for new tasks, defaults to `celery`.
 * `CELERY_DEFAULT_ROUTING_KEY` - Set's the default routing key for new tasks, defaults to `celery`.
 * `CELERY_ROUTES` - Automatically send certain tasks to a different exchanges & routes.
    Formatted `exchange_1|routing_key_1=task_1,task_2;exchange_1|routing_key_2=task_3,task_4;exchange_2|routing_keyX=task_5`.
    Or, You can manually override routes on `createTask`, like so:
    `var task = Celery.createTask('task_1',{},{exchangeName:'exchange_x', routingKey: 'abc1234'})`

## Usage

Call your celery tasks from meteor (including meteor methods):

```js
var Future = Npm.require('fibers/future');

var heavyTask = Celery.createTask('heavyTask');

Meteor.methods({
  "performSomeHeavyTask": function(someArg){
    check(someArg, String);
    this.unblock(); // if called with Meteor.apply('performSomeHeavyTask',[someArg],{wait:false}) this will prevent blocking of other method calls
    // `invokeSync` returns a Future- call `.wait()` to obtain the result
    return heavyTask.invokeSync([1,2,3, someArg]).wait().result;
  },
  "performLotsOfTasks": function(someArgs){
    check(someArg, [String]);
    var futures = _.map(someArgs, function(someArg){
      // call the methods simultaneously
      return heavyTask.invokeSync([1, 2, 3, someArg]);
    });

    // wait for them as a group
    Future.wait(futures);

    // return the results as an array
    return _.map(futures, function(f) { return f.get().result; });
  }
});
```

You can also track long-running tasks - using [Task.track_started](http://docs.celeryproject.org/en/latest/userguide/tasks.html#Task.track_started)

```js

var heavyTask = Celery.createTask('heavyTask')

Meteor.methods({
  "performLongRunningTask": function(){
    // CeleryClient#call returns a Future - call `.wait()` to obtain the result
    Meteor.defer(function(){
      var futures = heavyTask.invokeSyncTrackStarted([1, 2, 3, someArg]),
        started = futures[0],
        completed = futures[1],
        result;

      console.log('Waiting for task to be started by a worker');
      started.wait();
      console.log('Task Started, waiting for completion');
      result = completed.wait().result;
      console.log('Task completed', result);
    });
    console.log('Queued task, returning method');
    return true;
  }
});
```


## Setting up Celery

You'll  want to set a few extra options in your Celery configuration,

```python
# Sent backend to 'amqp'
CELERY_RESULT_BACKEND = 'amqp'
# Expect all tasks to be communicated in `json`
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TASK_SERIALIZER = 'json'
CELERY_ACCEPT_CONTENT = ['json']
```

#Changes

## 3.1.0

 * Fixed nomenclature - Messages are sent to `exchanges`, addressed with a `routing-key`; RabbitMQ will
   then direct them to `queues` based on bindings. Celery will consume tasks from the `queue`.
   As such `CELERY_QUEUES` is no longer available. Use `CELERY_DEFAULT_EXCHANGE` and
   `CELERY_DEFAULT_ROUTING_KEY` instead.

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
