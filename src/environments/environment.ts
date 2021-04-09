// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  domain:'https://farmecart.com',
  //domain:'http://farme.syntrio.in',
  //domain:'http://127.0.0.1:8000',
  //courierApi: 'http://ec2-15-207-223-223.ap-south-1.compute.amazonaws.com:8081/api/v1/order/',
  courierApi: 'http://track.ctracksystems.com/TrackingService.svc/jtsv/TrackDetails/',
  courierApiUrl: 'http://testapi.ctracksystems.com',

  stripe: { 
    my_publishable_key:'pk_test_rOgk1dvcuJesH5DWvZCLhiVj009dNVxoW0',
    secret_key: 'sk_test_zNAuqjOTYWxKFXbQge0b57uY00fxCgPFJH'
  },
  rozar: {
    key_id: 'rzp_live_Hifbv1Gv955EJg',
    key_secret: 'FOIBH7e9eecEC8RC7TiLYLfC'
  }
}; 

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
