// Updated skills data with new hierarchy: Technical -> Tools -> Projects -> Contexts Used
const skillsData = {
  name: "My Skills Portfolio",
  children: [
    {
      name: "Technical Domains",
      children: [
        {
          name: "Frontend Development",
          children: [
            {
              name: "React SPA Dashboard",
              children: [
                { 
                  name: "E-commerce Analytics", 
                  proficiency: 90, 
                  years: 2, 
                  endorsements: 15, 
                  examples: ["Real-time metrics", "User behavior tracking"] 
                },
                { 
                  name: "Admin Panel", 
                  proficiency: 85, 
                  years: 1, 
                  endorsements: 8, 
                  examples: ["Data management", "User administration"] 
                }
              ]
            },
            {
              name: "Vue.js Applications",
              children: [
                { 
                  name: "Customer Portal", 
                  proficiency: 80, 
                  years: 1, 
                  endorsements: 6, 
                  examples: ["Service requests", "Account management"] 
                }
              ]
            }
          ]
        },
        {
          name: "Data Visualization",
          children: [
            {
              name: "D3.js Dashboards",
              children: [
                { 
                  name: "Business Intelligence", 
                  proficiency: 88, 
                  years: 2, 
                  endorsements: 12, 
                  examples: ["Sales trends", "Performance metrics"] 
                },
                { 
                  name: "Scientific Research", 
                  proficiency: 75, 
                  years: 1, 
                  endorsements: 5, 
                  examples: ["Experimental data", "Statistical analysis"] 
                }
              ]
            },
            {
              name: "Tableau Reports",
              children: [
                { 
                  name: "Executive Summaries", 
                  proficiency: 70, 
                  years: 1, 
                  endorsements: 4, 
                  examples: ["Quarterly reviews", "Stakeholder updates"] 
                }
              ]
            }
          ]
        },
        {
          name: "Backend Systems",
          children: [
            {
              name: "Node.js Microservices",
              children: [
                { 
                  name: "API Gateway", 
                  proficiency: 85, 
                  years: 2, 
                  endorsements: 10, 
                  examples: ["Request routing", "Authentication"] 
                },
                { 
                  name: "Data Processing", 
                  proficiency: 80, 
                  years: 1, 
                  endorsements: 7, 
                  examples: ["ETL pipelines", "Batch operations"] 
                }
              ]
            },
            {
              name: "Python Data Services",
              children: [
                { 
                  name: "Machine Learning API", 
                  proficiency: 78, 
                  years: 1, 
                  endorsements: 6, 
                  examples: ["Model inference", "Data preprocessing"] 
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "Technical Expertise",
      children: [
        {
          name: "Cloud Platforms",
          children: [
            {
              name: "AWS Infrastructure",
              children: [
                { 
                  name: "Production Deployment", 
                  proficiency: 82, 
                  years: 2, 
                  endorsements: 9, 
                  examples: ["EC2 instances", "S3 storage", "Load balancing"] 
                },
                { 
                  name: "DevOps Pipeline", 
                  proficiency: 75, 
                  years: 1, 
                  endorsements: 5, 
                  examples: ["CI/CD automation", "Container orchestration"] 
                }
              ]
            },
            {
              name: "Azure Services",
              children: [
                { 
                  name: "Enterprise Integration", 
                  proficiency: 70, 
                  years: 1, 
                  endorsements: 4, 
                  examples: ["Active Directory", "SQL Database"] 
                }
              ]
            }
          ]
        },
        {
          name: "Database Systems",
          children: [
            {
              name: "MongoDB Clusters",
              children: [
                { 
                  name: "Big Data Applications", 
                  proficiency: 78, 
                  years: 2, 
                  endorsements: 8, 
                  examples: ["User analytics", "Event logging"] 
                }
              ]
            },
            {
              name: "PostgreSQL Databases",
              children: [
                { 
                  name: "Transactional Systems", 
                  proficiency: 72, 
                  years: 1, 
                  endorsements: 5, 
                  examples: ["Order processing", "Inventory management"] 
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// Set up dimensions - wider to accommodate deeper hierarchy
const width = 1200;
const height = 800;
const margin = { top: 20, right: 150, bottom: 30, left: 150 };

// Create tree layout
const treeLayout = d3.tree()
  .size([height - margin.top - margin.bottom, width - margin.left - margin.right]);

// Create SVG container
const svg = d3.select("#vis-treeplot")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Create root node
const root = d3.hierarchy(skillsData);
treeLayout(root);

// Color scales for different levels
const levelColors = {
  1: "#2c3e50",  // Technical Domains/Expertise
  2: "#3498db",  // Frontend/Data/Backend/Cloud/Database
  3: "#9b59b6",  // Projects/Tools
  4: "#2ecc71"   // Contexts Used
};

// Size scale for years of experience
const yearsScale = d3.scaleLinear()
  .domain([1, 5])
  .range([4, 10]);

// Proficiency color scale
const proficiencyColor = d3.scaleLinear()
  .domain([60, 75, 85, 95])
  .range(["#e74c3c", "#f39c12", "#27ae60", "#2ecc71"]);

// Add links - ALL IN BLACK
const links = svg.selectAll(".link")
  .data(root.links())
  .enter()
  .append("path")
  .attr("class", "link")
  .attr("d", d3.linkHorizontal()
    .x(d => d.y)
    .y(d => d.x))
  .style("fill", "none")
  .style("stroke", "#000000")  // Changed to black
  .style("stroke-width", "1.5px")  // Consistent stroke width
  .style("opacity", 0.7);  // Slightly transparent for better hierarchy visibility

// Add nodes
const nodes = svg.selectAll(".node")
  .data(root.descendants())
  .enter()
  .append("g")
  .attr("class", "node")
  .attr("transform", d => `translate(${d.y},${d.x})`);

// Add circles with colors based on hierarchy level
nodes.append("circle")
  .attr("r", d => {
    if (d.depth === 0) return 12; // Root
    if (d.depth === 4) return yearsScale(d.data.years || 1); // Leaf nodes (Contexts Used)
    return 8; // Intermediate nodes
  })
  .style("fill", d => {
    if (d.depth === 0) return "#e74c3c"; // Root
    if (d.depth === 4) return proficiencyColor(d.data.proficiency || 70); // Leaf nodes
    return levelColors[d.depth] || "#95a5a6";
  })
  .style("stroke", "#ffffff")  // Black stroke for nodes too
  .style("stroke-width", "1.5px")
  .style("cursor", "pointer")
  .style("opacity", d => d.depth === 4 ? 0.9 : 0.8)
  .on("mouseover", function(event, d) {
    if (d.depth === 4) { // Only show tooltip for Contexts Used
      showTooltip(event, d);
    }
    // Highlight path to root
    highlightPath(d);
  })
  .on("mouseout", function() {
    hideTooltip();
    resetHighlight();
  });

// Add labels with different styling per level
nodes.append("text")
  .attr("dy", "0.31em")
  .attr("x", d => {
    if (d.depth === 0) return 0;
    return d.children ? -28 : 28;
  })
  .style("text-anchor", d => {
    if (d.depth === 0) return "middle";
    return d.children ? "end" : "start";
  })
  .style("font-family", "Arial, sans-serif")
  .style("font-size", d => {
    if (d.depth === 0) return "18px";
    if (d.depth === 1) return "14px";
    if (d.depth === 2) return "12px";
    return "11px";
  })
  .style("font-weight", d => {
    if (d.depth <= 1) return "bold";
    return "normal";
  })
  .style("fill", d => {
    if (d.depth === 0) return "#2c3e50";
    if (d.depth === 1) return levelColors[1];
    if (d.depth === 2) return levelColors[2];
    if (d.depth === 3) return levelColors[3];
    return "#34495e";
  })
  .text(d => d.data.name);

// Add metrics labels for leaf nodes (Contexts Used)
nodes.filter(d => d.depth === 4)
  .append("text")
  .attr("dy", "1.4em")
  .attr("x", 28)
  .style("text-anchor", "start")
  .style("font-family", "Arial, sans-serif")
  .style("font-size", "9px")
  .style("fill", "#7f8c8d")
  .text(d => `P:${d.data.proficiency}% • Y:${d.data.years} • E:${d.data.endorsements}`);

// Create tooltip
const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("background", "white")
  .style("border", "1px solid #ddd")
  .style("border-radius", "4px")
  .style("padding", "10px")
  .style("box-shadow", "0 4px 20px rgba(0,0,0,0.15)")
  .style("font-family", "Arial, sans-serif")
  .style("font-size", "12px")
  .style("opacity", 0)
  .style("pointer-events", "none")
  .style("z-index", 1000)
  .style("max-width", "300px");

function showTooltip(event, d) {
  const examples = d.data.examples ? d.data.examples.map(ex => `• ${ex}`).join('<br>') : 'No examples';
  
  // Get hierarchy path
  const path = getHierarchyPath(d);
  
  tooltip
    .html(`
      <div style="border-left: 4px solid ${levelColors[4]}; padding-left: 8px; margin-bottom: 8px;">
        <strong style="color: ${levelColors[4]};">${d.data.name}</strong>
      </div>
      <div style="font-size: 10px; color: #7f8c8d; margin-bottom: 8px;">
        ${path.join(' → ')}
      </div>
      <table style="width: 100%; font-size: 11px;">
        <tr><td><strong>Proficiency:</strong></td><td>${d.data.proficiency}%</td></tr>
        <tr><td><strong>Years:</strong></td><td>${d.data.years}</td></tr>
        <tr><td><strong>Endorsements:</strong></td><td>${d.data.endorsements}</td></tr>
      </table>
      <div style="margin-top: 8px;">
        <strong>Examples:</strong><br>
        <div style="font-size: 10px; margin-top: 4px;">${examples}</div>
      </div>
    `)
    .style("left", (event.pageX + 15) + "px")
    .style("top", (event.pageY - 15) + "px")
    .style("opacity", 1);
}

function getHierarchyPath(node) {
  const path = [];
  let current = node;
  while (current && current.depth > 0) {
    path.unshift(current.data.name);
    current = current.parent;
  }
  return path;
}

function hideTooltip() {
  tooltip.style("opacity", 0);
}

function highlightPath(node) {
  // Reset all
  resetHighlight();
  
  // Highlight path to root
  let current = node;
  while (current) {
    d3.select(current._groups[0][0]).select('circle')
      .style('stroke', '#e74c3c')
      .style('stroke-width', '3px');
    
    // Highlight connecting links
    if (current.parent) {
      const link = root.links().find(l => 
        l.target === current || l.source === current
      );
      if (link) {
        d3.select(link._groups[0][0])
          .style('stroke', '#e74c3c')
          .style('stroke-width', '3px')
          .style('opacity', 1);
      }
    }
    
    current = current.parent;
  }
}

function resetHighlight() {
  nodes.select('circle')
    .style('stroke', '#000000')
    .style('stroke-width', '1.5px');
  
  links
    .style('stroke', '#000000')
    .style('stroke-width', '1.5px')
    .style('opacity', 0.7);
}

// Add zoom behavior
const zoom = d3.zoom()
  .scaleExtent([0.3, 3])
  .on("zoom", (event) => {
    svg.attr("transform", event.transform);
  });

d3.select("#vis-treeplot svg")
  .call(zoom);

// Add hierarchy legend
const legend = svg.append("g")
  .attr("class", "legend")
  .attr("transform", `translate(20, 20)`);

// Hierarchy level legend
const hierarchyLevels = [
  { level: 1, label: "Technical Domains", color: levelColors[1] },
  { level: 2, label: "Tools & Platforms", color: levelColors[2] },
  { level: 3, label: "Projects", color: levelColors[3] },
  { level: 4, label: "Contexts Used", color: levelColors[4] }
];

hierarchyLevels.forEach((item, i) => {
  const legendItem = legend.append("g")
    .attr("transform", `translate(0, ${i * 25})`);
  
  legendItem.append("circle")
    .attr("r", 6)
    .style("fill", item.color)
    .style("stroke", "#ffffff")
    .style("stroke-width", "1px");
  
  legendItem.append("text")
    .attr("x", 12)
    .attr("dy", "0.31em")
    .text(item.label)
    .style("font-family", "Arial, sans-serif")
    .style("font-size", "10px")
    .style("fill", "#2c3e50");
});

// Add proficiency legend
const proficiencyLegend = svg.append("g")
  .attr("class", "proficiency-legend")
  .attr("transform", `translate(200, 20)`);

proficiencyLegend.append("text")
  .text("Proficiency Level:")
  .style("font-family", "Arial, sans-serif")
  .style("font-size", "10px")
  .style("font-weight", "bold");

const proficiencyRanges = [
  { min: 60, max: 75, color: "#e74c3c", label: "60-75%" },
  { min: 75, max: 85, color: "#f39c12", label: "75-85%" },
  { min: 85, max: 95, color: "#27ae60", label: "85-95%" },
  { min: 95, max: 100, color: "#2ecc71", label: "95-100%" }
];

proficiencyRanges.forEach((range, i) => {
  const legendItem = proficiencyLegend.append("g")
    .attr("transform", `translate(${i * 80}, 15)`);
  
  legendItem.append("circle")
    .attr("r", 5)
    .style("fill", range.color)
    .style("stroke", "#000000")
    .style("stroke-width", "1px");
  
  legendItem.append("text")
    .attr("x", 8)
    .attr("dy", "0.31em")
    .text(range.label)
    .style("font-family", "Arial, sans-serif")
    .style("font-size", "9px");
});

// Add some basic styles
d3.select("#vis-treeplot")
  .style("border", "1px solid #ecf0f1")
  .style("border-radius", "8px")
  .style("background", "#antiquewhite")
  .style("overflow", "hidden");