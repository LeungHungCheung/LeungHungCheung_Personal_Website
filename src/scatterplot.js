// --- Creative Artworks Dataset ---
(function(){
const artworkData = [
    { year: 2010, type: "Painting" },
    { year: 2012, type: "Painting" },
    { year: 2013, type: "Installation" },
    { year: 2014, type: "Installation" },
    { year: 2015, type: "Interactive Coding" },
    { year: 2016, type: "Interactive Coding" },
    { year: 2017, type: "Interactive Coding" },
    { year: 2018, type: "Music" },
    { year: 2019, type: "Music" },
    { year: 2020, type: "Video" },
    { year: 2021, type: "Video" },
    { year: 2022, type: "Painting" }
];

// --- D3 Visualization Setup ---
function drawScatterplot(data) {
    const container = d3.select("#vis-scatterplot");
    const margin = { top: 30, right: 50, bottom: 60, left: 160 };
    const containerWidth = container.node().getBoundingClientRect().width;
    const width = containerWidth - margin.left - margin.right;
    const overallHeight = 350; 
    const height = overallHeight - margin.top - margin.bottom;

    // Clear old SVGs
    container.select("svg").remove();

    const svg = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // --- Scales ---
    const xScale = d3.scaleLinear()
        .domain([2009, 2023])
        .range([0, width]);

    const types = [...new Set(data.map(d => d.type))];
    const yScale = d3.scaleBand()
        .domain(types)
        .range([height, 0])
        .padding(0.4);

    // --- Axes (No grid) ---
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .attr("class", "axis x-axis")
        .call(d3.axisBottom(xScale).ticks(8).tickFormat(d3.format("d")))
        .call(g => g.select(".domain").attr("stroke", "#444"));

    svg.append("g")
        .attr("class", "axis y-axis")
        .call(d3.axisLeft(yScale))
        .call(g => g.select(".domain").attr("stroke", "#444"));

    // --- Axis Labels ---
    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height + 45)
        .attr("fill", "#4169E1")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Year");

    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 40)
        .attr("x", -height / 2)
        .attr("fill", "#FF8C00")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Type of Creative Artwork");

    // --- Tooltip ---
    const tooltip = d3.select("#tooltip");

    const mouseover = function(event, d) {
        tooltip.style("opacity", 1);
        d3.select(this)
            .attr("stroke", "#222")
            .attr("stroke-width", 2);
    };

    const mousemove = function(event, d) {
        tooltip
            .html(`Year: ${d.year}<br>Type: ${d.type}`)
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 28) + "px");
    };

    const mouseleave = function(event, d) {
        tooltip.style("opacity", 0);
        d3.select(this)
            .attr("stroke", "none");
    };

    // --- Points (larger + color-coded) ---
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    svg.selectAll(".dot")
        .data(data)
        .join("circle")
        .attr("class", "dot")
        .attr("r", 8) // ⬆️ increased from 4 → 8
        .attr("cx", d => xScale(d.year))
        .attr("cy", d => yScale(d.type) + yScale.bandwidth() / 2)
        .attr("fill", d => colorScale(d.type))
        .attr("opacity", 0.9)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
}

// --- Initial Draw ---
drawScatterplot(artworkData);
window.addEventListener('resize', () => drawScatterplot(artworkData));
})();