/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  serverBuildTarget: 'vercel',
  server: process.env.NODE_ENV === 'development' ? undefined : './server.js',
  appDirectory: 'app',
  assetsBuildDirectory: 'public/build',
  publicPath: '/build/',
  serverBuildDirectory: 'build',
  devServerPort: 8002,
  ignoredRouteFiles: ['.*', '*.res'],
  transpileModules: ['rescript', 'rescript-webapi'],
  future: {
    v2_errorBoundary: false,
  },
  serverDependenciesToBundle: ['@rainbow-me/rainbowkit', /^@?wagmi.*/, /.*/],
  routes(defineRoutes) {
    return defineRoutes(route => {
      route('/Root_FetchGuilds', './res-routes/Root_FetchGuilds.js')
      route(
        '/Root_FetchBrightIDDiscord',
        './res-routes/Root_FetchBrightIDDiscord.js',
      )
      // route(
      //   '/guilds/:guildId/Guilds_FetchGuild',
      //   './res-routes/guilds/Guilds_FetchGuild.js',
      // )
    })
  },
}
