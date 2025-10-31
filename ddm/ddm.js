    (function(){
// 1. Define SVG dimensions
        const width = 800;
        const height = 600;

        // 2. Define the places you have visited with their approximate coordinates
        // Note: Coordinates are approximate. For precise locations, you might need to use a geocoding service.
        const visitedPlaces = [
            { name: "Tokyo (City Center)", lat: 35.6895, lon: 139.6917 },
            { name: "Osaka (City Center)", lat: 34.6937, lon: 135.5023 },
            { name: "Tokyo National Museum", lat: 35.7188, lon: 139.7766 },
            { name: "Okinawa-ken (Naha)", lat: 26.2124, lon: 127.6809 },
                { name: "Hokkaido (Sapporo)", lat: 43.0621, lon: 141.3544 }
        ];

        // 3. Create the SVG container
        const svg = d3.select("#vis-ddm")
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`) // Makes the SVG responsive
            .attr("preserveAspectRatio", "xMidYMid meet"); // Maintains aspect ratio

        // 4. Create a D3 projection
        // We'll use d3.geoMercator for a common map projection.
        // The scale and translate will be adjusted automatically using fitSize.
        const projection = d3.geoMercator();

        // 5. Create a path generator
        // This function will convert GeoJSON geometries into SVG path strings.
        const path = d3.geoPath().projection(projection);

        // Optional: Create a tooltip div for more detailed hover info (instead of just <title>)
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip");

        // 6. Load Japan's GeoJSON data
        // We're using a GeoJSON file that contains prefecture boundaries for Japan.
        d3.json("https://raw.githubusercontent.com/dataofjapan/land/master/japan.geojson")
            .then(function(japanGeoData) {
                // Once the data is loaded:

                // Adjust the projection to fit the Japan GeoJSON data within the SVG
                // This automatically calculates scale and translation for centering.
                projection.fitSize([width, height], japanGeoData);

                // 7. Draw the map of Japan
                svg.append("g")
                    .attr("class", "japan-map") // Group for map paths
                    .selectAll("path")
                    .data(japanGeoData.features) // Bind GeoJSON features (prefectures)
                    .join("path")
                    .attr("d", path) // Use the path generator to draw each prefecture
                    .attr("class", "map-path"); // Apply CSS class for styling

                // 8. Draw the dots for visited places
                svg.append("g")
                    .attr("class", "visited-places") // Group for visited dots
                    .selectAll("circle")
                    .data(visitedPlaces) // Bind our visited places data
                    .join("circle")
                    .attr("cx", d => projection([d.lon, d.lat])[0]) // Convert longitude to X coordinate
                    .attr("cy", d => projection([d.lon, d.lat])[1]) // Convert latitude to Y coordinate
                    .attr("r", 5) // Radius of the dot
                    .attr("class", "visited-dot") // Apply CSS class for styling
                    .on("mouseover", function(event, d) {
                        d3.select(this).transition().duration(100).attr("r", 20); // Enlarge dot on hover
                        tooltip.transition().duration(200).style("opacity", .9);
                        tooltip.html(`<strong>${d.name}</strong><br>Lat: ${d.lat.toFixed(2)}, Lon: ${d.lon.toFixed(2)}`)
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 28) + "px");
                    })
                    .on("mouseout", function(event, d) {
                        d3.select(this).transition().duration(100).attr("r", 5); // Restore dot size
                        tooltip.transition().duration(500).style("opacity", 0);
                    });

            })
            .catch(function(error) {
                // Handle any errors during data loading
                console.error("Error loading the GeoJSON data:", error);
                d3.select("#vis-ddm").append("p").style("color", "red").text("Failed to load map data. Please check your internet connection or the data source.");
            });
})();
