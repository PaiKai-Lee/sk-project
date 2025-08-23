import { AppClsStore } from 'src/common';

export class AuthLoginEvent {
  static EVENT_NAME = 'auth.login';
  context: AppClsStore;
  constructor(context: AppClsStore) {
    this.context = context;
  }
}

export class AuthLogoutEvent {
  static EVENT_NAME = 'auth.logout';
  context: AppClsStore;
  constructor(context: AppClsStore) {
    this.context = context;
  }
}
