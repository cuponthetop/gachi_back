import * as _ from 'lodash';
import { logger } from '../util/logger';

async function createEmailUser(fbApp, email, password) {
  try {
    return fbApp.auth().createUserWithEmailAndPassword(email, password);
  } catch (error) {
    if (error.code == 'auth/weak-password') {
      throw Error('The password is too weak.');
    } else {
      throw Error(error.message);
    }
  }
}