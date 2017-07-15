import express from 'express';

/**
 * @apiDefine 5xx Error 5xx
 */

export function routingFunc(args) {
  let request = express();

  let requestCtrl = args.requestCtrl;

  
  request.get('s/',
     requestCtrl.getLeaderList.bind(requestCtrl)
  );

  request.post('/',
     requestCtrl.createRequest.bind(requestCtrl)
  );

  request.delete('/',
     requestCtrl.cancelRequest.bind(requestCtrl)
  );

	request.patch('/refuse',
    requestCtrl.loadRequestedRequest.bind(requestCtrl),
		requestCtrl.refuseRequest.bind(requestCtrl)
  );
  
	request.patch('/accept',
    requestCtrl.loadRequestedRequest.bind(requestCtrl),
     requestCtrl.acceptRequest.bind(requestCtrl)
   );
  
  return request;
}
