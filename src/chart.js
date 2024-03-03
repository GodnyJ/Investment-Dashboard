import * as d3 from 'd3';

export function createStockPriceChart(data) {
    const svg = d3.select('svg');
    const defs = svg.append('defs')
    const margin = { top: 20, right: 20, bottom: 60, left: 50 };
    const width = svg.attr('width') - margin.left - margin.right;
    const height = svg.attr('height') - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand().rangeRound([0, width]).padding(0.1).paddingInner(0.15),
          y = d3.scaleLinear().rangeRound([height, 0]);

    x.domain(data.map(d => d.date));
    y.domain([0, d3.max(data, d => d.value) * 1.6]);
    
    const xAxis = d3.axisBottom(x)
        .tickFormat(d3.timeFormat("%B"));
    
    // Pobieranie co 25-tej etykiety
    const tickValues = x.domain().filter((d, i) => i % 25 === 0);

    g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis.tickValues(tickValues))
        .attr('class', 'grid-line')
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)")

    g.append('g')
        .call(d3.axisLeft(y)
            .ticks(8) // Ustawia sugerowaną liczbę etykiet na osi Y
            .tickSize(-width)
        )
        .attr('class', 'grid-line')
        .selectAll(".tick line")
        .append('text')
        .attr('fill', '#000')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end');

    g.selectAll('.bar')
        .data(data)
        .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.date))
            .attr('y', d => y(d.value))
            .attr('width', x.bandwidth())
            .attr('height', d => height - y(d.value))
            .attr('fill', 'url(#słupekGradient)');
}

export function createVolumeChart(data) {
    const svgSelector = "#volumeChart";
    const svg = d3.select(svgSelector);
    const margin = { top: 20, right: 10, bottom: 30, left: 30 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Skalowanie dla osi X
    const x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1)
        // .paddingInner(0.2) // zmiana  odstępu między słupkami
        .paddingOuter(0) // zmiana odległości słupków od osi
        .domain(data.map(d => d.date));

    // Skalowanie dla osi Y
    const y = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, d3.max(data, d => +d.value)*1.5]);

    
    
    // Konfiguracja xAxis z formatowaniem daty
    const xAxis = d3.axisBottom(x)
    .tickFormat(d3.timeFormat("%B")); // Formatuje datę do pełnej nazwy miesiąca

    // Pobieranie co 20-tej etykiety
    const tickValues = x.domain().filter((d, i) => i % 20 === 0);

    // oś x
    g.append('g')
    .attr('transform', `translate(0,${height})`)
        .call(xAxis.tickValues(tickValues)) // Używa xAxis z .tickValues()
        .attr('class', 'grid-line') //  klasa dla stylizacji linii siatki -ukrywa oś x pozostawiając etykiety 
        .selectAll("text line")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
    
    // Dodawanie osi Y
    g.append('g')
        .call(d3.axisLeft(y)
            .ticks(5) // Ustawia sugerowaną liczbę etykiet na osi Y
            .tickSize(-width) // Rozciąga linie siatki na całą szerokość wykresu
            // .tickFormat("") // Usuwa tekst etykiet
        )
        .attr('class', 'grid-line') //  klasa dla stylizacji linii siatki
        // .attr("transform", "translate(18,0)") //przesuniecie słupków w lewo w stronę osi y ale wraz z osią x - ale jak uktyję oś x to jest ok :) 
        .selectAll(".tick line");
    
    
    // Rysowanie słupków
    g.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.date))
        .attr('y', d => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.value))
        .attr('fill', d => d.isIncrease ? '#29C29F' : '#E85B71');
}

export function createRSIChart(data) {
    const svgSelector = "#RSIChart";
    const svg = d3.select(svgSelector);
    const margin = { top: 20, right: 10, bottom: 30, left: 30 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Skalowanie dla osi X
    const x = d3.scaleTime() 
        .rangeRound([0, width])
        .domain(d3.extent(data, d => new Date(d.date))); 
    
    // Skalowanie dla osi Y
    const y = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, 100]); 
    
    // Linia RSI
    const line = d3.line()
        .x(d => x(new Date(d.date))) // Konwersja stringa daty na obiekt Date
        .y(d => y(d.RSI)); 

    // Dodawanie linii RSI do wykresu
    g.append("path")
        .datum(data) 
        .attr("fill", "none")
        .attr("stroke", "#35AB8F")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    // Dodawanie osi X do wykresu
    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x)
            .ticks(14) // Ustawia sugerowaną liczbę etykiet na osi Y
        )
        .attr('class', 'grid-line');

    // Dodawanie osi Y do wykresu
    g.append("g")
        .call(d3.axisLeft(y)
            .ticks(5)
            .tickSize(-width)
        )
        .attr('class', 'grid-line');
}