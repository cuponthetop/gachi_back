// @TODO:: CHOOSE A PROPER DB AND IMPLEMENT SERVICE

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

  let db = null;
  if (null !== db)
  {
	  await db.init(args);
	}
  
  return db;
}