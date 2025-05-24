const BEGIN_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----';
const END_PRIVATE_KEY = '-----END PRIVATE KEY-----';
const BEGIN_RSA_PRIVATE_KEY = '-----BEGIN RSA PRIVATE KEY-----';
const END_RSA_PRIVATE_KEY = '-----END RSA PRIVATE KEY-----';
const BEGIN_EC_PRIVATE_KEY = '-----BEGIN EC PRIVATE KEY-----';
const END_EC_PRIVATE_KEY = '-----END EC PRIVATE KEY-----';

const EC_POINT_FORMAT_BYTE = 0x04;
const EC_PUBLIC_KEY_LENGTH = 65;
const EC_TYPICAL_KEY_LENGTH = 132;

export function convertStringKeyToPem(input) {
  const trimmedInput = input.trim();

  if (trimmedInput.startsWith(BEGIN_PRIVATE_KEY) && trimmedInput.endsWith(END_PRIVATE_KEY)) {
    return trimmedInput;
  }

  const cleanKey = trimmedInput
    .replace(new RegExp(BEGIN_PRIVATE_KEY, 'g'), '')
    .replace(new RegExp(END_PRIVATE_KEY, 'g'), '')
    .replace(/[\s-]/g, '');

  const chunks = cleanKey.match(/.{1,64}/g) || [];

  return [BEGIN_PRIVATE_KEY, ...chunks, END_PRIVATE_KEY].join('\n');
}

export async function validatePrivateKey(input) {
  const trimmedInput = input.trim();

  try {
    let formattedKey;
    const isEcKey = trimmedInput.includes(BEGIN_EC_PRIVATE_KEY);

    if (trimmedInput.startsWith(BEGIN_PRIVATE_KEY) && trimmedInput.endsWith(END_PRIVATE_KEY)) {
      formattedKey = trimmedInput;
    } else if (
      trimmedInput.startsWith(BEGIN_RSA_PRIVATE_KEY) &&
      trimmedInput.endsWith(END_RSA_PRIVATE_KEY)
    ) {
      formattedKey = trimmedInput;
    } else if (
      trimmedInput.startsWith(BEGIN_EC_PRIVATE_KEY) &&
      trimmedInput.endsWith(END_EC_PRIVATE_KEY)
    ) {
      formattedKey = trimmedInput;
    } else {
      const cleanKey = trimmedInput.replace(/[\s-]/g, '');
      const chunks = cleanKey.match(/.{1,64}/g) || [];
      formattedKey = [BEGIN_EC_PRIVATE_KEY, ...chunks, END_EC_PRIVATE_KEY].join('\n');
    }

    const base64Content = formattedKey
      .replace(BEGIN_PRIVATE_KEY, '')
      .replace(END_PRIVATE_KEY, '')
      .replace(BEGIN_RSA_PRIVATE_KEY, '')
      .replace(END_RSA_PRIVATE_KEY, '')
      .replace(BEGIN_EC_PRIVATE_KEY, '')
      .replace(END_EC_PRIVATE_KEY, '')
      .replace(/\s/g, '');

    const binaryDer = atob(base64Content);
    const der = new Uint8Array(binaryDer.length);
    for (let i = 0; i < binaryDer.length; i++) {
      der[i] = binaryDer.charCodeAt(i);
    }

    if (der.length === EC_TYPICAL_KEY_LENGTH || isEcKey) {
      try {
        let keyStart = -1;
        for (let i = 0; i < der.length - EC_PUBLIC_KEY_LENGTH; i++) {
          if (der[i] === EC_POINT_FORMAT_BYTE && der.length - i >= EC_PUBLIC_KEY_LENGTH) {
            keyStart = i;
            break;
          }
        }

        if (keyStart === -1) {
          throw new Error('Could not find EC key data');
        }

        const curves = ['P-256', 'P-384', 'P-521'];
        for (const curve of curves) {
          try {
            await window.crypto.subtle.importKey(
              'raw',
              der.slice(keyStart),
              {
                name: 'ECDSA',
                namedCurve: curve,
              },
              true,
              ['sign'],
            );
            return formattedKey;
          } catch (error) {
            console.log(`EC import error for ${curve}:`, error);
            continue;
          }
        }
      } catch (error) {
        console.log('EC key parsing error:', error);
      }
    }

    const algorithms = [
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      { name: 'RSA-PSS', hash: 'SHA-256' },
      { name: 'ECDH', namedCurve: 'P-256' },
      { name: 'ECDH', namedCurve: 'P-384' },
      { name: 'ECDH', namedCurve: 'P-521' },
      { name: 'ECDSA', namedCurve: 'P-256' },
      { name: 'ECDSA', namedCurve: 'P-384' },
      { name: 'ECDSA', namedCurve: 'P-521' },
      { name: 'Ed25519' },
    ];

    for (const algorithm of algorithms) {
      try {
        const format = 'pkcs8';
        await window.crypto.subtle.importKey(format, der, algorithm, true, ['sign']);
        return formattedKey;
      } catch (error) {
        console.log('error:', error);
        continue;
      }
    }

    throw new Error('Key format is valid but algorithm type could not be determined');
  } catch (error) {
    throw new Error('Invalid private key format. Details: ' + error);
  }
}
