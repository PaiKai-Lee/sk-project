import { AppClsStore } from 'src/common';
export class UserCreatedEvent {
  static EVENT_NAME = 'user.created';
  uid: string;
  name: string;
  context: AppClsStore;
  constructor({
    uid,
    name,
    context,
  }: {
    uid: string;
    name: string;
    context: AppClsStore;
  }) {
    this.uid = uid;
    this.name = name;
    this.context = context;
  }
}

export class UserDisabledEvent {
  static EVENT_NAME = 'user.disabled';
  uid: string;
  context: AppClsStore;
  constructor({ uid, context }: { uid: string; context: AppClsStore }) {
    this.uid = uid;
    this.context = context;
  }
}

export class UserEnabledEvent {
  static EVENT_NAME = 'user.enabled';
  uid: string;
  context: AppClsStore;
  constructor({ uid, context }: { uid: string; context: AppClsStore }) {
    this.uid = uid;
    this.context = context;
  }
}

export class UserPasswordResetEvent {
  static EVENT_NAME = 'user.passwordReset';
  uid: string;
  context: AppClsStore;
  constructor({ uid, context }: { uid: string; context: AppClsStore }) {
    this.uid = uid;
    this.context = context;
  }
}

export class UserPasswordChangedEvent {
  static EVENT_NAME = 'user.passwordChanged';
  context: AppClsStore;
  constructor({ context }: { context: AppClsStore }) {
    this.context = context;
  }
}

export class UserNameChangedEvent {
  static EVENT_NAME = 'user.nameChanged';
  name: string;
  context: AppClsStore;
  constructor({ name, context }: { name: string; context: AppClsStore }) {
    this.name = name;
    this.context = context;
  }
}

export class UserEditedEvent {
  static EVENT_NAME = 'user.edited';
  uid: string;
  editData: Record<string, any>;
  context: AppClsStore;
  constructor({
    uid,
    editData,
    context,
  }: {
    uid: string;
    editData: Record<string, any>;
    context: AppClsStore;
  }) {
    this.uid = uid;
    this.editData = editData;
    this.context = context;
  }
}
