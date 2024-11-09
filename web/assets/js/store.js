document.addEventListener('alpine:init', () => {
    Alpine.store('main', {
        symbols: Alpine.$persist({}).as('main.symbols'),
        selectedSymbols: Alpine.$persist([]).as('main.selectedSymbols'),
        lastSelectedSymbol: '',
        dateBegin: Alpine.$persist('').as('main.dateBegin'),
        dateEnd: Alpine.$persist('').as('main.dateEnd'),

        setPeriod(p) {
            const now = new Date();
            const month = 30;
            const year = month * 12;
            let days = 0;

            switch (p) {
                case '1A':
                    days = month;
                    break;
                case '3A':
                    days = month * 3;
                    break;
                case '6A':
                    days = month * 6;
                    break;
                case 'SB':
                    days = daysPassed(now);
                    break;
                case '1Y':
                    days = year;
                    break;
                case '3Y':
                    days = year * 3;
                    break;
                case '5Y':
                    days = year * 5;
                    break;
            }

            this.dateEnd = checkDate(now);
            this.dateBegin = checkDate(now.setDate(now.getDate() - days));
        },

        setSymbols(data) {
            this.symbols = {};
            this.symbols.lastSync = Math.floor(Date.now() / 1000);
            this.symbols.items = data.items;
        },

        getSymbol(code) {
            return this.symbols.items.find((item) => item.code === code);
        },

        addSelected(code) {
            let symbol = this.getSymbol(code);
            this.selectedSymbols.push(symbol);
            this.lastSelectedSymbol = code;
        },

        init() {
            this.dateBegin = checkDate(this.dateBegin);
            this.dateEnd = checkDate(this.dateEnd);

            let fetchSymbols = true
            let now = Math.floor(Date.now() / 1000);

            if (this.symbols.lastSync !== undefined) {
                let diff = now - this.symbols.lastSync;
                fetchSymbols = diff > 60 * 60 * 24;
            }

            if (fetchSymbols) {
                fetch('/api/v1/symbols')
                    .then(response => response.json())
                    .then(data => this.setSymbols(data));
            }
        }
    })
})

function checkDate(d) {
    let dt = new Date(d);

    if (isNaN(dt)) {
        dt = new Date();
    }
    return dt.toISOString().split('T')[0];
}

function daysPassed(d) {
    const current = new Date(d.getTime());
    const previous = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((current - previous + 1) / 86400000);
}