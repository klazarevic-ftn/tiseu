module.exports = {
    paths: {
      mw: './common/middlewares',
      cf: './config',
    },
    mw: {
      at: './common/middlewares/authentication',
      cr: './common/middlewares/cors',
      lg: './common/middlewares/logger',
    },
    e: {
        lc: './.env.local',
        dk: './env.docker'
    },
    md_us: {
        mo: './modules/user/models',
        sr: './modules/user/services',
    },
  };