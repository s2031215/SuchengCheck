document.addEventListener("mousedown", sendMessage, false);
document.addEventListener("mouseup", clickcheck, false);

function clickcheck(e) {
    if (window.getSelection().toString() != "" && e.button == 0) {
        try {
            chrome.runtime.sendMessage(
                {
                    check: "wakeup"
                }
            );
        } catch (error) {
            removeListener(error)
        }
    }
}

function sendMessage(e) {
    if (window.getSelection().toString() != "" && e.button == 2) {
        let qdict_result = finddict(window.getSelection().toString());
        try {
            chrome.runtime.sendMessage(
                {
                    selection: qdict_result
                }
            );
        } catch (error) {
            removeListener(error)
        }
    }
}

function removeListener(error) {
    console.log("Service Worker is Down!, Teardown Old content script\n " + error)
    document.removeEventListener("mousedown", sendMessage, false);
    document.removeEventListener("mouseup", clickcheck, false);
}