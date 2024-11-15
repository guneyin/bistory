async function getQuoteWithHistory(code, date1, date2) {
    const response = await fetch('/api/v1/quote-with-history?symbols=' + code + '&period=' + date1 + ',' + date2)
    const data = await response.json()

    return data.items[0];
}

function getQuoteScoreColor(score) {
    let color = 'gray';
    switch (true) {
        case score < 0:
            break;
        case score < 25:
            color = "red";
            break;
        case score < 50:
            color = "orange";
            break;
        case score < 75:
            color = "blue";
            break;
        default:
            color = "green";
    }

    return 'bg-' + color + '-400';
}