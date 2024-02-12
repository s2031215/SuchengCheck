function getHistory() {
    return chrome.storage.local.get(["qSearchHistory"]).then((result) => {
        return JSON.parse(result.qSearchHistory || '[]');
    });
}

console.log(getHistory());

window.addEventListener('click', function (e) {
    if (e.target.href !== undefined) {
        chrome.tabs.create({ url: e.target.href })
    }
})


async function writeTable() {
    // cache <tbody> element:
    var table = $('tbody');
    var mydata = await getHistory();
    for (var i = 0; i < mydata.length; i++) {
        table.append(
            '<tr><td>' + mydata[i] + '</td>' +
            '<td>' +
            '<a href="https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=' + mydata[i][0] + '">詳細<a>/' +
            '<a class="wordimg" style="margin: 5px 5px 0 -2px;" href="https://www.hkcards.com/cj/cj-char-' + mydata[i][0] + '.html">字碼<img src="https://www.hkcards.com/img/cj/' + mydata[i][0] + '.png" /></a>' +
            '</td><tr/>'
        );
    }
}

writeTable()