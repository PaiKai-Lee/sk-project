module.exports = {
  apps: [
    {
      name: 'sk_projects',
      script: 'npm',
      args: 'run start:prod',
      // 其餘常用參數
      watch: false, // 要不要檔案變動自動重啟
      max_memory_restart: '512M', // 破 512 MB 自動 reload
    },
  ],
};
