// Reference: https://www.happ.su/main/developer-documentation/crypto-link#api-instructions
import { publicEncrypt } from 'node:crypto';

const HAPP_PUBLIC_KEY_1024 = `
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCxsS7PUq1biQlVD92rf6eXKr9o
G1/SrYx3qWahZP+Jq35m4Wb/Z+mB6eBWrPzJ/zZpZLWLQorcvOKt+sLaCHyH1HLN
kti4jlaEQX6x97XgBm8GK08+lLLWquFDhWRNxsrfzJyNdpVopzBRmCJKTc8ObYyP
brv9T35a8Kd5WqjnUwIDAQAB
-----END PUBLIC KEY-----
`;

const HAPP_PUBLIC_KEY_4096 = `
-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA5cL2yu9dZGnNbs4jt222
NugIqiuZdXKdTh4IgXZmOX0vdpW+rYWrPd1EObQ3Urt+YBTK5Di98EBjYCPr8tus
aVRAn3Vaq41CDisEdX35u1N8jSHQ0zDOtPdrvJtlqShib4UI6Vybk/QSmoZVbpRb
67TNsiFqBmK1kxT+mbtHkhdT2u+hzNLQr0FtJR1+gC+ELKZ48zZY/d3YSSRSb+dx
Und4FH31Kz68VKqlajISSzIrGQWc/zqSlihIvfnTPNX3pCyJpwAuYXieWSRDAogr
wGwoiN++y14OLYHrNlqzoJ44WM3Tbm7x1Dj/8QI3tzwixli/0JmqQ19ssETDbVQ9
0asoPc4QFhyc4c+PH62AdK1S+ysXt5uqEujRBk3rC53l65IOVXSTZgsLwzS7EFY9
lZszJXUJJh5GB9heO8c7PNCTOxno3l4684iHFJuxnkS0DLbdzCXfovwfIP8q3lj7
UJswPKVHkCLNSUutNke+xex1J3YEdvebJzv7Dk78PqLRmLWaEsAhQanXs93aTxEk
d/p7hgFV30QozVQ/oNAvmQSVIBd6zCGM3of3R3tmDkDNGQGrY4MBTX+cTJGYstdh
QXxj1oFZEG16F/0GGXG+sia67gYM3OC7RWyBOzULsEmupIiM8Vdx1iErw7yvJSC4
IsIsWZD8JAmZtLBqEQ/TvfcCAwEAAQ==
-----END PUBLIC KEY-----
`;

export function createHappCryptoLink(content: string): string {
    try {
        const options = {
            key: content.length > 109 ? HAPP_PUBLIC_KEY_4096 : HAPP_PUBLIC_KEY_1024,
            padding: 1, // RSA_PKCS1_PADDING
        };

        const encrypted = publicEncrypt(options, Buffer.from(content));
        const prefix = content.length > 109 ? 'happ://crypt2/' : 'happ://crypt/';
        return prefix + encrypted.toString('base64');
    } catch {
        return '';
    }
}
