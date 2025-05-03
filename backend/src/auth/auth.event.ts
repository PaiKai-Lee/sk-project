import { AppClsStore } from 'src/common';

export class AuthEvent {
  context: AppClsStore;
  constructor(context: AppClsStore) {
    this.context = context;
  }
}

export class UserLogoutEvent {
  context: AppClsStore;
  constructor(context: AppClsStore) {
    this.context = context;
  }
}
