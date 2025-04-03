// Background script for the Mood Palette Extension

chrome.runtime.onInstalled.addListener(() => {
    console.log("✅ Mood Palette Extension Installed!");
});

// ✅ Message listener to handle requests from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("📩 Received message:", message);

    if (message.action === "someAction") {
        console.log("✅ Handling 'someAction'...");
        sendResponse({ status: "success", data: "Handled successfully!" });
    } else {
        console.warn("⚠️ Unrecognized action:", message.action);
    }

    return true; // ✅ Ensure the response is handled properly
});
