Package.describe({
  name: '3stack:celery-connect',
  version: '3.0.1',
  summary: 'Simple interface to use 3stack:celery-shoot, just set environment variable CELERY_BROKER_URL',
  git: 'https://github.com/3stack-software/meteor-celery-connect',
  documentation: 'README.md'
});

Package.onUse(function(api){
  api.versionsFrom('METEOR@1.1.0.2');

  api.use('logging', 'server');
  api.use('3stack:celery-shoot@4.0.3', 'server');

  api.export('Celery', 'server');

  api.addFiles('celery-connect.js', 'server');
});
