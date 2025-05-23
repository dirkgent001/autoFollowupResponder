window.alert("✅ Auto Follow-Up Extension Loaded!");
console.log("[autoFollowupResponder] Extension loaded.");

let lastUserMessageTime = Date.now();
let followupStage = 0;
let checkInterval = null;

function sendBotMessage(message) {
    console.log(`[autoFollowupResponder] Sending message: ${message}`);
    // @ts-ignore
    ST.sendMessageToCharacter(message);
}

function resetFollowup() {
    followupStage = 0;
    lastUserMessageTime = Date.now();
    console.log("[autoFollowupResponder] User activity detected. Timer reset.");
}

function monitorInactivity() {
    const now = Date.now();
    const elapsed = (now - lastUserMessageTime) / 1000;
    console.log(`[autoFollowupResponder] Inactivity time: ${elapsed.toFixed(1)}s`);

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

// Hook into message system
ST.onUserMessage((msg) => {
    resetFollowup();
});

checkInterval = setInterval(monitorInactivity, 5000);
