import * as _ from 'lodash';
import { logger } from '../util/logger';

export async function createEmailUser(fbApp, email, password) {
  try {
    let authApp = fbApp.auth();
    // return await authApp.createUserWithEmailAndPassword(email, password);
    return await authApp.createUser({
      email,
      password,
      emailVerified: true
    });
  } catch (error) {
    if (error.code == 'auth/weak-password') {
      throw Error('The password is too weak.');
    } else {
      throw Error(error.message);
    }
  }
}