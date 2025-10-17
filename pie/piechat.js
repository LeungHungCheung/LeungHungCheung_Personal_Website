// Data
(function(){
const salesData = [
    { temp: 12.0, sales: 190 },
    { temp: 14.5, sales: 220 },
    { temp: 15.5, sales: 320 },
    { temp: 16.5, sales: 320 },
    { temp: 17.5, sales: 410 },
    { temp: 18.2, sales: 410 },
    { temp: 18.8, sales: 400 },
    { temp: 19.5, sales: 410 },
    { temp: 22.5, sales: 520 },
    { temp: 23.0, sales: 450 },
    { temp: 23.5, sales: 540 },
    { temp: 25.5, sales: 610 }
];

// --- D3 Visualization Setup ---
function drawPieChart(data) {
    const container = d3.select("#vis-piechart");
    container.select("svg").remove(); // clear previous chart

    const width = container.node().getBoundingClientRect().width;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 30;

    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);

    // Title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("fill", "#333")
        .style("font-weight", "600")
        .text("Artwork Sales by Temperature");

    // Subtitle
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 45)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "#666")
        .text("Each slice represents sales at a specific temperature (°C)");

    const g = svg.append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2 + 20})`);

    // Color scale
    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.temp))
        .range(d3.schemeTableau10);

    // Pie generator
    const pie = d3.pie()
        .value(d => d.sales)
        .sort(null);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    // Tooltip
    const tooltip = d3.select("#tooltip");

    const mouseover = function(event, d) {
        tooltip.style("opacity", 1);
        d3.select(this)
            .transition()
            .duration(200)
            .attr("transform", "scale(1.05)");
    };

    const mousemove = function(event, d) {
        tooltip
            .html(`Temp: ${d.data.temp}°C<br>Sales: $${d.data.sales}`)
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 28) + "px");
    };

    const mouseleave = function() {
        tooltip.style("opacity", 0);
        d3.select(this)
            .transition()
            .duration(200)
            .attr("transform", "scale(1)");
    };

    // Draw pie slices
    g.selectAll("path")
        .data(pie(data))
        .join("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.temp))
        .attr("stroke", "white")
        .attr("stroke-width", "2px")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

    // Labels inside pie
    const labelArc = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius * 0.6);

    g.selectAll("text.slice-label")
        .data(pie(data))
        .join("text")
        .attr("class", "slice-label")
        .attr("transform", d => `translate(${labelArc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .style("font-size", "11px")
        .style("fill", "#fff")
        .text(d => `${d.data.temp}°`);

    // Center label: total sales
    const totalSales = d3.sum(data, d => d.sales);
    g.append("text")
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .attr("y", 45)
        .attr("x", width / 2-1000)
        .style("fill", "#333")
        .style("font-weight", "bold")
        .text(`Total: $${totalSales}`);

    // Legend
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 140}, ${80})`);

    const legendItems = legend.selectAll(".legend-item")
        .data(data)
        .join("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * 18})`);

    legendItems.append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", d => color(d.temp));

    legendItems.append("text")
        .text(d => `${d.temp}°C`)
        .attr("x", 18)
        .attr("y", 10)
        .style("font-size", "12px")
        .style("fill", "#333");
}

// Initial draw
drawPieChart(salesData);

// Redraw on window resize
window.addEventListener('resize', () => {
    drawPieChart(salesData);
});
})();
