import { UpdateStatusAndTrafficAndResetAtHandler } from './update-status-and-traffic-and-reset-at';
import { UpdateSubLastOpenedAndUserAgentHandler } from './update-sub-last-opened-and-user-agent';
import { BatchResetLimitedUsersTrafficHandler } from './batch-reset-limited-users-traffic';
import { TriggerThresholdNotificationHandler } from './trigger-threshold-notification';
import { BulkIncrementUsedTrafficHandler } from './bulk-increment-used-traffic';
import { UpdateExceededTrafficUsersHandler } from './update-exceeded-users';
import { RevokeUserSubscriptionHandler } from './revoke-user-subscription';
import { BatchResetUserTrafficHandler } from './batch-reset-user-traffic';
import { UpdateUserWithServiceHandler } from './update-user-with-service';
import { IncrementUsedTrafficHandler } from './increment-used-traffic';
import { BulkDeleteByStatusHandler } from './bulk-delete-by-status';
import { UpdateExpiredUsersHandler } from './update-expired-users';
import { ChangeUserStatusHandler } from './change-user-status';
import { ResetUserTrafficHandler } from './reset-user-traffic';

export const COMMANDS = [
    IncrementUsedTrafficHandler,
    ChangeUserStatusHandler,
    UpdateStatusAndTrafficAndResetAtHandler,
    UpdateSubLastOpenedAndUserAgentHandler,
    BatchResetUserTrafficHandler,
    UpdateExpiredUsersHandler,
    UpdateExceededTrafficUsersHandler,
    BatchResetLimitedUsersTrafficHandler,
    BulkIncrementUsedTrafficHandler,
    RevokeUserSubscriptionHandler,
    ResetUserTrafficHandler,
    UpdateUserWithServiceHandler,
    TriggerThresholdNotificationHandler,
    BulkDeleteByStatusHandler,
];
