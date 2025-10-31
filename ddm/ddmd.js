  (function(){
  // 1. Define SVG dimensions
        const width = 800;
        const height = 600;

        // 2. Define possible locations for simulated visitors
        const possibleLocations = [
            { name: "Tokyo", lat: 35.6895, lon: 139.6917 },
            { name: "Osaka", lat: 34.6937, lon: 135.5023 },
            { name: "Kyoto", lat: 35.0116, lon: 135.7681 },
            { name: "Nagoya", lat: 35.1815, lon: 136.9066 },
            { name: "Sapporo", lat: 43.0618, lon: 141.3545 },
            { name: "Fukuoka", lat: 33.5904, lon: 130.4017 },
            { name: "Kobe", lat: 34.6901, lon: 135.1955 },
            { name: "Yokohama", lat: 35.4437, lon: 139.6380 },
            { name: "Hiroshima", lat: 34.3853, lon: 132.4553 },
            { name: "Sendai", lat: 38.2682, lon: 140.8694 },
            { name: "Naha, Okinawa", lat: 26.2124, lon: 127.6792 },
            { name: "Kanazawa", lat: 36.5611, lon: 136.6566 },
            { name: "Okayama", lat: 34.6618, lon: 133.9344 },
            { name: "Niigata", lat: 37.9161, lon: 139.0364 }
        ];

        // Simulation parameters
        const MAX_VISITORS_PER_CITY = 25; // Used for scaling the dot size
        const SIMULATION_INTERVAL = 700; // Time in ms for each simulation tick

        // NEW: Data structure to hold visitor counts by city
        let visitorCountsByCity = {};

        // 3. Create the SVG container
        const svg = d3.select("#vis-ddmd")
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet");

        // 4. Create a D3 projection
        const projection = d3.geoMercator();

        // 5. Create a path generator
        const path = d3.geoPath().projection(projection);

        // 6. Create a tooltip div
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip");
            
        // NEW: Create a scale for the circle radius
        // Using scaleSqrt because the area of the circle should represent the quantity
        const radiusScale = d3.scaleSqrt()
            .domain([1, MAX_VISITORS_PER_CITY]) // Input: visitor count
            .range([4, 25]); // Output: pixel radius

        // 7. Load Japan's GeoJSON data
        d3.json("https://raw.githubusercontent.com/dataofjapan/land/master/japan.geojson")
            .then(function(japanGeoData) {
                // Adjust projection to fit the GeoJSON data
                projection.fitSize([width, height], japanGeoData);

                // 8. Draw the map of Japan
                svg.append("g")
                    .attr("class", "japan-map")
                    .selectAll("path")
                    .data(japanGeoData.features)
                    .join("path")
                    .attr("d", path)
                    .attr("class", "map-path");

                // Create a group for the visitor dots
                const visitorGroup = svg.append("g")
                    .attr("class", "visitor-dots");

                // 9. Define the function to update the map with visitor dots
                function updateMap() {
                    // Data is now the array of city objects from our visitorCountsByCity map
                    // The key function is now the city name, ensuring one circle per city.
                    visitorGroup.selectAll("circle")
                        .data(Object.values(visitorCountsByCity), d => d.name)
                        .join(
                            // ENTER: For new cities appearing on the map.
                            enter => enter.append("circle")
                                .attr("class", "visitor-dot")
                                .attr("cx", d => projection([d.lon, d.lat])[0])
                                .attr("cy", d => projection([d.lon, d.lat])[1])
                                .attr("r", 0) // Start with radius 0 for entry animation
                                .on("mouseover", function(event, d) {
                                    // Make the circle slightly larger on hover for feedback
                                    d3.select(this).transition().duration(100).attr("r", radiusScale(d.count) + 3);
                                    tooltip.transition().duration(200).style("opacity", 1);
                                    // UPDATED: Show city name and visitor count in tooltip
                                    tooltip.html(`<strong>${d.name}</strong><br>${d.count} visitor${d.count > 1 ? 's' : ''}`)
                                        .style("left", (event.pageX + 10) + "px")
                                        .style("top", (event.pageY - 28) + "px");
                                })
                                .on("mouseout", function(d) {
                                    // Return to its count-based radius
                                    d3.select(this).transition().duration(100).attr("r", radiusScale(d.count));
                                    tooltip.transition().duration(500).style("opacity", 0);
                                })
                                // Animate the entry: grow from 0 to its calculated radius
                                .call(enter => enter.transition().duration(500)
                                    .attr("r", d => radiusScale(d.count))),

                            // UPDATE: For existing cities whose visitor count has changed.
                            update => update
                                // Animate the size change
                                .call(update => update.transition().duration(500)
                                    .attr("r", d => radiusScale(d.count))),

                            // EXIT: For cities whose visitor count dropped to 0.
                            exit => exit
                                // Animate the exit: shrink to 0 and then remove
                                .call(exit => exit.transition().duration(500)
                                    .attr("r", 0)
                                    .remove())
                        );
                }

                // 10. Start the real-time simulation
                setInterval(() => {
                    // Decide randomly to add or remove a visitor to make the map dynamic
                    const addVisitor = Math.random() < 0.75; // 75% chance to add, 25% to remove

                    if (addVisitor) {
                        // ADD a visitor
                        const randomLocation = possibleLocations[Math.floor(Math.random() * possibleLocations.length)];
                        
                        if (visitorCountsByCity[randomLocation.name]) {
                            // City already exists, just increment the count (up to a max)
                            visitorCountsByCity[randomLocation.name].count = Math.min(MAX_VISITORS_PER_CITY, visitorCountsByCity[randomLocation.name].count + 1);
                        } else {
                            // New city, add it to our map with a count of 1
                            visitorCountsByCity[randomLocation.name] = { ...randomLocation, count: 1 };
                        }
                    } else {
                        // REMOVE a visitor
                        const citiesWithVisitors = Object.keys(visitorCountsByCity);
                        if (citiesWithVisitors.length > 0) {
                            // Pick a random city that currently has visitors
                            const randomCityName = citiesWithVisitors[Math.floor(Math.random() * citiesWithVisitors.length)];
                            const city = visitorCountsByCity[randomCityName];
                            
                            // Decrement the count
                            city.count--;

                            // If count is 0, delete the city from the object.
                            // D3's exit selection will then handle removing the circle.
                            if (city.count <= 0) {
                                delete visitorCountsByCity[randomCityName];
                            }
                        }
                    }

                    // Call the update function to re-render the dots.
                    updateMap();

                }, SIMULATION_INTERVAL);
            })
            .catch(function(error) {
                console.error("Error loading the GeoJSON data:", error);
                d3.select("#vis-ddm").append("p").style("color", "red").text("Failed to load map data. Please check your internet connection or the data source.");
            });
            })();