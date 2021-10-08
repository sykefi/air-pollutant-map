[![Tests & deploy dev status](https://github.com/sykefi/air-pollutant-map/workflows/Tests%20%26%20deploy%20dev/badge.svg)](https://github.com/sykefi/air-pollutant-map/actions)

# air-pollutant-map

Also known as _Päästöt kartalla_

Online preview: [paastokartta-demo.web.app](https://paastokartta-demo.web.app/)

### Project setup

```
npm install
```

To use dev GeoServer, add file `.env.local` with the following environment variable: 
`VUE_APP_GEOSERVER_URI=http://your-dev-geoserver-address:port/geoserver/paastotkartalla/`


### Compiles and hot-reloads for development

`npm run serve-dev`

### Compiles and minifies for production

`npm run build-prod`

### Tests

Open & run Cypress E2E tests with
`npm run cypress`

### Built with

Vue.js & OpenLayers

See [Configuration Reference](https://cli.vuejs.org/config/).
