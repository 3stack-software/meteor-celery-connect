Celery = new CeleryClient('celery-connect');

if ("CELERY_BROKER_URL" in process.env) {
  try {
    Celery.connect({
      "CELERY_BROKER_URL": process.env.CELERY_BROKER_URL,
      "CELERY_RESULT_BACKEND": "amqp",
      "CELERY_SEND_TASK_SENT_EVENT": true
    });
  } catch (err) {
    Log.error(err, err.stack);
  }
} else {
  Log.warn("Could not start celery- CELERY_BROKER_URL was not provided.");
}
