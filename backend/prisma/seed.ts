import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  // 建立部門
  console.log('Seeding department...');
  const department = await prisma.department.upsert({
    where: { name: '行政部' },
    update: {},
    create: { name: '行政部' },
  });

  await Promise.all([
    prisma.department.upsert({
      where: { name: '程式部' },
      update: {},
      create: { name: '程式部' },
    }),
    prisma.department.upsert({
      where: { name: '設計部' },
      update: {},
      create: { name: '設計部' },
    }),
    prisma.department.upsert({
      where: { name: '專案部' },
      update: {},
      create: { name: '專案部' },
    }),
  ]);

  console.log('Seeding role...');
  // 建立角色
  const [rootRole, adminRole, userRole] = await Promise.all([
    prisma.role.upsert({
      where: { name: 'root' },
      update: {},
      create: { name: 'root' },
    }),
    prisma.role.upsert({
      where: { name: 'admin' },
      update: {},
      create: { name: 'admin' },
    }),
    prisma.role.upsert({
      where: { name: 'user' },
      update: {},
      create: { name: 'user' },
    }),
  ]);

  // 權限清單
  const permissionData = [
    { action: 'auditLog:read', description: '查看使用者活動紀錄' },

    // Auth 不需要權限

    // User
    { action: 'user:create', description: '建立使用者' },
    { action: 'user:read', description: '查看使用者資料' },
    { action: 'user:update', description: '更新使用者資料' },
    { action: 'user:activate', description: '啟用 / 停用 使用者' },
    { action: 'user:resetPassword', description: '重設使用者密碼' },
    { action: 'user:readTransactions', description: '查看使用者記帳項目' },
    { action: 'user:readBalanceLog', description: '查看使用者帳變紀錄' },

    // Transaction
    { action: 'transaction:create', description: '建立記帳清單' },
    { action: 'transaction:read', description: '查看記帳清單' },
    { action: 'transaction:update', description: '更新記帳清單' },
    { action: 'transaction:delete', description: '刪除記帳清單' },

    // BalanceLog
    { action: 'balanceLog:read', description: '查看所有帳變紀錄' },

    // Notification
    { action: 'notification:read', description: '查看通知' },
    { action: 'notification:update', description: '更新通知狀態（已讀）' },
    { action: 'notification:delete', description: '刪除通知' },
  ];

  console.log('Seeding permissions...');
  await prisma.permission.createMany({
    data: permissionData,
    skipDuplicates: true,
  });

  const allPermissions = await prisma.permission.findMany();

  console.log('Seeding root role permissions...');
  // root：全部權限
  await prisma.rolePermission.createMany({
    data: allPermissions.map((perm) => ({
      roleId: rootRole.id,
      permissionId: perm.id,
    })),
    skipDuplicates: true,
  });

  console.log('Seeding admin role permissions...');
  // admin：目前先給與所有權限（與 root 相同）
  await prisma.rolePermission.createMany({
    data: allPermissions.map((perm) => ({
      roleId: adminRole.id,
      permissionId: perm.id,
    })),
    skipDuplicates: true,
  });

  console.log('Seeding user role permissions...');
  // user：排除部分高權限操作
  const userPermissions = allPermissions.filter(
    (p) =>
      ![
        'user:create',
        'user:resetPassword',
        'transaction:delete',
        'notification:delete',
        'auditLog:read',
      ].includes(p.action),
  );

  await prisma.rolePermission.createMany({
    data: userPermissions.map((perm) => ({
      roleId: userRole.id,
      permissionId: perm.id,
    })),
    skipDuplicates: true,
  });

  if (!process.env.APP_ROOT_USER_PASSWORD || !process.env.APP_SALT_ROUNDS) {
    throw new Error('Missing required environment variables');
  }

  console.log('Seeding root user password...');
  // 密碼加密
  const hashedPassword = await bcrypt.hash(
    process.env.APP_ROOT_USER_PASSWORD,
    parseInt(process.env.APP_SALT_ROUNDS),
  );

  console.log('Seeding root user...');
  // 建立 root 使用者
  const rootUser = await prisma.user.upsert({
    where: { uid: 'root' },
    update: {},
    create: {
      uid: 'root',
      name: 'Super Root',
      password: hashedPassword,
      roleId: rootRole.id,
      departmentId: department.id,
      balance: 0,
      isInit: true,
      // createdBy: 'system',
    },
  });

  console.log('Seeding user balance log...');
  await prisma.userBalanceLog.create({
    data: {
      uid: rootUser.uid,
      value: 0,
      currentBalance: 0,
      reference: 'init:seed',
    },
  });
}

main()
  .then(() => {
    console.log('✅ Seeding completed.');
  })
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
