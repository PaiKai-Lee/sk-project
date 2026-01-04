const FEATURE_NAME = 'audit-logs';

export const auditLogQueryKeys = {
  getAuditLogs: (params?: Record<string, any>) =>
    [FEATURE_NAME, 'list', params] as const,
};
