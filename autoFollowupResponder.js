console.log("[autoFollowupResponder] Script loaded ✅");

let lastUserMessageTime = Date.now();
let followupStage = 0;

function sendBotMessage(msg) {
    console.log(`[autoFollowupResponder] Attempting to send: ${msg}`);
    if (typeof ST !== 'undefined') {
        ST.sendMessageToCharacter(msg);
    } else {
        console.warn("[autoFollowupResponder] ST is undefined.");
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

// Hook into user messages
if (typeof ST !== 'undefined') {
    ST.onUserMessage(() => {
        resetTimer();
    });
} else {
    console.warn("[autoFollowupResponder] ST is not ready yet.");
}

setInterval(monitorSilence, 5000);
