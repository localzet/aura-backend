import { ServiceEvents } from './service/service.events';
import { UsersEvents } from './users/users.events';
import { NodesEvents } from './nodes';

export const TELEGRAM_BOT_EVENTS = [UsersEvents, NodesEvents, ServiceEvents];
