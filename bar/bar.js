 // Ensure the D3.js code runs only after the DOM is fully loaded
        document.addEventListener('DOMContentLoaded', function() {
            // 1. Data Definition
            const creativeWorkTypes = [
                "Abstractexpressionism", "Literature", "Painting", "Sculpture", "Impressionism",
                "Music", "Surrealism", "Theater", "Architecture", "Cinematography",
                "Expressionism", "Pop art", "Cubism", "Digital art", "Photography",
                "Baroque", "Bauhaus", "Conceptual art", "Installation art", "Visual Arts",
                "Art Deco", "Contemporary art", "Figurative art", "Fine art"
            ];

            // Generate dummy data once
            let data = creativeWorkTypes.map(type => ({
                type: type,
                count: Math.floor(Math.random() * 100) + 10 // Random count between 10 and 109
            }));

            // 2. Chart Dimensions and Margins (defined globally or passed to updateChart)
            const container = d3.select("#bar-chart-container");
            const containerWidth = container.node().getBoundingClientRect().width;

            const margin = { top: 60, right: 40, bottom: 80, left: 180 };
            const width = containerWidth - margin.left - margin.right;
            const barHeight = 25; // Height of each individual bar
            const height = data.length * barHeight; // Total height based on number of bars

            // Create SVG element once
            const svg = container.append("svg")
                .attr("width", "100%")
                .attr("height", height + margin.top + margin.bottom)
                .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
                .attr("preserveAspectRatio", "xMinYMin meet")
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // Scales (defined once, domains will be updated)
            const xScale = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.count) * 1.1])
                .range([0, width]);

            const yScale = d3.scaleBand()
                .range([0, height])
                .padding(0.1);

            // Axes (created once, updated with transitions)
            const xAxis = svg.append("g")
                .attr("class", "x axis")
                .attr("transform", `translate(0,${height})`);

            const yAxis = svg.append("g")
                .attr("class", "y axis");

            // Chart Title
            svg.append("text")
                .attr("class", "chart-title")
                .attr("x", width / 2)
                .attr("y", -margin.top / 2)
                .text("Frequency of Creative Work Types");

            // X-axis label
            svg.append("text")
                .attr("class", "x-axis-label")
                .attr("x", width / 2)
                .attr("y", height + margin.bottom - 10)
                .text("Count of Works");

            // Y-axis label
            svg.append("text")
                .attr("class", "y-axis-label")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left + 20)
                .attr("x", -height / 2)
                .text("Creative Work Type");

            // Tooltip setup
            const tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            // Function to update the chart based on sort order
            function updateChart(sortOption) {
                // Sort the data based on the selected option
                if (sortOption === "alphabetical") {
                    data.sort((a, b) => a.type.localeCompare(b.type));
                } else if (sortOption === "frequency-asc") {
                    data.sort((a, b) => a.count - b.count);
                } else if (sortOption === "frequency-desc") {
                    data.sort((a, b) => b.count - a.count);
                }

                // Update the y-scale domain with the new order of types
                yScale.domain(data.map(d => d.type));

                // Select all bars, bind data with a key function for smooth transitions
                const bars = svg.selectAll(".bar")
                    .data(data, d => d.type); // Key function: d.type ensures D3 tracks elements by their type

                // Exit selection: remove bars that are no longer in the data (not applicable here, but good practice)
                bars.exit()
                    .transition().duration(500)
                    .attr("width", 0)
                    .remove();

                // Enter selection: create new bars for new data points
                bars.enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", 0)
                    .attr("y", d => yScale(d.type)) // Initial position before transition
                    .attr("height", yScale.bandwidth())
                    .attr("width", 0) // Start with zero width for animation
                    .on("mouseover", function(event, d) {
                        d3.select(this).style("fill", "#6a5acd");
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        tooltip.html(`<strong>${d.type}</strong><br/>Count: ${d.count}`)
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 28) + "px");
                    })
                    .on("mouseout", function(event, d) {
                        d3.select(this).style("fill", "#4682b4");
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    })
                    .merge(bars) // Merge enter and update selections
                    .transition().duration(750).ease(d3.easeCubicInOut) // Apply transition to merged bars
                    .attr("y", d => yScale(d.type)) // Animate to new y position
                    .attr("width", d => xScale(d.count)); // Animate to new width

                // Update Y-axis with transition
                yAxis.transition().duration(750).ease(d3.easeCubicInOut)
                    .call(d3.axisLeft(yScale));

                // Update X-axis (in case domain changes, though not expected with fixed data)
                xAxis.transition().duration(750).ease(d3.easeCubicInOut)
                    .call(d3.axisBottom(xScale).ticks(5));

            }

            // Initial chart render with default sort (Frequency Descending)
            updateChart(d3.select("#sort-select").property("value"));

            // Event listener for the dropdown menu
            d3.select("#sort-select").on("change", function() {
                const selectedOption = d3.select(this).property("value");
                updateChart(selectedOption);
            });
        });