var queueNames = ["celery"];
if (process.env.CELERY_QUEUES != null){
  queueNames = process.env.CELERY_QUEUES.split(",")
}

if (process.env.CELERY_BROKER_URL != null) {
  queueNames.forEach(function(queueName){
    var Celery = new CeleryClient(queueName);
    try {
      Celery.connect({
        "CELERY_BROKER_URL": process.env.CELERY_BROKER_URL,
        "CELERY_RESULT_BACKEND": "amqp",
        "CELERY_SEND_TASK_SENT_EVENT": true,
        "DEFAULT_QUEUE": queueName,
        "DEFAULT_EXCHANGE": queueName,
        "DEFAULT_ROUTING_KEY": queueName
      });
    } catch (err) {
      Log.error(err, err.stack);
    }
  });
} else {
  Log.warn("Could not start celery- CELERY_BROKER_URL was not provided.");
}

Celery = CeleryClients[queueNames[0]];
