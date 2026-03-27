// TEST ENCRYPTION SETUP

// To run this:
// 1. Open browser console (F12)
// 2. Start backend: npm run dev (Backend folder)
// 3. Start frontend: npm run dev (FrontEnd folder)
// 4. Login as user
// 5. Go to chat page
// 6. Paste this in browser console

async function testEncryption() {
  console.log(" Testing Encryption Setup...\n");

  try {
    // Test 1: Check if backend is running
    console.log(" Checking backend connection...");
    const backendTest = await fetch("http://localhost:8000/");
    const result = await backendTest.json();
    console.log(" Backend is running:", result.message);

    // Test 2: Get a sample user ID
    console.log("\n Getting current user...");
    const userId = localStorage.getItem("userId");
    console.log(" User ID:", userId);

    // Test 3: Try to fetch public key
    console.log("\n Fetching public key...");
    const token = localStorage.getItem("token");
    const keyResponse = await fetch(
      `http://localhost:8000/api/v1/message/publicKey/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const keyData = await keyResponse.json();
    if (keyData.success) {
      console.log(" Public key generated:");
      console.log("   e:", keyData.publicKey.e);
      console.log("   n:", keyData.publicKey.n.substring(0, 50) + "...");
    } else {
      console.log(" Failed to get public key:", keyData.message);
    }

    // Test 4: Check Socket connection
    console.log("\nChecking Socket.IO...");
    if (window.socket) {
      console.log("Socket.IO connected:", window.socket.id);
      console.log(
        "   Socket status:",
        window.socket.connected ? "CONNECTED" : "DISCONNECTED",
      );
    } else {
      console.log(" Socket.IO not initialized yet");
    }

    // Test 5: Check encryption utilities
    console.log("\n Checking encryption utilities...");
    try {
      const encUtil = await import("/src/utils/encryptionClient.js");
      console.log(" Encryption utilities loaded");
      console.log("   Functions available:", Object.keys(encUtil));
    } catch (e) {
      console.log(" Could not load utils:", e.message);
    }

    return {
      backend: true,
      authenticated: true,
      keysReady: keyData.success,
      socket: window.socket?.connected || false,
    };
  } catch (error) {
    console.error("Test failed:", error);
    return { error: error.message };
  }
}

// Run test
testEncryption();

// Alternative: Send test message
async function sendTestMessage(recipientId, messageText = "Test encryption") {
  try {
    console.log("🔐 Sending encrypted test message...");

    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:8000/api/v1/message/send/${recipientId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ textMessage: messageText }),
      },
    );

    const data = await response.json();

    if (data.success) {
      console.log(" Message sent successfully!");
      console.log("   Message ID:", data.newMessage._id);
      console.log("   Is encrypted:", data.newMessage.isEncrypted);
      console.log("   Created at:", data.newMessage.createdAt);
      return data.newMessage;
    } else {
      console.error("Failed to send:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
}

// Usage: sendTestMessage("recipient_user_id")
