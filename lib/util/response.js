/**
 * Response 성공(200)에 대한 응답 재정의(로그 기록)
 * 
 * @param  {LoggerInstance} logger
 * @param  {Response} res
 * @param  {any} data
 * @param  {number} status
 */
export function succeedWith(logger, res, data, status) {
  status = status || 200;
  logger.info(`Request succeeded ${JSON.stringify(data)}`);
  res.status(status).send(data);
}

/**
 * Bad Response에 대한 응답 재정의(로그 기록)
 * 
 * @param  {LoggerInstance} logger
 * @param  {Response} res
 * @param  {string} message
 * @param  {number} status
 * @returns void
 */
export function failWith(logger, res, message, status) {
  status = status || 500;
  logger.error(`Request failed ${status} - ${message}`);
  res.status(status).send(message);
}

/**
 * Bad Response(Not Implemented)에 대한 응답 재정의(로그 기록)
 * 
 * @param  {LoggerInstance} logger
 * @param  {Response} res
 */
export function notImplemented(logger, res) {
  return failWith(logger, res, 'Not Implemented Yet!', 500);
}