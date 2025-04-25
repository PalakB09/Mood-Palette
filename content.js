console.log("✅ Mood Palette Extension: Content script loaded!");

// Ensure document is fully loaded before executing scripts
function onDocumentReady(callback) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        callback();
    } else {
        document.addEventListener("DOMContentLoaded", callback);
    }
}

// Function to load face-api.js models once
async function loadModels() {
    console.log("⏳ Loading face-api models...");
    await faceapi.nets.tinyFaceDetector.loadFromUri(chrome.runtime.getURL("public/models"));
    await faceapi.nets.faceExpressionNet.loadFromUri(chrome.runtime.getURL("public/models"));
    console.log("✅ Face-api models loaded!");
}

// Function to set up the webcam
async function setupWebcam() {
    const video = document.createElement("video");
    video.autoplay = true;
    video.style.position = "absolute";
    video.style.top = "-9999px"; // Hide video
    document.body.appendChild(video);

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        console.log("✅ Webcam access granted!");
    } catch (error) {
        console.error("❌ Webcam access denied!", error);
    }

    return video;
}

// Function to detect mood
async function detectMood(video) {
    try {
        const detectionOptions = new faceapi.TinyFaceDetectorOptions({
            inputSize: 160, // Reduce input size for faster processing
            scoreThreshold: 0.5
        });

        const detections = await faceapi.detectAllFaces(video, detectionOptions).withFaceExpressions();

        if (detections.length > 0) {
            const dominantExpression = detections[0].expressions.asSortedArray()[0].expression;
            document.body.style.backgroundColor = moodColors[dominantExpression] || '#FFFFFF';
            console.log(`🎭 Detected mood: ${dominantExpression}`);
        }
    } catch (error) {
        console.error("❌ Mood detection failed:", error);
    }
}

// Function to start mood detection loop
async function startMoodDetection() {
    console.log("🔄 Initializing mood detection...");
    await loadModels();
    const video = await setupWebcam();

    setInterval(() => detectMood(video), 1000); // Detect mood every second instead of 5s
}

// Ensure document is ready before injecting face-api.js
onDocumentReady(() => {
    console.log("✅ Document is ready!");

    // Ensure face-api.js is loaded
    if (typeof faceapi === "undefined") {
        console.error("❌ face-api.js is not available. Make sure it's loaded in manifest.json.");
        return;
    }

    console.log("✅ face-api.js successfully loaded, starting mood detection...");
    setTimeout(startMoodDetection, 3000);
});

// Define mood colors
const moodColors = {
    happy: '#FFFFC5',       // Gold
    sad: '#2E8A99    ',         // Dodger Blue
    angry: '#FF4500',       // Orange Red
    surprised: '#FFB03B',   // Orange
    neutral: '#F3F6F6',     // Gray
    disgusted: '#8B008B',   // Dark Magenta
    fearful: '#800080'      // Purple
};
