/**
 * Frontend Encryption Utilities for Chat Messages
 * Works with Backend RSA-AES Hybrid Encryption
 */

/**
 * Fetch recipient's public key from backend
 * @param {string} recipientId - User ID of recipient
 * @param {object} axiosInstance - Axios instance for API calls
 * @returns {Promise<object>} Public key object {e, n}
 */
export const fetchRecipientPublicKey = async (recipientId, axiosInstance) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get(
      `http://localhost:8000/api/v1/message/publicKey/${recipientId}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (response.data.success) {
      return response.data.publicKey;
    }
  } catch (error) {
    console.error("Failed to fetch public key:", error.message);
    throw error;
  }
};

/**
 * Cache for public keys (avoid repeated fetches)
 */
const publicKeyCache = new Map();

/**
 * Get or fetch public key with caching
 * @param {string} userId - User ID
 * @param {object} axiosInstance - Axios instance
 * @returns {Promise<object>} Public key
 */
export const getOrFetchPublicKey = async (userId, axiosInstance) => {
  if (publicKeyCache.has(userId)) {
    return publicKeyCache.get(userId);
  }

  const publicKey = await fetchRecipientPublicKey(userId, axiosInstance);
  publicKeyCache.set(userId, publicKey);
  return publicKey;
};

/**
 * Clear public key cache (useful on logout)
 */
export const clearPublicKeyCache = () => {
  publicKeyCache.clear();
};

/**
 * Show encryption status to user
 * @param {boolean} isEncrypted - Whether message is encrypted
 * @returns {object} Status object with icon and label
 */
export const getEncryptionStatus = (isEncrypted) => {
  return {
    isEncrypted,
    icon: isEncrypted ? "[Encrypted]" : "[Unencrypted]",
    label: isEncrypted ? "Encrypted" : "Unencrypted",
    className: isEncrypted ? "text-green-600" : "text-gray-400",
  };
};

/**
 * Format encrypted message for display
 * Shows that message is encrypted and can be decrypted
 * @param {object} message - Message object from backend
 * @returns {string} Display text
 */
export const formatMessageForDisplay = (message) => {
  if (!message.isEncrypted) {
    return message.message;
  }

  if (message.decrypted) {
    return message.message;
  }

  return "[Encrypted message (decrypting...)]";
};

/**
 * Handle encryption/decryption UI feedback
 * @returns {object} Notification messages
 */
export const getEncryptionNotifications = () => {
  return {
    encrypting: "[Encrypting message...]",
    encrypted: "[Message encrypted]",
    decrypting: "[Decrypting message...]",
    decrypted: "[Message decrypted]",
    encryptionFailed: "[Failed to encrypt (sending unencrypted)]",
    decryptionFailed: "[Failed to decrypt message]",
  };
};

/**
 * Validate message before encryption
 * @param {string} message - Message text
 * @returns {object} Validation result
 */
export const validateMessage = (message) => {
  if (!message || message.trim().length === 0) {
    return {
      valid: false,
      error: "Message cannot be empty",
    };
  }

  if (message.length > 5000) {
    return {
      valid: false,
      error: "Message is too long (max 5000 characters)",
    };
  }

  return { valid: true };
};

/**
 * Get encryption algorithm info
 */
export const getAlgorithmInfo = () => {
  return {
    name: "AES-128-RSA Hybrid",
    description:
      "Uses AES-128 for message encryption and RSA for key encryption",
    security: "High",
    details: {
      symmetric: "AES-128 (128-bit blocks, 10 rounds)",
      asymmetric: "RSA-512 (suitable for demo)",
      padding: "PKCS7",
      keyExchange: "RSA Public Key Cryptography",
    },
  };
};

/**
 * Generate encryption report for debugging
 */
export const generateEncryptionReport = (messages) => {
  const total = messages.length;
  const encrypted = messages.filter((m) => m.isEncrypted).length;
  const decrypted = messages.filter((m) => m.decrypted && m.isEncrypted).length;
  const failed = messages.filter((m) => m.isEncrypted && !m.decrypted).length;

  return {
    total,
    encrypted,
    decrypted,
    failed,
    encryptionRate: ((encrypted / total) * 100).toFixed(2) + "%",
    successRate:
      total > 0 ? ((decrypted / encrypted) * 100).toFixed(2) + "%" : "0%",
  };
};
