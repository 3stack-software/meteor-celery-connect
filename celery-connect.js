var queueNames = ["celery"];
if (process.env.CELERY_QUEUES != null){
  queueNames = process.env.CELERY_QUEUES.split(",")
}

var routes = {};
if (process.env.CELERY_ROUTES != null){
  process.env.CELERY_ROUTES.trim(";").split(';').forEach(function(route){
    if (route == '') return;
    var parts = route.split('='),
      queueName = parts[0],
      methodNames = parts[1].split(',');
    methodNames.forEach(function(methodName){
      routes[methodName] = {
        queue: queueName
      };
    });
  });
}

if (process.env.CELERY_BROKER_URL != null) {
  Celery = new CeleryClient("celery-connect");

  Celery.connect({
    "BROKER_URL": process.env.CELERY_BROKER_URL,
    "RESULT_BACKEND": "amqp",
    "SEND_TASK_SENT_EVENT": true,
    "QUEUES": queueNames,
    "DEFAULT_QUEUE": queueNames[0],
    "ROUTES": routes
  });

} else {
  Log.warn("Could not start celery- CELERY_BROKER_URL was not provided.");
}
