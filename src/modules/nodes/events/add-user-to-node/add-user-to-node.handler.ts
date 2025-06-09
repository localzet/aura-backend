import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { AddUserCommand as AddUserToNodeCommandSdk, CipherType } from '@localzet/aura-node-contract/build/commands';

import { getVlessFlowFromDbInbound } from '@common/utils/flow/get-vless-flow';

import { NodeUsersQueueService } from '@queue/node-users/node-users.service';

import { NodesRepository } from '../../repositories/nodes.repository';
import { AddUserToNodeEvent } from './add-user-to-node.event';

@EventsHandler(AddUserToNodeEvent)
export class AddUserToNodeHandler implements IEventHandler<AddUserToNodeEvent> {
    public readonly logger = new Logger(AddUserToNodeHandler.name);

    constructor(
        private readonly nodesRepository: NodesRepository,
        private readonly nodeUsersQueue: NodeUsersQueueService,
    ) {
    }

    async handle(event: AddUserToNodeEvent) {
        try {
            const userEntity = event.user;

            const nodes = await this.nodesRepository.findConnectedNodes();

            if (nodes.length === 0) {
                return;
            }

            if (userEntity.activeUserInbounds.length === 0) {
                return;
            }

            const userData: AddUserToNodeCommandSdk.Request = {
                data: userEntity.activeUserInbounds.map((inbound) => {
                    const inboundType = inbound.type;

                    switch (inboundType) {
                        case 'trojan':
                            return {
                                type: inboundType,
                                username: userEntity.username,
                                password: userEntity.trojanPassword,
                                level: 0,
                                tag: inbound.tag,
                            };
                        case 'vless':
                            return {
                                type: inboundType,
                                username: userEntity.username,
                                uuid: userEntity.vlessUuid,
                                flow: getVlessFlowFromDbInbound(inbound),
                                level: 0,
                                tag: inbound.tag,
                            };
                        case 'shadowsocks':
                            return {
                                type: inboundType,
                                username: userEntity.username,
                                password: userEntity.ssPassword,
                                level: 0,
                                tag: inbound.tag,
                                cipherType: CipherType.CHACHA20_POLY1305,
                                ivCheck: false,
                            };
                        default:
                            throw new Error(`Unsupported inbound type: ${inboundType}`);
                    }
                }),
            };

            for (const node of nodes) {
                const excludedTags = new Set(node.excludedInbounds.map((inbound) => inbound.tag));

                const filteredData = {
                    ...userData,
                    data: userData.data.filter((item) => !excludedTags.has(item.tag)),
                };

                if (filteredData.data.length === 0) {
                    continue;
                }

                await this.nodeUsersQueue.addUsersToNode({
                    data: filteredData,
                    node: {
                        address: node.address,
                        port: node.port,
                    },
                });
            }

            return;
        } catch (error) {
            this.logger.error(`Error in Event AddUserToNodeHandler: ${error}`);
        }
    }
}
