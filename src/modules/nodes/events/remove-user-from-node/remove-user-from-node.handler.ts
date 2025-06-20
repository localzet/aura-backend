import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { RemoveUserCommand as RemoveUserFromNodeCommandSdk } from '@localzet/aura-contract';

import { NodeUsersQueueService } from '@queue/node-users/node-users.service';

import { RemoveUserFromNodeEvent } from './remove-user-from-node.event';
import { NodesRepository } from '../../repositories/nodes.repository';

@EventsHandler(RemoveUserFromNodeEvent)
export class RemoveUserFromNodeHandler implements IEventHandler<RemoveUserFromNodeEvent> {
    public readonly logger = new Logger(RemoveUserFromNodeHandler.name);

    constructor(
        private readonly nodesRepository: NodesRepository,
        private readonly nodeUsersQueue: NodeUsersQueueService,
    ) {
    }

    async handle(event: RemoveUserFromNodeEvent) {
        try {
            const userEntity = event.user;

            if (userEntity.activeUserInbounds.length === 0) {
                return;
            }

            const nodes = await this.nodesRepository.findConnectedNodes();

            if (nodes.length === 0) {
                return;
            }

            const userData: RemoveUserFromNodeCommandSdk.Request = {
                username: userEntity.username,
            };

            await this.nodeUsersQueue.removeUserFromNodeBulk(
                nodes.map((node) => ({
                    data: userData,
                    node: {
                        address: node.address,
                        port: node.port,
                    },
                })),
            );

            return;
        } catch (error) {
            this.logger.error(`Error in Event RemoveUserFromNodeHandler: ${error}`);
        }
    }
}
