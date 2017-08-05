import express from 'express';

/**
 * @apiDefine 5xx Error 5xx
 */

export function routingFunc(args) {
  let request = express();

  let requestCtrl = args.requestCtrl;
  let authCtrl = args.authCtrl;


  request.get('/list/sent',
    authCtrl.authenticate.bind(authCtrl),
    requestCtrl.getSentRequestList.bind(requestCtrl)
  );

  request.get('/list/received',
    authCtrl.authenticate.bind(authCtrl),
    requestCtrl.getReceivedRequestList.bind(requestCtrl)
  );

  request.post('/',
    authCtrl.authenticate.bind(authCtrl),
    requestCtrl.validateExistingLeadroom.bind(requestCtrl),
    requestCtrl.validateCreate.bind(requestCtrl),
    requestCtrl.createRequest.bind(requestCtrl)
  );

  request.delete('/:rid/cancel',
    authCtrl.authenticate.bind(authCtrl),
    requestCtrl.validateExistingPendingRequest.bind(requestCtrl),
    requestCtrl.loadTargetRequestInfo.bind(requestCtrl),
    requestCtrl.cancelRequest.bind(requestCtrl)
  );

  request.patch('/:rid/refuse',
    authCtrl.authenticate.bind(authCtrl),
    requestCtrl.validateExistingPendingRequest.bind(requestCtrl),
    requestCtrl.loadTargetRequestInfo.bind(requestCtrl),
    requestCtrl.refuseRequest.bind(requestCtrl)
  );

  request.patch('/:rid/accept',
    authCtrl.authenticate.bind(authCtrl),
    requestCtrl.validateExistingPendingRequest.bind(requestCtrl),
    requestCtrl.loadTargetRequestInfo.bind(requestCtrl),
    requestCtrl.acceptRequest.bind(requestCtrl)
  );

  return request;
}
