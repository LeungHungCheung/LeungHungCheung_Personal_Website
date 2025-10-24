// Course data with relationships
        const courses = [
            { id: "intro-media", name: "Introduction to Media Computing", category: "technical", importance: 8, color: "#e74c3c" },
            { id: "new-media-art", name: "New Media Art", category: "art", importance: 7, color: "#3498db" },
            { id: "creative-coding", name: "Creative Coding", category: "technical", importance: 9, color: "#e74c3c" },
            { id: "creative-studio", name: "Creative Media Studio I", category: "studio", importance: 8, color: "#f39c12" },
            { id: "university-english", name: "University English", category: "theory", importance: 5, color: "#2ecc71" },
            { id: "critical-theory", name: "Critical Theory and Socially Engaged Practices", category: "theory", importance: 7, color: "#2ecc71" },
            { id: "physical-computing", name: "Physical Computing and Tangible Media", category: "technical", importance: 8, color: "#e74c3c" },
            { id: "intro-photography", name: "Introduction to Photography", category: "art", importance: 6, color: "#3498db" },
            { id: "special-topics", name: "Special Topics in Creative Media (VI)", category: "studio", importance: 7, color: "#f39c12" },
            { id: "art-game-studio", name: "Art Game Studio", category: "studio", importance: 8, color: "#f39c12" }
        ];

        // Artwork data
        const artworks = [
            { id: "coding-torus", name: "Coding Torus", category: "artwork", importance: 7, color: "#8e44ad" },
            { id: "duck-installation", name: "Duck Installation", category: "artwork", importance: 6, color: "#8e44ad" },
            { id: "personal-website", name: "Personal Website", category: "artwork", importance: 5, color: "#8e44ad" },
            { id: "exhibition-planning", name: "Exhibition Planning", category: "artwork", importance: 6, color: "#8e44ad" },
            { id: "decisive-moment-photo", name: "Decisive Moment of Photo", category: "artwork", importance: 5, color: "#8e44ad" }
        ];

        // Define relationships between courses
        const courseLinks = [
            { source: "creative-coding", target: "intro-media", strength: 0.8 },
            { source: "creative-coding", target: "physical-computing", strength: 0.7 },
            { source: "creative-coding", target: "art-game-studio", strength: 0.9 },
            { source: "intro-media", target: "new-media-art", strength: 0.6 },
            { source: "new-media-art", target: "critical-theory", strength: 0.7 },
            { source: "creative-studio", target: "special-topics", strength: 0.8 },
            { source: "critical-theory", target: "new-media-art", strength: 0.6, isCycle: true },
            { source: "physical-computing", target: "creative-coding", strength: 0.7, isCycle: true },
            { source: "special-topics", target: "art-game-studio", strength: 0.7 },
            { source: "art-game-studio", target: "creative-coding", strength: 0.8 },
            { source: "intro-photography", target: "new-media-art", strength: 0.5 },
            { source: "university-english", target: "university-english", strength: 0.3, isCycle: true }
        ];

        // Define relationships between courses and artworks
        const artworkLinks = [
            { source: "coding-torus", target: "creative-coding", strength: 0.9 },
            { source: "duck-installation", target: "creative-studio", strength: 0.8 },
            { source: "personal-website", target: "special-topics", strength: 0.7 },
            { source: "exhibition-planning", target: "new-media-art", strength: 0.8 },
            { source: "decisive-moment-photo", target: "intro-photography", strength: 0.9 },
            
            // New connections as requested
            { source: "coding-torus", target: "intro-media", strength: 0.7 },
            { source: "personal-website", target: "creative-coding", strength: 0.8 },
            { source: "personal-website", target: "intro-media", strength: 0.6 },
            
            // Link all artwork to New Media Art
            { source: "coding-torus", target: "new-media-art", strength: 0.6 },
            { source: "duck-installation", target: "new-media-art", strength: 0.5 },
            { source: "personal-website", target: "new-media-art", strength: 0.6 },
            { source: "decisive-moment-photo", target: "new-media-art", strength: 0.5 }
        ];

        // Create cycles between courses and artwork
        const cycleLinks = [
            // Cycle: Creative Coding -> Coding Torus -> Intro to Media Computing -> Creative Coding
            { source: "creative-coding", target: "coding-torus", strength: 0.8, isCycle: true },
            { source: "coding-torus", target: "intro-media", strength: 0.7, isCycle: true },
            { source: "intro-media", target: "creative-coding", strength: 0.8, isCycle: true },
            
            // Cycle: New Media Art -> Exhibition Planning -> Personal Website -> Creative Coding -> New Media Art
            { source: "new-media-art", target: "exhibition-planning", strength: 0.7, isCycle: true },
            { source: "exhibition-planning", target: "personal-website", strength: 0.6, isCycle: true },
            { source: "personal-website", target: "creative-coding", strength: 0.7, isCycle: true },
            { source: "creative-coding", target: "new-media-art", strength: 0.7, isCycle: true },
            
            // Cycle: Creative Studio I -> Duck Installation -> New Media Art -> Special Topics -> Creative Studio I
            { source: "creative-studio", target: "duck-installation", strength: 0.8, isCycle: true },
            { source: "duck-installation", target: "new-media-art", strength: 0.6, isCycle: true },
            { source: "new-media-art", target: "special-topics", strength: 0.7, isCycle: true },
            { source: "special-topics", target: "creative-studio", strength: 0.8, isCycle: true }
        ];

        // Combine all links
        const allLinks = [...courseLinks, ...artworkLinks, ...cycleLinks];

        // Create the adjacency matrix with color-based pattern
        function createColorPatternedMatrix() {
            // Group nodes by color/category
            const technicalNodes = courses.filter(c => c.category === "technical");
            const artNodes = courses.filter(c => c.category === "art");
            const theoryNodes = courses.filter(c => c.category === "theory");
            const studioNodes = courses.filter(c => c.category === "studio");
            const artworkNodes = artworks;
            
            // Sort within each group by importance (descending)
            technicalNodes.sort((a, b) => b.importance - a.importance);
            artNodes.sort((a, b) => b.importance - a.importance);
            theoryNodes.sort((a, b) => b.importance - a.importance);
            studioNodes.sort((a, b) => b.importance - a.importance);
            artworkNodes.sort((a, b) => b.importance - a.importance);
            
            // Combine in color order: Technical -> Art -> Theory -> Studio -> Artwork
            const sortedNodes = [
                ...technicalNodes,
                ...artNodes,
                ...theoryNodes,
                ...studioNodes,
                ...artworkNodes
            ];
            
            // Define group boundaries for visual separation
            const groupBoundaries = [
                { name: "Technical", start: 0, end: technicalNodes.length - 1, color: "#e74c3c" },
                { name: "Art", start: technicalNodes.length, end: technicalNodes.length + artNodes.length - 1, color: "#3498db" },
                { name: "Theory", start: technicalNodes.length + artNodes.length, 
                  end: technicalNodes.length + artNodes.length + theoryNodes.length - 1, color: "#2ecc71" },
                { name: "Studio", start: technicalNodes.length + artNodes.length + theoryNodes.length, 
                  end: technicalNodes.length + artNodes.length + theoryNodes.length + studioNodes.length - 1, color: "#f39c12" },
                { name: "Artwork", start: technicalNodes.length + artNodes.length + theoryNodes.length + studioNodes.length, 
                  end: sortedNodes.length - 1, color: "#8e44ad" }
            ];

            // Set up dimensions for matrix with more space at the top
            const margin = { top: 140, right: 20, bottom: 100, left: 150 };
            const width = 900 - margin.left - margin.right;
            const height = 700 - margin.top - margin.bottom;
            const cellSize = 25;
            
            const svg = d3.select("#vis-matrix")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // Create tooltip for matrix
            const tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            // Create a map for quick lookup of connections
            const connectionMap = new Map();
            allLinks.forEach(link => {
                const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                const targetId = typeof link.target === 'object' ? link.target.id : link.target;
                const key = `${sourceId}-${targetId}`;
                connectionMap.set(key, link);
            });

            // Add color blocks behind each group for visual emphasis
            groupBoundaries.forEach(group => {
                const groupSize = group.end - group.start + 1;
                
                // Background color block
                svg.append("rect")
                    .attr("class", "color-block")
                    .attr("x", group.start * cellSize)
                    .attr("y", group.start * cellSize)
                    .attr("width", groupSize * cellSize)
                    .attr("height", groupSize * cellSize)
                    .attr("fill", group.color)
                    .attr("opacity", 0.1);
            });

            // Add group dividers (no labels)
            groupBoundaries.forEach(group => {
                // Vertical dividers
                svg.append("line")
                    .attr("class", "group-divider")
                    .attr("x1", group.start * cellSize - 0.5)
                    .attr("y1", -5)
                    .attr("x2", group.start * cellSize - 0.5)
                    .attr("y2", sortedNodes.length * cellSize + 5)
                    .style("opacity", 0.7);
                
                // Horizontal dividers
                svg.append("line")
                    .attr("class", "group-divider")
                    .attr("x1", -5)
                    .attr("y1", group.start * cellSize - 0.5)
                    .attr("x2", sortedNodes.length * cellSize + 5)
                    .attr("y2", group.start * cellSize - 0.5)
                    .style("opacity", 0.7);
            });

            // Create matrix cells with color-based pattern
            const cell = svg.selectAll(".matrix-cell")
                .data(d3.cross(sortedNodes, sortedNodes))
                .enter()
                .append("rect")
                .attr("class", "matrix-cell")
                .attr("x", d => sortedNodes.indexOf(d[1]) * cellSize)
                .attr("y", d => sortedNodes.indexOf(d[0]) * cellSize)
                .attr("width", cellSize)
                .attr("height", cellSize)
                .attr("fill", d => {
                    const sourceId = d[0].id;
                    const targetId = d[1].id;
                    const key = `${sourceId}-${targetId}`;
                    const link = connectionMap.get(key);
                    
                    if (link) {
                        if (link.isCycle) {
                            return "#e74c3c"; // Red for cycles
                        } else {
                            return "#1abc9c"; // Teal for connections
                        }
                    } else {
                        // Use node color for diagonal, light gray for others
                        if (d[0].id === d[1].id) {
                            return d[0].color;
                        } else {
                            return "#f8f9fa"; // Very light gray for no connection
                        }
                    }
                })
                .attr("rx", 2) // Slightly rounded corners
                .attr("ry", 2)
                .on("mouseover", function(event, d) {
                    const sourceId = d[0].id;
                    const targetId = d[1].id;
                    const key = `${sourceId}-${targetId}`;
                    const link = connectionMap.get(key);
                    
                    if (link) {
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                        
                        let connectionType = "Connection";
                        if (d[0].category === "artwork" || d[1].category === "artwork") {
                            connectionType = "Artwork Connection";
                        }
                        if (link.isCycle) {
                            connectionType = "Cycle Connection";
                        }
                        
                        tooltip.html(`<strong>${connectionType}</strong><br/>${d[0].name} → ${d[1].name}<br/>Strength: ${link.strength}`)
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 28) + "px");
                    }
                    
                    // Highlight row and column
                    const rowIndex = sortedNodes.indexOf(d[0]);
                    const colIndex = sortedNodes.indexOf(d[1]);
                    
                    d3.selectAll(".matrix-cell")
                        .style("opacity", 0.3);
                    
                    d3.selectAll(".matrix-cell")
                        .filter(cellData => 
                            sortedNodes.indexOf(cellData[0]) === rowIndex || 
                            sortedNodes.indexOf(cellData[1]) === colIndex
                        )
                        .style("opacity", 1);
                    
                    d3.select(this).style("opacity", 1);
                })
                .on("mouseout", function() {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                    
                    // Reset opacity
                    d3.selectAll(".matrix-cell")
                        .style("opacity", 1);
                });

            // Add row labels (on the left) with proper spacing
            const rowLabels = svg.selectAll(".matrix-label")
                .data(sortedNodes)
                .enter()
                .append("text")
                .attr("class", "matrix-label")
                .attr("x", -8)
                .attr("y", (d, i) => i * cellSize + cellSize / 2)
                .text(d => {
                    // Use abbreviations for long names
                    const abbreviations = {
                        "Introduction to Media Computing": "Intro Media Comp",
                        "Critical Theory and Socially Engaged Practices": "Critical Theory",
                        "Physical Computing and Tangible Media": "Physical Computing",
                        "Introduction to Photography": "Intro Photography",
                        "Special Topics in Creative Media (VI)": "Special Topics",
                        "Creative Media Studio I": "Creative Studio I",
                        "Decisive Moment of Photo": "Decisive Moment"
                    };
                    return abbreviations[d.name] || d.name;
                })
                .style("font-size", "9px")
                .style("fill", d => d.color);

            // Add column labels (on the top) with higher positioning
            const colLabels = svg.selectAll(".matrix-label-top")
                .data(sortedNodes)
                .enter()
                .append("text")
                .attr("class", "matrix-label-top")
                .attr("x", (d, i) => i * cellSize + cellSize / 2)
                .attr("y", -45) // Increased from -25 to -45 for higher positioning
                .text(d => {
                    // Use abbreviations for long names
                    const abbreviations = {
                        "Introduction to Media Computing": "Intro Media",
                        "Critical Theory and Socially Engaged Practices": "Critical Theory",
                        "Physical Computing and Tangible Media": "Physical Comp",
                        "Introduction to Photography": "Photography",
                        "Special Topics in Creative Media (VI)": "Special Topics",
                        "Creative Media Studio I": "Studio I",
                        "Decisive Moment of Photo": "Photo Moment"
                    };
                    return abbreviations[d.name] || d.name;
                })
                .style("font-size", "9px")
                .style("fill", d => d.color)
                .attr("transform", (d, i) => `rotate(-45, ${i * cellSize + cellSize / 2}, -45)`); // Updated rotation point

            // Add title
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", -90)
                .attr("text-anchor", "middle")
                .style("font-size", "18px")
                .style("font-weight", "bold")
                .text("Patterned Course & Artwork Matrix");

            // Add explanation
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", -70)
                .attr("text-anchor", "middle")
                .style("font-size", "12px")
                .style("fill", "#7f8c8d")
                .text("Nodes grouped by color to reveal patterns. Hover over cells for details.");

            // Add controls for toggling density view
            let densityView = false;
            d3.select("#toggle-density").on("click", function() {
                densityView = !densityView;
                
                if (densityView) {
                    // Show density view with varying opacity based on connection strength
                    cell.attr("fill", d => {
                        const sourceId = d[0].id;
                        const targetId = d[1].id;
                        const key = `${sourceId}-${targetId}`;
                        const link = connectionMap.get(key);
                        
                        if (link) {
                            if (link.isCycle) {
                                return "#e74c3c";
                            } else {
                                // Vary opacity based on connection strength
                                const opacity = 0.3 + (link.strength * 0.7);
                                return d3.color("#1abc9c").copy({opacity: opacity});
                            }
                        } else {
                            if (d[0].id === d[1].id) {
                                return d[0].color;
                            } else {
                                return "#f8f9fa";
                            }
                        }
                    });
                } else {
                    // Show standard view
                    cell.attr("fill", d => {
                        const sourceId = d[0].id;
                        const targetId = d[1].id;
                        const key = `${sourceId}-${targetId}`;
                        const link = connectionMap.get(key);
                        
                        if (link) {
                            if (link.isCycle) {
                                return "#e74c3c";
                            } else {
                                return "#1abc9c";
                            }
                        } else {
                            if (d[0].id === d[1].id) {
                                return d[0].color;
                            } else {
                                return "#f8f9fa";
                            }
                        }
                    });
                }
            });

            // Add controls for toggling labels
            let labelsVisible = true;
            d3.select("#toggle-labels").on("click", function() {
                labelsVisible = !labelsVisible;
                rowLabels.style("display", labelsVisible ? "block" : "none");
                colLabels.style("display", labelsVisible ? "block" : "none");
            });
        }

        // Initialize the matrix
        createColorPatternedMatrix();