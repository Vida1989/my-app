<script>
    import { onMount, afterUpdate } from 'svelte';
    import Plotly from 'plotly.js-dist';
    import * as d3 from 'd3';
  
    export let data = [];

  // Group data by year and plant key
  let groupedData = d3.group(data, d => d.year + '-' + d.PlantKey);

  // Extract unique years and plant keys
  let years = Array.from(new Set(data.map(d => d.year)));
  let plantKeys = Array.from(new Set(data.map(d => d.PlantKey)));

  // Initialize selected year and plant key
  let selectedYear = years[0];
  let selectedPlantKey = plantKeys[0];

//	let filteredYears = getFilteredYears(selectedPlantKey);
	let filteredPlantKey = getFilteredPlantKey(selectedYear);
  
  // Function to extract data for a specific year and plant key
  function getData(year, plantKey) {
    let key = year + '-' + plantKey;
    return groupedData.get(key);
  }

  // Function to create a stacked barplot
  function createPlot(year, plantKey) {
    let data = getData(year, plantKey);
    let months = Array.from(new Set(data.map(d => d.month)));

    // Initialize arrays for vendor shipment, arrival yard, and goods receipt
    let vendorShipment = new Array(months.length).fill(0);
    let arrivalYard = new Array(months.length).fill(0);
    let goodsReceipt = new Array(months.length).fill(0);

    // Aggregate data by month
    data.forEach(d => {
      let index = months.indexOf(d.month);
      vendorShipment[index] += d.vendorShipment;
      arrivalYard[index] += d.arrivalYard;
      goodsReceipt[index] += d.goodsReceipt;
    });

    // Plotly trace for vendor shipment
    let trace1 = {
      x: months,
      y: vendorShipment,
      name: 'Vendor Shipment',
      type: 'bar'
    };

    // Plotly trace for arrival yard
    let trace2 = {
      x: months,
      y: arrivalYard,
      name: 'Arrival Yard',
      type: 'bar'
    };

    // Plotly trace for goods receipt
    let trace3 = {
      x: months,
      y: goodsReceipt,
      name: 'Goods Receipt',
      type: 'bar'
    };

    // Add horizontal lines for averages
    let averageLines = [
      {
        type: 'line',
        xref: 'paper',
        x0: 0,
        x1: 1,
        yref: 'y',
        y0: 20,
        y1: 20,
        line: {
          color: 'red',
          width: 2,
          dash: 'dash'
        }
      },
      {
        type: 'line',
        xref: 'paper',
        x0: 0,
        x1: 1,
        yref: 'y',
        y0: 1.2,
        y1: 1.2,
        line: {
          color: 'green',
          width: 2,
          dash: 'dash'
        }
      },
      {
        type: 'line',
        xref: 'paper',
        x0: 0,
        x1: 1,
        yref: 'y',
        y0: 2,
        y1: 2,
        line: {
          color: 'blue',
          width: 2,
          dash: 'dash'
        }
      }
    ];

		  // traces for average lines
    let setTraces = [
        {
            x: months,
            y: new Array(months.length).fill(20),
					  type: 'lines',
            name: 'AVG Shipment: 20',
            line: {
                color: 'red',
                dash: 'dash',
                width: 2
            }
        },
        {
            x: months,
            y: new Array(months.length).fill(1.2),
            name: 'AVG Arrival: 1.2',
					  type: 'lines',
            line: {
                color: 'green',
                dash: 'dash',
                width: 2
            }
        },
        {
            x: months,
            y: new Array(months.length).fill(2),
            name: 'AVG Receipt: 2',
					  type: 'lines',
            line: {
                color: 'blue',
                dash: 'dash',
                width: 2
            }
        }
    ];
		
    // Layout configuration with annotations
    let layout = {
      title: `Monthly Delays for ${year} - Plant ${plantKey}`,
      barmode: 'stack',
      xaxis: {
        title: 'Month'
      },
      yaxis: {
        title: 'Value',
      },
      shapes: averageLines
    };

    // Plot configuration
    let config = {
      responsive: true
    };

    // Create the plot
    Plotly.newPlot('plot', [trace1, trace2, trace3, ...setTraces], layout, config);
  }

  // Initialize the plot on component mount
  onMount(() => {
    createPlot(selectedYear, selectedPlantKey);
  });
  
  afterUpdate(() => {
    filteredPlantKey = getFilteredPlantKey(selectedYear);
  });

  function getFilteredPlantKey(year) {
    return Array.from(new Set(data.filter(d => d.year === year).map(d => d.PlantKey)));
  }
</script>

<div>
	 <select bind:value={selectedYear}>
    {#each years as year}
      <option value={year}>Year: {year}</option>
    {/each}
  </select> 

  <button on:click={() => createPlot(selectedYear, selectedPlantKey)}>See Plot</button>
</div>

<div id="plot"></div>

<style>
  #plot {
    width: 100%;
    height: 400px;
  }
</style>
