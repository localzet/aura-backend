import {
    BasicConstraintsExtension,
    cryptoProvider,
    ExtendedKeyUsageExtension,
    KeyUsageFlags,
    KeyUsagesExtension,
    X509Certificate,
    X509CertificateGenerator,
} from '@peculiar/x509';
import { generateKeyPair } from 'node:crypto';
import { Crypto } from '@peculiar/webcrypto';
import { customAlphabet } from 'nanoid';
import { promisify } from 'node:util';

const generateKeyPairAsync = promisify(generateKeyPair);

export async function generateMasterCerts() {
    const crypto = new Crypto();
    const cn = genRandomString();
    cryptoProvider.set(crypto);

    // === CA (Certificate Authority) ===
    const caAlgorithm = {
        name: 'ECDSA',
        namedCurve: 'P-256',
        hash: { name: 'SHA-256' },
    };

    const caKeys = await crypto.subtle.generateKey(caAlgorithm, true, ['sign', 'verify']);
    const caCert = await X509CertificateGenerator.createSelfSigned({
        serialNumber: '01',
        name: `CN=${cn}`,
        notBefore: new Date(),
        notAfter: new Date(new Date().setFullYear(new Date().getFullYear() + 10)),
        keys: caKeys,
        signingAlgorithm: caAlgorithm,
        extensions: [
            new BasicConstraintsExtension(true, undefined, true),
            new KeyUsagesExtension(
                KeyUsageFlags.keyCertSign | KeyUsageFlags.digitalSignature,
                true,
            ),
        ],
    });

    const caPem = {
        cert: caCert.toString('pem'),
        key: arrayBufferToPem(
            new Uint8Array(await crypto.subtle.exportKey('pkcs8', caKeys.privateKey)),
            'PRIVATE KEY',
        ),
    };

    // === Client (Master) ===
    const clientAlgorithm = {
        name: 'ECDSA',
        namedCurve: 'P-256',
        hash: { name: 'SHA-256' },
    };

    const clientKeys = await crypto.subtle.generateKey(clientAlgorithm, true, ['sign', 'verify']);

    const clientCert = await X509CertificateGenerator.create({
        serialNumber: '02',
        subject: `CN=${genRandomString()}`,
        notBefore: new Date(),
        notAfter: new Date(new Date().setFullYear(new Date().getFullYear() + 10)),
        issuer: caCert.subjectName,
        publicKey: clientKeys.publicKey,
        signingKey: caKeys.privateKey,
        extensions: [
            new BasicConstraintsExtension(false, undefined, true),
            new KeyUsagesExtension(KeyUsageFlags.digitalSignature, true),
            new ExtendedKeyUsageExtension(['1.3.6.1.5.5.7.3.2'], true), // clientAuth
        ],
    });

    const clientPem = {
        cert: clientCert.toString('pem'),
        key: arrayBufferToPem(
            new Uint8Array(await crypto.subtle.exportKey('pkcs8', clientKeys.privateKey)),
            'PRIVATE KEY',
        ),
    };

    return {
        caCertPem: caPem.cert,
        caKeyPem: caPem.key,
        clientCertPem: clientPem.cert,
        clientKeyPem: clientPem.key,
    };
}

export async function generateNodeCert(
    caCertPem: string,
    caKeyPem: string,
): Promise<{
    nodeCertPem: string;
    nodeKeyPem: string;
    caCertPem: string;
}> {
    const crypto = new Crypto();
    cryptoProvider.set(crypto);

    const caCert = new X509Certificate(caCertPem);

    const caPrivateKey = await crypto.subtle.importKey(
        'pkcs8',
        pemToArrayBuffer(caKeyPem),
        {
            name: 'ECDSA',
            namedCurve: 'P-256',
            hash: { name: 'SHA-256' },
        },
        false,
        ['sign'],
    );

    const nodeKeys = await crypto.subtle.generateKey(
        {
            name: 'ECDSA',
            namedCurve: 'P-256',
            hash: { name: 'SHA-256' },
        },
        true,
        ['sign', 'verify'],
    );

    const nodeCert = await X509CertificateGenerator.create({
        serialNumber: Date.now().toString(),
        subject: `CN=${genRandomString()}`,
        issuer: caCert.subjectName,
        notBefore: new Date(),
        notAfter: new Date(new Date().setFullYear(new Date().getFullYear() + 3)),
        publicKey: nodeKeys.publicKey,
        signingKey: caPrivateKey,
        extensions: [
            new BasicConstraintsExtension(false, undefined, true),
            new KeyUsagesExtension(
                KeyUsageFlags.digitalSignature | KeyUsageFlags.keyEncipherment,
                true,
            ),
            new ExtendedKeyUsageExtension(['1.3.6.1.5.5.7.3.1'], true), // serverAuth
        ],
    });

    const nodeCertPem = nodeCert.toString('pem');
    const nodeKeyPem = arrayBufferToPem(
        new Uint8Array(await crypto.subtle.exportKey('pkcs8', nodeKeys.privateKey)),
        'PRIVATE KEY',
    );

    return {
        nodeCertPem,
        nodeKeyPem,
        caCertPem,
    };
}

export async function generateJwtKeypair(): Promise<{
    publicKey: string;
    privateKey: string;
}> {
    const { publicKey, privateKey } = await generateKeyPairAsync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        },
    });

    return {
        publicKey,
        privateKey,
    };
}

function arrayBufferToPem(buffer: Uint8Array, label: string): string {
    const b64 = Buffer.from(buffer).toString('base64');
    const formatted = b64.match(/.{1,64}/g)?.join('\n') ?? b64;
    return `-----BEGIN ${label}-----\n${formatted}\n-----END ${label}-----`;
}

function pemToArrayBuffer(pem: string): Uint8Array {
    const b64 = pem
        .replace(/-----BEGIN .* KEY-----/, '')
        .replace(/-----END .* KEY-----/, '')
        .replace(/\s+/g, '');
    return new Uint8Array(Buffer.from(b64, 'base64'));
}

function genRandomString(): string {
    const alphabet = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ_abcdefghjkmnopqrstuvwxyz-';
    const length = Math.floor(Math.random() * 27) + 20;
    const nanoid = customAlphabet(alphabet, length);

    return nanoid();
}
