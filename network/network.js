 // Course data with relationships
        const courses = [
            { id: "intro-media", name: "Introduction to Media Computing", category: "technical", importance: 8 },
            { id: "new-media-art", name: "New Media Art", category: "art", importance: 7 },
            { id: "creative-coding", name: "Creative Coding", category: "technical", importance: 9 },
            { id: "creative-studio", name: "Creative Media Studio I", category: "studio", importance: 8 },
            { id: "university-english", name: "University English", category: "theory", importance: 5 },
            { id: "critical-theory", name: "Critical Theory and Socially Engaged Practices", category: "theory", importance: 7 },
            { id: "physical-computing", name: "Physical Computing and Tangible Media", category: "technical", importance: 8 },
            { id: "intro-photography", name: "Introduction to Photography", category: "art", importance: 6 },
            { id: "special-topics", name: "Special Topics in Creative Media (VI)", category: "studio", importance: 7 },
            { id: "art-game-studio", name: "Art Game Studio", category: "studio", importance: 8 }
        ];

        // Artwork data
        const artworks = [
            { id: "coding-torus", name: "Coding Torus", category: "artwork", importance: 7 },
            { id: "duck-installation", name: "Duck Installation", category: "artwork", importance: 6 },
            { id: "personal-website", name: "Personal Website", category: "artwork", importance: 5 },
            { id: "exhibition-planning", name: "Exhibition Planning", category: "artwork", importance: 6 },
            { id: "decisive-moment-photo", name: "Decisive Moment of Photo", category: "artwork", importance: 5 }
        ];

        // Combine courses and artworks
        const allNodes = [...courses, ...artworks];

        // Define relationships between courses
        const courseLinks = [
            { source: "creative-coding", target: "intro-media", strength: 0.8 },
            { source: "creative-coding", target: "physical-computing", strength: 0.7 },
            { source: "creative-coding", target: "art-game-studio", strength: 0.9 },
            { source: "intro-media", target: "new-media-art", strength: 0.6 },
            { source: "new-media-art", target: "critical-theory", strength: 0.7 },
            { source: "creative-studio", target: "special-topics", strength: 0.8 },
            { source: "critical-theory", target: "new-media-art", strength: 0.6, isCycle: true }, // Cycle
            { source: "physical-computing", target: "creative-coding", strength: 0.7, isCycle: true }, // Cycle
            { source: "special-topics", target: "art-game-studio", strength: 0.7 },
            { source: "art-game-studio", target: "creative-coding", strength: 0.8 },
            { source: "intro-photography", target: "new-media-art", strength: 0.5 },
            { source: "university-english", target: "university-english", strength: 0.3, isCycle: true } // Loop
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

        // Set up dimensions and SVG
        const width = 900;
        const height = 600;
        
        const svg = d3.select("#vis-network")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Create tooltip
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Color scale for categories
        const colorScale = d3.scaleOrdinal()
            .domain(["technical", "art", "theory", "studio", "artwork"])
            .range(["#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#8e44ad"]);

        // Set up force simulation
        const simulation = d3.forceSimulation(allNodes)
            .force("link", d3.forceLink(allLinks).id(d => d.id).distance(100).strength(d => d.strength))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide().radius(d => d.importance * 3 + 10));

        // Create links
        const link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(allLinks)
            .enter()
            .append("line")
            .attr("class", d => {
                let className = "link";
                
                // Check if this link connects to an artwork
                const sourceIsArtwork = artworks.some(a => a.id === d.source.id || a.id === d.source);
                const targetIsArtwork = artworks.some(a => a.id === d.target.id || a.id === d.target);
                
                if (sourceIsArtwork || targetIsArtwork) {
                    className += " artwork-link";
                }
                
                // Check if this is a cycle link
                if (d.isCycle) {
                    className += " cycle-link";
                }
                
                return className;
            })
            .attr("stroke-width", d => d.strength * 3);

        // Create nodes
        const node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(allNodes)
            .enter()
            .append("circle")
            .attr("class", d => d.category === "artwork" ? "node artwork-node" : "node")
            .attr("r", d => d.importance * 2)
            .attr("fill", d => colorScale(d.category))
            .call(d3.drag()
                .on("start", dragStarted)
                .on("drag", dragged)
                .on("end", dragEnded));

        // Add labels to nodes
        const label = svg.append("g")
            .attr("class", "labels")
            .selectAll("text")
            .data(allNodes)
            .enter()
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .style("font-size", d => d.category === "artwork" ? "9px" : "10px")
            .style("font-weight", d => d.category === "artwork" ? "bold" : "normal")
            .style("pointer-events", "none")
            .text(d => {
                // Shorten long names
                if (d.name.length > 20) {
                    return d.name.substring(0, 20) + "...";
                }
                return d.name;
            });

        // Add hover interactions
        node.on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            
            let tooltipContent = `<strong>${d.name}</strong>`;
            if (d.category === "artwork") {
                tooltipContent += `<br/>Artwork`;
            } else {
                tooltipContent += `<br/>Category: ${d.category}<br/>Importance: ${d.importance}`;
            }
            
            tooltip.html(tooltipContent)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
            
            // Highlight connected nodes and links
            link.style("stroke-opacity", l => (l.source.id === d.id || l.target.id === d.id) ? 1 : 0.2);
            node.style("opacity", n => isConnected(d, n) ? 1 : 0.2);
        })
        .on("mouseout", function(event, d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            
            // Reset opacity
            link.style("stroke-opacity", 0.6);
            node.style("opacity", 1);
        });

        link.on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            
            // Get node names for source and target
            const sourceNode = allNodes.find(n => n.id === d.source.id || n.id === d.source);
            const targetNode = allNodes.find(n => n.id === d.target.id || n.id === d.target);
            
            let connectionType = "Connection";
            if (sourceNode.category === "artwork" || targetNode.category === "artwork") {
                connectionType = "Artwork Connection";
            }
            if (d.isCycle) {
                connectionType = "Cycle Connection";
            }
            
            tooltip.html(`<strong>${connectionType}</strong><br/>${sourceNode.name} ↔ ${targetNode.name}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
            
            // Highlight this link and connected nodes
            link.style("stroke-opacity", l => l === d ? 1 : 0.2);
            node.style("opacity", n => n.id === d.source.id || n.id === d.target.id ? 1 : 0.2);
        })
        .on("mouseout", function(event, d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            
            // Reset opacity
            link.style("stroke-opacity", 0.6);
            node.style("opacity", 1);
        });

        // Update positions on each tick
        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

            label
                .attr("x", d => d.x)
                .attr("y", d => d.y);
        });

        // Drag functions
        function dragStarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragEnded(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        // Helper function to check if two nodes are connected
        function isConnected(a, b) {
            return allLinks.some(l => 
                (l.source.id === a.id && l.target.id === b.id) || 
                (l.source.id === b.id && l.target.id === a.id)
            );
        }

        // Control buttons
        d3.select("#reset-view").on("click", function() {
            simulation.alpha(1).restart();
            node.each(d => {
                d.fx = null;
                d.fy = null;
            });
        });

        let labelsVisible = true;
        d3.select("#toggle-labels").on("click", function() {
            labelsVisible = !labelsVisible;
            label.style("display", labelsVisible ? "block" : "none");
        });

        let artworkVisible = true;
        d3.select("#toggle-artwork").on("click", function() {
            artworkVisible = !artworkVisible;
            
            // Toggle artwork nodes and links
            node.filter(d => d.category === "artwork")
                .style("display", artworkVisible ? "block" : "none");
                
            label.filter(d => d.category === "artwork")
                .style("display", artworkVisible && labelsVisible ? "block" : "none");
                
            link.filter(d => {
                const sourceIsArtwork = artworks.some(a => a.id === d.source.id || a.id === d.source);
                const targetIsArtwork = artworks.some(a => a.id === d.target.id || a.id === d.target);
                return sourceIsArtwork || targetIsArtwork;
            }).style("display", artworkVisible ? "block" : "none");
        });

        let cyclesHighlighted = false;
        d3.select("#highlight-cycles").on("click", function() {
            cyclesHighlighted = !cyclesHighlighted;
            
            if (cyclesHighlighted) {
                // Highlight cycle links and nodes
                link.filter(d => !d.isCycle)
                    .style("opacity", 0.2);
                node.filter(d => d.category !== "artwork")
                    .style("opacity", 0.5);
                
                // Show cycle links more prominently
                link.filter(d => d.isCycle)
                    .style("stroke-width", d => d.strength * 5)
                    .style("opacity", 1);
            } else {
                // Reset all links and nodes
                link.style("opacity", 0.6)
                    .style("stroke-width", d => d.strength * 3);
                node.style("opacity", 1);
            }
        });