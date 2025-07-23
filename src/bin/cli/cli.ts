#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';
import consola from 'consola';

import { encodeCertPayload } from '@common/utils/certs/encode-node-payload';
import { generateNodeCert } from '@common/utils/certs';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

const enum CLI_ACTIONS {
    EXIT = 'exit',
    GET_SSL_CERT_FOR_NODE = 'get-ssl-cert-for-node',
    RESET_CERTS = 'reset-certs',
    RESET_SUPERADMIN = 'reset-superadmin',
}

async function checkDatabaseConnection() {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return true;
    } catch (error) {
        consola.error('❌ Database connection error:', error);
        return false;
    }
}

async function resetSuperadmin() {
    const answer = await consola.prompt('Are you sure you want to delete the superadmin?', {
        type: 'confirm',
        required: true,
    });

    if (!answer) {
        consola.error('❌ Aborted.');
        process.exit(1);
    }

    consola.start('🔄 Deleting superadmin...');

    const superadmin = await prisma.admin.findFirst();

    if (!superadmin) {
        consola.error('❌ Superadmin not found.');
        process.exit(1);
    }

    try {
        await prisma.admin.delete({
            where: {
                uuid: superadmin.uuid,
            },
        });
        consola.success(`✅ Superadmin ${superadmin.username} deleted successfully.`);
    } catch (error) {
        consola.error('❌ Failed to delete superadmin:', error);
        process.exit(1);
    }
}

async function resetCerts() {
    const answer = await consola.prompt(
        'Are you sure you want to delete the certs? You will need to add new certs to all nodes again.',
        {
            type: 'confirm',
            required: true,
        },
    );

    if (!answer) {
        consola.error('❌ Aborted.');
        process.exit(1);
    }

    consola.start('🔄 Deleting certs...');

    const keygen = await prisma.keygen.findFirst();

    if (!keygen) {
        consola.error('❌ Certs not found.');
        process.exit(1);
    }

    try {
        await prisma.keygen.delete({
            where: {
                uuid: keygen.uuid,
            },
        });
        consola.success('✅ Certs deleted successfully.');
        consola.warn(
            'Restart Aura to apply changes by running "docker compose down && docker compose up -d".',
        );
    } catch (error) {
        consola.error('❌ Failed to reset certs:', error);
        process.exit(1);
    }
}

async function getSslCertForNode() {
    consola.start('🔑 Getting SSL cert for node...');

    try {
        const keygen = await prisma.keygen.findFirst();

        if (!keygen) {
            consola.error('❌ Keygen not found. Reset certs first or restart Aura.');
            process.exit(1);
        }

        if (!keygen.caCert || !keygen.caKey) {
            consola.error('❌ Certs not found. Reset certs first or restart Aura.');
            process.exit(1);
        }

        const { nodeCertPem, nodeKeyPem } = await generateNodeCert(keygen.caCert, keygen.caKey);

        const nodePayload = encodeCertPayload({
            nodeCertPem,
            nodeKeyPem,
            caCertPem: keygen.caCert,
            jwtPublicKey: keygen.pubKey,
        });

        consola.success('✅ SSL cert for node generated successfully.');

        consola.info(`\nSSL_CERT="${nodePayload}"`);

        process.exit(0);
    } catch (error) {
        consola.error('❌ Failed to get SSL cert for node:', error);
        process.exit(1);
    }
}

async function main() {
    consola.box('Aura Rescue CLI v0.2');

    consola.start('🌱 Checking database connection...');
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
        consola.error('❌ Failed to connect to database. Exiting...');
        process.exit(1);
    }
    consola.success('✅ Database connected!');

    const action = await consola.prompt('Select an action', {
        type: 'select',
        required: true,
        options: [
            {
                value: CLI_ACTIONS.RESET_SUPERADMIN,
                label: 'Reset superadmin',
                hint: 'Fully reset superadmin',
            },
            {
                value: CLI_ACTIONS.RESET_CERTS,
                label: 'Reset certs',
                hint: 'Fully reset certs',
            },
            {
                value: CLI_ACTIONS.GET_SSL_CERT_FOR_NODE,
                label: 'Get SSL_CERT for a Aura Node',
                hint: 'Get SSL_CERT in cases, where you can not get from Panel',
            },
            {
                value: CLI_ACTIONS.EXIT,
                label: 'Exit',
            },
        ],
        initial: CLI_ACTIONS.RESET_SUPERADMIN,
    });

    switch (action) {
        case CLI_ACTIONS.RESET_SUPERADMIN:
            await resetSuperadmin();
            break;
        case CLI_ACTIONS.RESET_CERTS:
            await resetCerts();
            break;
        case CLI_ACTIONS.GET_SSL_CERT_FOR_NODE:
            await getSslCertForNode();
            break;
        case CLI_ACTIONS.EXIT:
            consola.info('👋 Exiting...');
            process.exit(0);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        consola.error('❌ An error occurred:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
