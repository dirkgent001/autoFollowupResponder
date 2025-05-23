console.log("[autoFollowupResponder] Script loaded ✅");

const banner = document.createElement("div");
banner.textContent = "🔥 autoFollowupResponder.js loaded";
banner.style.position = "fixed";
banner.style.bottom = "0";
banner.style.left = "0";
banner.style.background = "black";
banner.style.color = "white";
banner.style.padding = "5px";
banner.style.zIndex = "9999";
document.body.appendChild(banner);

let lastUserMessageTime = Date.now();
let followupStage = 0;

function sendBotMessage(msg) {
    console.log(`[autoFollowupResponder] Attempting to send: ${msg}`);
    if (typeof window.send_message === 'function') {
        window.send_message(msg, {is_user: false});
    } else {
        console.warn("[autoFollowupResponder] send_message is not available.");
    }
}

function resetTimer() {
    followupStage = 0;
    lastUserMessageTime = Date.now();
    console.log("[autoFollowupResponder] Timer reset.");
}

function monitorSilence() {
    const elapsed = (Date.now() - lastUserMessageTime) / 1000;

    console.log(`[autoFollowupResponder] Inactivity: ${elapsed}s`);

    if (followupStage === 0 && elapsed > 60) {
        sendBotMessage("...Hey, you still there?");
        followupStage = 1;
    } else if (followupStage === 1 && elapsed > 90) {
        sendBotMessage("You’ve gone quiet… Did I say something weird?");
        followupStage = 2;
    } else if (followupStage === 2 && elapsed > 120) {
        sendBotMessage("Okay… I’ll stop bugging you now. *sighs*");
        followupStage = 3;
    }
}

// Use MutationObserver to detect new user messages in the chat
function setupUserMessageObserver() {
    const chatContainer = document.querySelector("#chat");
    if (chatContainer) {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                for (const node of mutation.addedNodes) {
                    if (
                        node.nodeType === 1 &&
                        node.classList.contains("mes") &&
                        node.classList.contains("mes_user")
                    ) {
                        resetTimer();
                    }
                }
            }
        });
        observer.observe(chatContainer, { childList: true, subtree: true });
        console.log("[autoFollowupResponder] User message observer set up.");
    } else {
        console.warn("[autoFollowupResponder] Chat container not found.");
    }
}

window.addEventListener("DOMContentLoaded", () => {
    setupUserMessageObserver();
    setInterval(monitorSilence, 5000);
});
