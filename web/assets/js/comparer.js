document.addEventListener('alpine:init', () => {
    Alpine.store('comparer', {
        list: Alpine.$persist([]).as('comparer.list'),

        async addQuote(code, dt1, dt2) {
            if (code === '') {
                return
            }

            //let d1 = '2024-10-21'
            //let d2 = '2024-10-25'
            let quote = await getQuoteWithHistory(code, dt1, dt2);
            let symbol = Alpine.store('main').getSymbol(code);

            quote.symbol = symbol;
            this.list.push(quote);
        },

        async calcProfits() {
            let greatest = 0.00;
            for (let i in this.list) {
                const q = this.list[i];
                if (q.history.change.byRatio.amount > greatest) {
                    greatest = q.history.change.byRatio.amount;
                }
            }

            for (let i in this.list) {
                const q = this.list[i];
                const score = (q.history.change.byRatio.amount * 100) / greatest;
                q.history.change.score = parseFloat(score.toFixed(2));

            }
        },

        init() {
            Alpine.effect(() => {
                this.calcProfits().then();
            })
        }
    })

    Alpine.effect(() => {
        const code = Alpine.store('main').lastSelectedSymbol;
        const dt1 = Alpine.store('main').dtBegin;
        const dt2 = Alpine.store('main').dtEnd;

        Alpine.store('comparer').addQuote(code, dt1, dt2).then();
    })
})

async function getQuoteWithHistory(code, date1, date2) {
    let quote = {};

    const response = await fetch('/api/v1/quote-with-history?symbols=' + code + '&period=' + date1 + ',' + date2);
    const data = await response.json();

    quote = data.items[0];
    return quote;
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

    return 'bg-'+color+'-400';
}