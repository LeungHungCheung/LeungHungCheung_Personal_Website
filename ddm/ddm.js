(function(){
        // 1. Define SVG dimensions
        const width = 800;
        const height = 600;

        // 2. Define visited places
        const visitedPlaces = [
            { name: "Tokyo (City Center)", lat: 35.6895, lon: 139.6917 },
            { name: "Osaka (City Center)", lat: 34.6937, lon: 135.5023 },
            { name: "Tokyo National Museum", lat: 35.7188, lon: 139.7766 },
            { name: "Okinawa-ken (Naha)", lat: 26.2124, lon: 127.6809 },
            { name: "Hokkaido (Sapporo)", lat: 43.0621, lon: 141.3544 }
        ];

        // 3. Create SVG container
        const svg = d3.select("#vis-ddm")
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet");

        // 4. Create projection and path
        const projection = d3.geoMercator();
        const path = d3.geoPath().projection(projection);

        // 5. Create tooltip
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip");

        // 6. Interaction Code
        const g = svg.append("g");
        let active = null;

        const zoom = d3.zoom()
            .scaleExtent([1, 10])
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            });

        function clicked(event, d) {
            if (active && active === this) {
                return reset();
            }
            active = this;
            event.stopPropagation(); 

            const [[x0, y0], [x1, y1]] = path.bounds(d);
            const k = Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height));
            const x = (x0 + x1) / 2;
            const y = (y0 + y1) / 2;
            const transform = d3.zoomIdentity
                .translate(width / 2, height / 2)
                .scale(k)
                .translate(-x, -y);

            svg.transition()
                .duration(750)
                .call(zoom.transform, transform);
        }

        function reset() {
            active = null;
            svg.transition()
                .duration(750)
                .call(zoom.transform, d3.zoomIdentity);
        }

        svg.call(zoom);
        svg.on("click", reset);

        // 7. Load and Draw Data
        d3.json("https://raw.githubusercontent.com/dataofjapan/land/master/japan.geojson")
            .then(function(japanGeoData) {
                
                projection.fitSize([width, height], japanGeoData);

                // Draw the map
                g.append("g")
                    .attr("class", "japan-map") 
                    .selectAll("path")
                    .data(japanGeoData.features) 
                    .join("path")
                    .attr("d", path) 
                    .attr("class", "map-path")
                    .on("click", clicked);

                // Draw the dots
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
                        d3.select(this).transition().duration(100).attr("r", 7);
                        tooltip.transition().duration(200).style("opacity", .9);
                        tooltip.html(`<strong>${d.name}</strong><br>Lat: ${d.lat.toFixed(2)}, Lon: ${d.lon.toFixed(2)}`)
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 28) + "px");
                    })
                    .on("mouseout", function(event, d) {
                        d3.select(this).transition().duration(100).attr("r", 5); 
                        tooltip.transition().duration(500).style("opacity", 0);
                    });
            })
            .catch(function(error) {
                console.error("Error loading the GeoJSON data:", error);
                d3.select("#vis-ddm").append("p").style("color", "red").text("Failed to load map data.");
            });
    })();