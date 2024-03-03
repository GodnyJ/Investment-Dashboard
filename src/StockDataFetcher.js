export default class StockDataFetcher {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://cloud.iexapis.com/stable/stock';
    }

    async fetchStockPrice(symbol) {
        const url = `${this.baseUrl}/${symbol}/quote?token=${this.apiKey}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
            return {
                symbol: data.symbol,
                price: data.latestPrice,
                change: data.change,
                changePercent: data.changePercent * 100,
                previousClose: data.previousClose,
                high: data.high,
                low: data.low,
            };
        } catch (error) {
            console.error("Fetching stock price failed: ", error);
            return null;
        }
    }

    //metoda fetchStockHistory asynchronicznie pobiera historyczne dane akcji z API, przetwarza je na wybrany format i zwraca przetworzone dane lub null w przypadku błędu.
    async fetchStockHistory(symbol, range = '1y') {
    const url = `${this.baseUrl}/${symbol}/chart/${range}?token=${this.apiKey}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const histData = await response.json();
            // console.log(histData)
            return histData.map(item => ({
                date: item.date,
                close: item.close,
                high: item.high,
                low: item.low,
                volume: item.volume,
            }));
        } catch (error) {
            console.error("Fetching stock history failed: ", error);
            return null;
        }
    }

   
    // metoda do pobierania danych o przychodach i zyskach
    async fetchIncomeStatement(symbol, last = 1) {
        const url = `${this.baseUrl}/${symbol}/income/${last}?token=${this.apiKey}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
            return data.income.map(item => ({
                reportDate: item.reportDate,
                totalRevenue: item.totalRevenue,
                netIncome: item.netIncome,
            }));
        } catch (error) {
            console.error("Fetching income statement failed: ", error);
            return null;
        }
    }
}