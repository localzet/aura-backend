import { InjectBot, Update } from '@kastov/grammy-nestjs';
import { Bot, Context } from 'grammy';

import { BOT_NAME } from './constants/bot-name.constant';

@Update()
export class BotUpdateService {
    constructor(
        @InjectBot(BOT_NAME)
        private readonly bot: Bot<Context>,
    ) {
    }
}
