document.addEventListener('alpine:init', () => {
    Alpine.store('main', {
        symbols: Alpine.$persist({}).as('main.symbols'),
        dateBegin: Alpine.$persist('').as('main.dateBegin'),
        dateEnd: Alpine.$persist('').as('main.dateEnd'),
        compared: Alpine.$persist([]).as('main.compared'),

        setPeriod(p) {
            let begin = dayjs();
            let end = dayjs();

            switch (p) {
                case '1A':
                    begin = begin.subtract(1, 'month');
                    break
                case '3A':
                    begin = begin.subtract(3, 'month');
                    break
                case '6A':
                    begin = begin.subtract(6, 'month');
                    break
                case 'SB':
                    begin = begin.startOf('year');
                    break;
                case '1Y':
                    begin = begin.subtract(1, 'year');
                    break
                case '3Y':
                    begin = begin.subtract(3, 'year');
                    break
                case '5Y':
                    begin = begin.subtract(5, 'year');
                    break
            }

            this.dateBegin = begin.format('YYYY-MM-DD');
            this.dateEnd = end.format('YYYY-MM-DD');
        },

        setSymbols(data) {
            this.symbols = {};
            this.symbols.lastSync = Math.floor(Date.now() / 1000);
            this.symbols.items = data.items;
        },

        getSymbol(code) {
            return this.symbols.items.find((item) => item.code === code);
        },

        async addCompared(code) {
            if (code === '') {
                return
            }

            let item = this.compared.find(x => x.code === code);

            if (!(item === null || item === undefined)) {
                return
            }

            let dateBegin = Alpine.store('main').dateBegin;
            let dateEnd = Alpine.store('main').dateEnd;

            let quote = await getQuoteWithHistory(code, dateBegin, dateEnd);
            quote.icon = Alpine.store('main').getSymbol(code).icon;

            this.compared.push(quote);

            this.calcProfits();
        },

        deleteCompared(index) {
            this.compared.splice(index, 1);
        },

        calcProfits() {
            let greatest = 0.00;
            for (let i in this.compared) {
                const q = this.compared[i];
                if (q.history.change.byRatio.amount > greatest) {
                    greatest = q.history.change.byRatio.amount;
                }
            }

            for (let i in this.compared) {
                const q = this.compared[i];
                const score = (q.history.change.byRatio.amount * 100) / greatest;
                q.history.change.score = parseFloat(score.toFixed(2));

            }
        },

        checkDate(d) {
            if (!dayjs(d).isValid()) {
                return dayjs().format('YYYY-MM-DD');
            }

            return dayjs(d).format('YYYY-MM-DD');
        },

        init() {
            this.dateBegin = this.checkDate(this.dateBegin);
            this.dateEnd = this.checkDate(this.dateEnd);

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
