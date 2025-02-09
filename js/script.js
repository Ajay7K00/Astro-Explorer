const ctx = document.getElementById('solarWindChart').getContext('2d');
let latestBz = "--";
let latestBt = "--";

let solarWindChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            { 
                label: "Bz GSM (nT)",
                data: [], 
                borderColor: 'rgba(255, 0, 0, 0.9)',  // RED for Bz
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                borderWidth: 1.5,  
                tension: 0.4,
                pointRadius: 0, 
                pointHoverRadius: 5 
            },
            { 
                label: "Bt (nT)",
                data: [], 
                borderColor: 'rgba(255, 255, 255, 0.9)',  // WHITE for Bt
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1.5,  
                tension: 0.4,
                pointRadius: 0, 
                pointHoverRadius: 5 
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 3,  
        scales: {
            x: { 
                type: 'time', 
                time: { unit: 'hour' },
                grid: { color: 'rgba(200, 200, 200, 0.1)' }, 
                ticks: { color: '#ddd', font: { weight: 'bold' } },
                title: {  
                    display: true,
                    text: new Date().toDateString(),  
                    color: 'white',
                    font: { size: 18, weight: 'bold' },
                    align: 'end'  // Move label to the right side
                }
            },
            y: { 
                beginAtZero: false,
                grid: { color: 'rgba(200, 200, 200, 0.1)' },
                ticks: { color: '#ddd', font: { weight: 'bold' } },
                title: {
                    display: true,
                    text: "Magnetic Field Strength (nT)",  
                    color: 'white',
                    font: { size: 16, weight: 'bold' }
                }
            }
        },
        plugins: {
            legend: { display: false } 
        },
        elements: {
            line: { borderJoinStyle: 'round' }
        }
    }
});

function updateLegend() {
    document.getElementById('bz-value').innerHTML = `<span style="color:red; font-weight:bold;">Bz GSM: ${latestBz} nT</span>`;
    document.getElementById('bt-value').innerHTML = `<span style="color:white; font-weight:bold;">Bt: ${latestBt} nT</span>`;
}

async function fetchData() {
    try {
        const response = await fetch('https://services.swpc.noaa.gov/products/solar-wind/mag-1-day.json');
        const data = await response.json();
        
        let labels = [];
        let bzData = [];
        let btData = [];
        
        for (let i = 1; i < data.length; i++) {
            labels.push(new Date(data[i][0])); // Time
            bzData.push(parseFloat(data[i][3])); // Bz GSM
            btData.push(parseFloat(data[i][6])); // Bt
        }

        // Get latest values
        latestBz = bzData[bzData.length - 1].toFixed(2);
        latestBt = btData[btData.length - 1].toFixed(2);

        // Update chart data
        solarWindChart.data.labels = labels;
        solarWindChart.data.datasets[0].data = bzData;
        solarWindChart.data.datasets[1].data = btData;

        // Update legend
        updateLegend();

        solarWindChart.update();

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Fetch data initially and update every 60 seconds
fetchData();
setInterval(fetchData, 60000);
