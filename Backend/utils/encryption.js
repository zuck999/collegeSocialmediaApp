import { HybridCrypto } from "../../RsaAesAlgo.js";

// Initialize hybrid crypto
const hybridCrypto = new HybridCrypto();

// Store RSA key pairs for each user (in production, store securely in DB)
const userKeyPairs = new Map();

/**
 * Generate and store RSA key pair for a user
 * @param {string} userId - User ID
 * @returns {object} Public key
 */
export const generateUserKeyPair = (userId) => {
  if (userKeyPairs.has(userId)) {
    return userKeyPairs.get(userId).publicKey;
  }

  const { publicKey, privateKey } = hybridCrypto.rsa.generateKeyPair(512);
  userKeyPairs.set(userId, { publicKey, privateKey });

  return publicKey;
};

/**
 * Get user's public key
 * @param {string} userId - User ID
 * @returns {object} Public key
 */
export const getUserPublicKey = (userId) => {
  if (!userKeyPairs.has(userId)) {
    return generateUserKeyPair(userId);
  }
  return userKeyPairs.get(userId).publicKey;
};

/**
 * Encrypt message for sending
 * @param {string} message - Plain text message
 * @param {string} recipientUserId - Recipient's user ID
 * @returns {object} Encrypted data
 */
export const encryptMessage = (message, recipientUserId) => {
  const recipientPublicKey = getUserPublicKey(recipientUserId);
  const encryptedData = hybridCrypto.encrypt(message, recipientPublicKey);

  return {
    encryptedMessage: encryptedData.encryptedMessage,
    encryptedKey: encryptedData.encryptedKey,
    algorithm: "AES-128-RSA",
  };
};

/**
 * Decrypt message after receiving
 * @param {string} senderUserId - Sender's user ID
 * @param {object} encryptedData - Encrypted message data
 * @returns {string} Decrypted message
 */
export const decryptMessage = (senderUserId, encryptedData) => {
  if (!userKeyPairs.has(senderUserId)) {
    throw new Error(`No encryption keys found for user: ${senderUserId}`);
  }

  const privateKey = userKeyPairs.get(senderUserId).privateKey;
  const decryptedMessage = hybridCrypto.decrypt(encryptedData, privateKey);

  return decryptedMessage;
};

/**
 * Get user's private key (for internal use only)
 * @param {string} userId - User ID
 * @returns {object} Private key
 */
export const getUserPrivateKey = (userId) => {
  if (!userKeyPairs.has(userId)) {
    generateUserKeyPair(userId);
  }
  return userKeyPairs.get(userId).privateKey;
};

/**
 * Export all user keys for admin/backup (use with caution)
 */
export const exportAllKeys = () => {
  const allKeys = {};
  userKeyPairs.forEach((value, key) => {
    allKeys[key] = {
      publicKey: value.publicKey,
      privateKey: value.privateKey,
    };
  });
  return allKeys;
};

/**
 * Clear all stored keys (for logout)
 * @param {string} userId - User ID
 */
export const clearUserKeys = (userId) => {
  userKeyPairs.delete(userId);
};
