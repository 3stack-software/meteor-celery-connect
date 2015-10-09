if (process.env.CELERY_QUEUES != null){
  Log.warn('CELERY_QUEUES is no longer supported. Use CELERY_DEFAULT_EXCHANGE & CELERY_DEFAULT_ROUTING_KEY instead.');
}

var defaultExchange = "celery";
if (process.env.CELERY_DEFAULT_EXCHANGE != null){
  defaultExchange = process.env.CELERY_DEFAULT_EXCHANGE;
}

var defaultRoutingKey = "celery";
if (process.env.CELERY_DEFAULT_ROUTING_KEY != null){
  defaultRoutingKey = process.env.CELERY_DEFAULT_ROUTING_KEY;
}

var routes = {};
if (process.env.CELERY_ROUTES != null){
  process.env.CELERY_ROUTES.trim(";").split(';').forEach(function(routeRepr){
    if (routeRepr == '') return;
    var parts = routeRepr.split('='),
      exchangeAndRoutingKey = parts[0],
      methodNames = parts[1].split(','),
      destinationParts, route;

    if (exchangeAndRoutingKey.indexOf('|') === -1){
      route = {
        exchange: exchangeAndRoutingKey
      };
    } else {
      destinationParts = exchangeAndRoutingKey.split('|');
      route = {
        exchange: destinationParts[0],
        routingKey: destinationParts[1]
      }
    }

    methodNames.forEach(function(methodName){
      routes[methodName] = route;
    });
  });
}

if (process.env.CELERY_BROKER_URL != null) {
  Celery = CeleryClient.connectWithUri(process.env.CELERY_BROKER_URL, {
    defaultExchange: defaultExchange,
    defaultRoutingKey: defaultRoutingKey,
    routes: routes
  });

} else {
  Log.warn("Could not start celery- CELERY_BROKER_URL was not provided.");
}
