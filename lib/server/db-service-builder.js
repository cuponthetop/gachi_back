import { promisify, promisifyAll } from 'bluebird';
import { createConnection } from 'mysql';

/**
 * <p>DBService를 생성해 이 instance를 리턴한다.<br/>
 * args 객체에 isLocal property 값이 true이면 LocalStorage를 이용한 서비스가 생성되며<br/>
 * 그렇지 않으면 Couchbase를 이용한 서비스가 생성된다.</p>
 *
 * @param  {any} args DB Service 타입을 결정하기 위한 argument(LocalStorage/Couchbase)<br/>isLocal property 필요
 * @returns {Promise<DBService>} 생성된 DBService instance
 *
 */
export async function DBServiceBuilder(args) {
  let prms = promisify(createConnection);
  try {
    let dbConfig = {
      host: args.dbhost,
      user: args.dbuser,
      password: args.dbpassword,
      database: args.dbname,
      charset: 'UTF8_GENERAL_CI',
      timezone: '+09:00'
    };

    let connection = await prms(dbConfig);

    // functionAsync == promisified function
    let asyncConnection = promisifyAll(connection);
    await asyncConnection.connectAsync();

    return asyncConnection;

  } catch (e) {
    throw e;
  }
}