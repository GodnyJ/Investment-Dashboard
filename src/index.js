import '../src/style.css';
import StockDataFetcher from './StockDataFetcher';
import { createStockPriceChart, createVolumeChart, createRSIChart } from './chart';

function transformDataForChart(rawData) {
  return rawData.map(d => ({
    date: new Date(d.date), // Konwersja stringa daty na obiekt Date
    value: +d.close // Upewnienie się, że 'close' jest typu liczbowego
  }));
}

//funkcja obliczająca RSI do wykresu
function calculateRSISeriesWithDates(closePrices, dates, period = 14) {
  let gains = []; // Tablica na zyski (wartości dodatnie zmian cen)
  let losses = []; // Tablica na straty (wartości ujemne zmian cen)
  let RSIValuesWithDates = []; // Tablica na przechowywanie obliczonych wartości RSI dla każdego punktu wraz z datami

  // Obliczanie dziennych zysków i strat
  for (let i = 1; i < closePrices.length; i++) {
    let change = closePrices[i] - closePrices[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? -change : 0);
  }

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  
  for (let i = period; i < closePrices.length; i++) {
    if (i > period) {
      avgGain = ((avgGain * (period - 1)) + gains[i - 1]) / period;
      avgLoss = ((avgLoss * (period - 1)) + losses[i - 1]) / period;
    }

    if (avgLoss === 0) {
      RSIValuesWithDates.push({ date: dates[i], RSI: 100 }); 
    } else {
      let RS = avgGain / avgLoss;
      let RSI = 100 - (100 / (1 + RS));
      RSIValuesWithDates.push({ date: dates[i], RSI: RSI });
    }
  }

  return RSIValuesWithDates;
}

document.addEventListener('DOMContentLoaded', function() {
  const apiKey = 'your_api_key'; // Miejsce na Twój klucz API
  const stockFetcher = new StockDataFetcher(apiKey);

  document.getElementById('searchForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const symbol = document.getElementById('searchInput').value;
    const stockData = await stockFetcher.fetchStockPrice(symbol);
    const stockHistory = await stockFetcher.fetchStockHistory(symbol);
    // console.log(stockHistory)

    if (stockData) {
      document.querySelectorAll('.stock-name').forEach((element) => {
    element.textContent = stockData.symbol;
  });
      document.querySelector('.stock-price').textContent = stockData.price;
      document.querySelector('.stock-change').textContent = stockData.change;
      document.querySelector('.stock-change-percent').textContent = `${stockData.changePercent.toFixed(2)}%`;
      document.querySelector('.stock-previous-close').textContent = `${stockData.previousClose} USD`;
      document.querySelector('.stock-high').textContent = stockData.high;
      document.querySelector('.stock-low').textContent = stockData.low;

    } else {
      alert('Nie udało się pobrać danych akcji.');
    }


    if (stockHistory) {
      const formattedData = transformDataForChart(stockHistory); // Przetworzenie danych do wykresu
      createStockPriceChart(formattedData); // Wygenerowanie wykresu ceny akcji
      
      //wykres wolumenu
      const filteredData = formattedData.filter((d, i) => i % 2 === 0); //chcę aby co drugi słupek był wyświetlany bo wszystkie zajmują mi zbyt dużo miejsca
      //Obliczenie wzrostu/spadku dla każdego rekordu potrzebne do kolorowania słupków wykresu na czerwono i zielono
      //dla każdego elementu w tablicy danych tworzony jest nowy obiekt, który zawiera wszystkie oryginalne właściwości elementu plus nową właściwość isIncrease. Wartość isIncrease jest true, jeśli wartość bieżącego elementu jest większa lub równa wartości poprzedniego elementu, co oznacza wzrost. Dla pierwszego elementu w tablicy, nie ma poprzedniego elementu do porównania, więc domyślnie ustawiamy isIncrease na false.
      const dataWithChange = filteredData.map((d, i, arr) => ({
        ...d,
        isIncrease: i === 0 ? false : d.value > arr[i - 1].value
      }));  
      createVolumeChart(dataWithChange);

      //obliczenia do wykresu RSI
      const closePrices = stockHistory.map(d => d.close); // Pobranie tablicy z zamknięciami cen
      const dates = stockHistory.map(d => d.date)// Obliczenie serii wartości RSI
      const RSIValues = calculateRSISeriesWithDates(closePrices, dates, 14);
      console.log(RSIValues);
      const last14RSI = RSIValues.slice(-14);
      console.log(last14RSI);

      createRSIChart(last14RSI); // Wygenerowanie wykresu RSI

    } else {
        alert('Nie udało się pobrać danych historycznych akcji.');
    }
  });
});