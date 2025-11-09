import CryptoJS from 'crypto-js'

// Encryption key from environment variable
const ENCRYPTION_KEY = process.env.ENCRYPTION_SECRET_KEY || 'your-default-secret-key-change-this-in-production'

/**
 * Encrypts sensitive data like API tokens
 * @param plainText - The text to encrypt
 * @returns Encrypted string
 */
export function encrypt(plainText: string): string {
  if (!plainText) return ''

  try {
    const encrypted = CryptoJS.AES.encrypt(plainText, ENCRYPTION_KEY).toString()
    return encrypted
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt data')
  }
}

/**
 * Decrypts encrypted data
 * @param encryptedText - The encrypted text to decrypt
 * @returns Decrypted string
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText) return ''

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    return decrypted
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Failed to decrypt data')
  }
}

/**
 * Securely hash a value (one-way, for verification only)
 * @param value - The value to hash
 * @returns Hashed string
 */
export function hash(value: string): string {
  return CryptoJS.SHA256(value).toString()
}
