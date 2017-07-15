import express from 'express';

/**
 * @apiDefine 5xx Error 5xx
 */

export function routingFunc(args) {
  let leader = express();

  let leaderCtrl = args.leaderCtrl;
  
  leader.get('s/',
     leaderCtrl.getLeaderList.bind(leaderCtrl)
   );

  leader.get('/:lid',
     leaderCtrl.loadRequestedLeader.bind(leaderCtrl),
     leaderCtrl.getLeader.bind(leaderCtrl)
   );
  
  leader.post('/',
     leaderCtrl.createLeader.bind(leaderCtrl)
   );

  leader.delete('/',
     leaderCtrl.loadRequestedLeader.bind(leaderCtrl),
     leaderCtrl.removeLeader.bind(leaderCtrl)
   );

	leader.patch('/',
     leaderCtrl.loadRequestedLeader.bind(leaderCtrl),
     leaderCtrl.updateLeader.bind(leaderCtrl)
   );


  return leader;
}