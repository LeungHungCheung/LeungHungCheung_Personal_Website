(function(){

    // 1. Define SVG dimensions
    const width = 800;
    const height = 600;

    // 2. Define the places you have visited with their approximate coordinates
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
    const projection = d3.geoMercator();

    // 5. Create a path generator
    const path = d3.geoPath().projection(projection);

    // Optional: Create a tooltip div for more detailed hover info
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip");

    // --- NEW: Interaction Code ---

    // NEW: Create a main group <g> element to hold all map/dot elements.
    // This 'g' is what we will apply the zoom transformations to.
    const g = svg.append("g");

    // NEW: State variable to track the active (zoomed-in) prefecture
    let active = null;

    // NEW: Define the zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([1, 10]) // Min zoom 1x, Max zoom 10x
        .on("zoom", (event) => {
            // This function is called on zoom/pan events
            g.attr("transform", event.transform);
        });

    // NEW: Function to handle clicking on a prefecture (state)
    function clicked(event, d) {
        // If we click the *same* prefecture again, reset the view
        if (active && active === this) {
            return reset();
        }

        // Mark the new path as active
        active = this;
        // Stop the click event from bubbling up to the SVG (which would also trigger reset)
        event.stopPropagation(); 

        // Get the bounding box of the clicked prefecture
        const [[x0, y0], [x1, y1]] = path.bounds(d);
        
        // Calculate the target scale and translation
        const k = Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height));
        const x = (x0 + x1) / 2;
        const y = (y0 + y1) / 2;

        // Create the zoom transform
        const transform = d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(k)
            .translate(-x, -y);

        // Apply the zoom transition
        svg.transition()
            .duration(750) // Smooth 750ms transition
            .call(zoom.transform, transform); // Use zoom.transform to apply the new view
    }

    // NEW: Function to reset the zoom (zoom out)
    function reset() {
        active = null; // Clear the active state
        svg.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity); // Reset to the default (identity) transform
    }

    // NEW: Apply the zoom behavior to the main SVG element
    svg.call(zoom);

    // NEW: Add a click listener to the SVG background to reset zoom
    svg.on("click", reset);

    // --- End of NEW Interaction Code ---


    // 6. Load Japan's GeoJSON data
    d3.json("https://raw.githubusercontent.com/dataofjapan/land/master/japan.geojson")
        .then(function(japanGeoData) {
            
            projection.fitSize([width, height], japanGeoData);

            // 7. Draw the map of Japan
            // MODIFIED: Appending to the main 'g' element instead of 'svg'
            g.append("g")
                .attr("class", "japan-map") 
                .selectAll("path")
                .data(japanGeoData.features) 
                .join("path")
                .attr("d", path) 
                .attr("class", "map-path")
                .on("click", clicked); // NEW: Add click listener to paths

            // 8. Draw the dots for visited places
            // MODIFIED: Appending to the main 'g' element instead of 'svg'
            g.append("g")
                .attr("class", "visited-places") 
                .selectAll("circle")
                .data(visitedPlaces) 
                .join("circle")
                .attr("cx", d => projection([d.lon, d.lat])[0]) 
                .attr("cy", d => projection([d.lon, d.lat])[1]) 
                .attr("r", 5) 
                .attr("class", "visited-dot")
                .on("mouseover", function(event, d) {
                    // Make the dot bigger
                    d3.select(this).transition().duration(100).attr("r", 7); // Slightly smaller hover for zoom
                    
                    // Show the tooltip
                    tooltip.transition().duration(200).style("opacity", .9);
                    tooltip.html(`<strong>${d.name}</strong><br>Lat: ${d.lat.toFixed(2)}, Lon: ${d.lon.toFixed(2)}`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function(event, d) {
                    // Restore dot size
                    d3.select(this).transition().duration(100).attr("r", 5); 
                    // Hide the tooltip
                    tooltip.transition().duration(500).style("opacity", 0);
                });

        })
        .catch(function(error) {
            // Handle any errors during data loading
            console.error("Error loading the GeoJSON data:", error);
            d3.select("#vis-ddm").append("p").style("color", "red").text("Failed to load map data. Please check your internet connection or the data source.");
        });
})();