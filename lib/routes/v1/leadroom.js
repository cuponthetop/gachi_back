import express from 'express';

/**
 * @apiDefine 5xx Error 5xx
 */

export function routingFunc(args) {
  let leadroom = express();

  let leadroomCtrl = args.leadroomCtrl;
  let authCtrl = args.authCtrl;

  leadroom.get('/list',
    leadroomCtrl.getLeadroomList.bind(leadroomCtrl)
  );

  leadroom.get('/:lid',
    leadroomCtrl.loadTargetLeadroomInfo.bind(leadroomCtrl),
    leadroomCtrl.getLeadroom.bind(leadroomCtrl)
  );

  leadroom.post('/',
    authCtrl.authenticate.bind(authCtrl),
    leadroomCtrl.validateLeadroomFields.bind(leadroomCtrl),
    leadroomCtrl.validateCreate.bind(leadroomCtrl),
    leadroomCtrl.createLeadroom.bind(leadroomCtrl)
  );

  leadroom.delete('/:lid/remove',
    authCtrl.authenticate.bind(authCtrl),
    leadroomCtrl.loadTargetLeadroomInfo.bind(leadroomCtrl),
    leadroomCtrl.allowLeader.bind(leadroomCtrl),
    leadroomCtrl.removeLeadroom.bind(leadroomCtrl)
  );

  leadroom.patch('/:lid',
    authCtrl.authenticate.bind(authCtrl),
    leadroomCtrl.validateLeadroomFields.bind(leadroomCtrl),
    leadroomCtrl.loadTargetLeadroomInfo.bind(leadroomCtrl),
    leadroomCtrl.allowLeader.bind(leadroomCtrl),
    leadroomCtrl.updateLeadroom.bind(leadroomCtrl)
  );

  leadroom.delete('/:lid/exit',
    authCtrl.authenticate.bind(authCtrl),
    leadroomCtrl.loadTargetLeadroomInfo.bind(leadroomCtrl),
    leadroomCtrl.exitLeadroom.bind(leadroomCtrl)
  );

  return leadroom;
}