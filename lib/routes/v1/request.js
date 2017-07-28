import express from 'express';

/**
 * @apiDefine 5xx Error 5xx
 */

export function routingFunc(args) {
  let request = express();

  let requestCtrl = args.requestCtrl;
  let authCtrl = args.authCtrl;


  request.get('s/',
    authCtrl.authenticate.bind(authCtrl),
    requestCtrl.getRequestList.bind(requestCtrl)
  );

  request.post('/',
    authCtrl.authenticate.bind(authCtrl),
    requestCtrl.createRequest.bind(requestCtrl)
  );

  request.delete('/',
    authCtrl.authenticate.bind(authCtrl),
    requestCtrl.cancelRequest.bind(requestCtrl)
  );

  request.patch('/refuse',
    authCtrl.authenticate.bind(authCtrl),
    requestCtrl.loadTargetRequestInfo.bind(requestCtrl),
    requestCtrl.refuseRequest.bind(requestCtrl)
  );

  request.patch('/accept',
    authCtrl.authenticate.bind(authCtrl),
    requestCtrl.loadTargetRequestInfo.bind(requestCtrl),
    requestCtrl.acceptRequest.bind(requestCtrl)
  );

  return request;
}
