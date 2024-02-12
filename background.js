
const manifest = chrome.runtime.getManifest();

function installContentScript() {
    // iterate over all content_script definitions from manifest
    // and install all their js files to the corresponding hosts.
    let contentScripts = manifest.content_scripts;
    for (let i = 0; i < contentScripts.length; i++) {
        let contScript = contentScripts[i];
        chrome.tabs.query({ url: contScript.matches }, function (foundTabs) {
            for (let j = 0; j < foundTabs.length; j++) {
                let javaScripts = contScript.js;
                if (foundTabs[j].url.includes('https')) {
                    for (let k = 0; k < javaScripts.length; k++) {
                        chrome.scripting
                            .executeScript({
                                target: { tabId: foundTabs[j].id },
                                files: [javaScripts[k]],
                            })
                            .then(() => {
                                console.log("script injected")
                            }).catch(error => {
                                console.log(error + ' in ' + foundTabs[j].url)
                            });

                    }
                }

            }
        });
    }
}

chrome.runtime.onInstalled.addListener(installContentScript);

chrome.contextMenus.onClicked.addListener(genericOnClick);

// A generic onclick callback function.
function genericOnClick(info) {
    switch (info.menuItemId) {
        case 'selection':
            // Checkbox item function
            console.log('速成查字:', info.selectionText);
            break;
        default:
            // Standard context menu item function
            console.log('Standard context menu item clicked.');
    }
}

function gotopage(info, tab) {
    if (info.selectionText != "") {
        var newURL = "https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=" + info.selectionText[0];
        chrome.tabs.create({ url: newURL });
    }
}

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        title: '速成查字',
        contexts: ['selection'],
        id: 'selection'
    });
});

function getHistory() {
    return chrome.storage.local.get(["qSearchHistory"]).then((result) => {
        return JSON.parse(result.qSearchHistory || '[]');
    });
}

async function setHistory(record) {
    var historylist = await getHistory();
    if (historylist.includes(record)) {
        console.log('exist record skip');
        return
    }
    if (historylist.length >= 10) {
        historylist.pop()
    }
    historylist.unshift(record)
    chrome.storage.local.set({ 'qSearchHistory': JSON.stringify(historylist) }, function () {
        console.log('history saved successfully');
    });
}


chrome.runtime.onMessage.addListener(updateTitle);
function updateTitle(msg) {
    if ("selection" in msg) {
        if (msg.selection != "") {
            chrome.contextMenus.update(
                'selection',
                {
                    title: '速成查字: ' + msg.selection,
                    onclick: gotopage
                }
            );
            setHistory(msg.selection);
        } else {
            chrome.contextMenus.update(
                'selection',
                {
                    title: '速成查字: 請選取中文字',
                    onclick: null
                }
            )

        }

    }
    if ("check" in msg) {
        console.log("background is up")
    }
};