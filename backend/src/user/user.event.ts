import { AppClsStore } from 'src/common';
export class UserCreatedEvent {
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
  uid: string;
  context: AppClsStore;
  constructor({ uid, context }: { uid: string; context: AppClsStore }) {
    this.uid = uid;
    this.context = context;
  }
}

export class UserEnabledEvent {
  uid: string;
  context: AppClsStore;
  constructor({ uid, context }: { uid: string; context: AppClsStore }) {
    this.uid = uid;
    this.context = context;
  }
}

export class UserPasswordResetEvent {
  uid: string;
  context: AppClsStore;
  constructor({ uid, context }: { uid: string; context: AppClsStore }) {
    this.uid = uid;
    this.context = context;
  }
}

export class UserPasswordChangedEvent {
  context: AppClsStore;
  constructor({ context }: { context: AppClsStore }) {
    this.context = context;
  }
}

export class UserNameChangedEvent {
  name: string;
  context: AppClsStore;
  constructor({ name, context }: { name: string; context: AppClsStore }) {
    this.name = name;
    this.context = context;
  }
}

export class UserEditedEvent {
  uid: string;
  editData: Record<string, any>;
  context: AppClsStore;
  constructor({ uid, editData, context }: { uid: string; editData: Record<string, any>; context: AppClsStore }) {
    this.uid = uid;
    this.editData = editData;
    this.context = context;
  }
}
