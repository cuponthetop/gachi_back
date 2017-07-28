import express from 'express';

/**
 * @apiDefine 5xx Error 5xx
 */

export function routingFunc(args) {
  let leadroom = express();

  let leadroomCtrl = args.leadroomCtrl;
  let authCtrl = args.authCtrl;

  leadroom.get('s/',
    leadroomCtrl.getLeadroomList.bind(leadroomCtrl)
  );

  leadroom.get('/:lid',
    leadroomCtrl.loadRequestedLeadroomInfo.bind(leadroomCtrl),
    leadroomCtrl.getLeadroom.bind(leadroomCtrl)
  );

  leadroom.post('/',
    authCtrl.authenticate.bind(authCtrl),
    leadroomCtrl.createLeadroom.bind(leadroomCtrl)
  );

  leadroom.delete('/',
    authCtrl.authenticate.bind(authCtrl),
    leadroomCtrl.loadRequestedLeadroomInfo.bind(leadroomCtrl),
    leadroomCtrl.removeLeadroom.bind(leadroomCtrl)
  );

  leadroom.patch('/',
    authCtrl.authenticate.bind(authCtrl),
    leadroomCtrl.loadRequestedLeadroomInfo.bind(leadroomCtrl),
    leadroomCtrl.updateLeadroom.bind(leadroomCtrl)
  );

  leadroom.delete('/:lid',
    authCtrl.authenticate.bind(authCtrl),
    leadroomCtrl.loadRequestedLeadroomInfo.bind(leadroomCtrl),
    leadroomCtrl.exitLeadroom.bind(leadroomCtrl)
  );

  return leadroom;
}