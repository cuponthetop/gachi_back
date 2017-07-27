import express from 'express';

/**
 * @apiDefine 5xx Error 5xx
 */

export function routingFunc(args) {
  let leadroom = express();

  let leadroomCtrl = args.leadroomCtrl;

  leadroom.get('s/',
     leadroomCtrl.getLeaderList.bind(leadroomCtrl)
   );

  leadroom.get('/:lid',
     leadroomCtrl.loadRequestedLeader.bind(leadroomCtrl),
     leadroomCtrl.getLeader.bind(leadroomCtrl)
   );

  leadroom.post('/',
     leadroomCtrl.createLeader.bind(leadroomCtrl)
   );

  leadroom.delete('/',
     leadroomCtrl.loadRequestedLeader.bind(leadroomCtrl),
     leadroomCtrl.removeLeader.bind(leadroomCtrl)
   );

	leadroom.patch('/',
     leadroomCtrl.loadRequestedLeader.bind(leadroomCtrl),
     leadroomCtrl.updateLeader.bind(leadroomCtrl)
   );


  return leadroom;
}