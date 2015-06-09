Package.describe({
  name: '3stack:celery-connect',
  version: '2.0.0',
  summary: 'Simple interface to use 3stack:celery, just set environment variable CELERY_BROKER_URL',
  git: 'https://github.com/3stack-software/meteor-celery-connect',
  documentation: 'README.md'
});

Package.onUse(function(api){
  api.versionsFrom('METEOR@1.1.0.2');

  api.use('logging', 'server');
  api.use('3stack:celery@2.0.0', 'server');

  api.export('Celery', 'server');

  api.addFiles('celery-connect.js', 'server');
});
