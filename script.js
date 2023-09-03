// Define the dimensions of the SVG container and margins
const margin = { top: 20, right: 20, bottom: 50, left: 60 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const dopingColor = "steelblue";
const noDopingColor = "orange";

// Create the SVG container
const svg = d3.select("#scatterplot")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load the data
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
    .then(data => {
        // Convert string dates to Date objects
        data.forEach(d => {
            d.Year = new Date(d.Year.toString());
            d.Time = new Date(0, 0, 0, 0, d.Time.split(':')[0], d.Time.split(':')[1]);
        });

        // Define scales for x and y axes
        const xScale = d3.scaleTime()
            .domain([d3.min(data, d => d.Year), d3.max(data, d => d.Year)])
            .range([0, width]);

        const yScale = d3.scaleTime()
            .domain(d3.extent(data, d => d.Time))
            .range([0, height]);

        // Create x and y axes
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
        const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

        // Append x and y axes to the SVG
        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        svg.append("g")
            .attr("id", "y-axis")
            .call(yAxis);

        // Create dots for the data points
        svg.selectAll(".dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("r", 5)
            .attr("cx", d => xScale(d.Year))
            .attr("cy", d => yScale(d.Time))
            .attr("data-xvalue", d => d.Year)
            .attr("data-yvalue", d => d.Time)
            .attr("data-doping", d => d.Doping) // Add a data attribute for doping
            .style("fill", d => (d.Doping ? dopingColor : noDopingColor)) // Set fill based on doping
            .on("mouseover", showTooltip)
            .on("mouseout", hideTooltip);
    });

// Create a tooltip
const tooltip = d3.select("#tooltip");

function showTooltip(event, d) {
    tooltip.transition().duration(200).style("opacity", 0.9);
    tooltip.html(`${d.Name}: ${d.Nationality}<br>Year: ${d3.timeFormat("%Y")(d.Year)}<br>Time: ${d3.timeFormat("%M:%S")(d.Time)}`)
        .attr("data-year", d.Year)
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY - 28) + "px");
}

function hideTooltip() {
    tooltip.transition().duration(500).style("opacity", 0);
}


// Define the legend data (you can customize the text)
const legendData = [
    { color: "steelblue", label: "Doping Allegations" }, // Blue for doping allegations
    { color: "orange", label: "No Doping Allegations" }, // Orange for no doping allegations
  ];
  
  // Create the legend
  const legend = d3.select("#legend");
  
  // Append legend items
  const legendItems = legend
    .selectAll("div")
    .data(legendData)
    .enter()
    .append("div")
    .attr("class", "legend-item");
  
  // Add colored squares to represent the colors
  legendItems
    .append("div")
    .attr("class", "legend-color")
    .style("background-color", (d) => d.color);
  
  // Add labels to the legend
  legendItems
    .append("div")
    .attr("class", "legend-label")
    .text((d) => d.label);