import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * @example
const key = 'yourSecretKey';
const encryption = new Encryption(key);

const plaintext = 'Hello, World!';
const encryptedText = encryption.encrypt(plaintext);
console.log('Encrypted:', encryptedText);

const decryptedText = encryption.decrypt(encryptedText);
console.log('Decrypted:', decryptedText);
 */
@Injectable()
export class Encryption {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  // Hash the key using SHA-256 to ensure it is 32 bytes long
  private async hashKey(key: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const hash = await crypto.subtle.digest('SHA-256', keyData);
    return crypto.subtle.importKey('raw', hash, { name: 'AES-GCM' }, false, [
      'encrypt',
      'decrypt',
    ]);
  }

  // Encrypt the plaintext using AES-GCM with the given key
  async encrypt(plaintext: string): Promise<string> {
    const key = await this.hashKey(this.key);
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);

    const iv = crypto.getRandomValues(new Uint8Array(12)); // AES-GCM recommended nonce size is 12 bytes
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      data,
    );

    // Combine IV and encrypted data into a single buffer
    const combined = new Uint8Array(iv.byteLength + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.byteLength);

    // Encode the combined buffer to base64
    return btoa(String.fromCharCode(...combined));
  }

  // Decrypt the ciphertext using AES-GCM with the given key
  async decrypt(ciphertext: string): Promise<string> {
    const key = await this.hashKey(this.key);
    const combined = new Uint8Array(
      atob(ciphertext)
        .split('')
        .map((char) => char.charCodeAt(0)),
    );

    const iv = combined.slice(0, 12); // Extract the first 12 bytes as the IV
    const data = combined.slice(12); // The rest is the ciphertext

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      data,
    );
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }
}
