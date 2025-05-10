import log4js from 'log4js';

log4js.configure({
  appenders: {
    console: { type: 'console' },
  },
  categories: {
    default: { appenders: ['console'], level: 'debug' },
    domain: { appenders: ['console'], level: 'info' },
    infrastructure: { appenders: ['console'], level: 'info' },
    application: { appenders: ['console'], level: 'info' },
    interface: { appenders: ['console'], level: 'info' },
  },
});
