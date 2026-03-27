import React, { useState } from "react";
import { useEncryptedMessages } from "../hooks/useEncryptedMessages";

/**
 * Encrypted Chat Component
 * Displays encrypted messages with visual indicators
 */
const EncryptedChat = ({ recipientId, recipientName }) => {
  const {
    messages,
    loading,
    error,
    encryptionStatus,
    recipientPublicKey,
    sendMessage,
    setError,
  } = useEncryptedMessages(recipientId);

  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setSending(true);
    try {
      const success = await sendMessage(inputMessage);
      if (success) {
        setInputMessage("");
      }
    } finally {
      setSending(false);
    }
  };

  if (!recipientPublicKey) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-4xl mb-4">🔓</p>
          <p className="text-gray-600">Setting up encryption...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      {/* Header */}
      <div className="bg-blue-50 border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {recipientName}
            </h2>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              [Encrypted Chat - AES-128-RSA]
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Messages: {messages.length}</p>
            {recipientPublicKey && (
              <p className="text-xs text-green-600">Encryption Ready</p>
            )}
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-3 m-3 rounded flex items-gap gap-2">
          <span className="text-red-600 flex-shrink-0">[!]</span>
          <div>
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-xs text-red-600 underline mt-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-center">
            <div>
              <p className="text-gray-500">No encrypted messages yet</p>
              <p className="text-xs text-gray-400">
                Start a secure conversation!
              </p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.senderId === message.senderId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === message.senderId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <p className="text-sm break-words">{message.displayText}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  {message.isEncrypted && (
                    <div
                      title={
                        message.decrypted
                          ? "Message decrypted"
                          : "Message encrypted"
                      }
                      className="flex-shrink-0 text-lg"
                    >
                      {message.decrypted ? "[Encrypted]" : "[Unencrypted]"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="border-t bg-gray-50 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a secure message..."
            disabled={sending || encryptionStatus === "encrypting"}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={
              !inputMessage.trim() ||
              sending ||
              encryptionStatus === "encrypting"
            }
            className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition ${
              sending || encryptionStatus === "encrypting"
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            📤
            {encryptionStatus === "encrypting" ? "Encrypting..." : "Send"}
          </button>
        </form>

        {/* Encryption Info */}
        <div className="mt-2 text-xs text-gray-600 flex items-center gap-1">
          [Messages are encrypted end-to-end using AES-128 + RSA-512]
        </div>
      </div>
    </div>
  );
};

export default EncryptedChat;
