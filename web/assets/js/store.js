document.addEventListener('alpine:init', () => {
    Alpine.store('main', {
        symbols: Alpine.$persist({}).as('main.symbols'),
        selectedSymbols: Alpine.$persist([]).as('main.selectedSymbols'),
        lastSelectedSymbol: '',
        dtBegin: Alpine.$persist('').as('main.dtBegin'),
        dtEnd: '',

        setSymbols(data) {
            this.symbols = {};
            this.symbols.lastSync = Math.floor(Date.now() / 1000);
            this.symbols.items = data.items;
        },

        getSymbol(code) {
            return this.symbols.items.find((item) => item.code === code);
        },

        addSelected(code, dtBegin, dtEnd) {
          let symbol = this.getSymbol(code);
          this.selectedSymbols.push(symbol);
          this.lastSelectedSymbol = code;
          this.dtBegin = dtBegin;
          this.dtEnd = dtEnd;

          console.log(code, dtBegin, dtEnd);
        },

        init() {
            let fetchSymbols = true
            let now = Math.floor(Date.now() / 1000);

            if (this.symbols.lastSync !== undefined) {
                let diff = now - this.symbols.lastSync;
                fetchSymbols = diff > 60 * 60;
            }

            if (fetchSymbols) {
                fetch('/api/v1/symbols')
                    .then(response => response.json())
                    .then(data => this.setSymbols(data));
            }
        }
    })
})