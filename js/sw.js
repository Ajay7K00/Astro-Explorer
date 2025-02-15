const ctx = document.getElementById('solarWindChart').getContext('2d');
let latestBz = "--";
let latestBt = "--";
let fullData = [];
let HOURS_TO_DISPLAY = 24; // Default time range

let solarWindChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            { 
                label: "Bz GSM (nT)",
                data: [], 
                borderColor: 'rgba(255, 123, 0, 0.60)',  
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                borderWidth: 1.5,  
                tension: 0.4,
                pointRadius: 0, 
                pointHoverRadius: 5 
            },
            { 
                label: "Bt (nT)",
                data: [], 
                borderColor: 'rgba(255, 255, 255, 0.60)',  
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
                ticks: { color: 'white' }
            },
            y: { 
                beginAtZero: false,
                ticks: { color: 'white' }
            }
        },
        plugins: {
            legend: { display: false } // ✅ Legend turned off
        }
    }
});

// Fetch Solar Wind Data
async function fetchData() {
    try {
        const response = await fetch('https://services.swpc.noaa.gov/products/solar-wind/mag-1-day.json');
        const data = await response.json();

        // Process data, ensuring timestamps are converted correctly
        fullData = data.slice(1).map(row => ({
            time: new Date(row[0]), 
            bz: parseFloat(row[3]), 
            bt: parseFloat(row[6])  
        }));

        updateChart();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Update Chart based on selected time range
function updateChart() {
    let now = new Date(); // Current time
    let cutoffTime = now.getTime() - HOURS_TO_DISPLAY * 60 * 60 * 1000; // Cutoff based on hours

    let filteredData = fullData.filter(point => point.time.getTime() >= cutoffTime);

    console.log(`Now: ${now}, Cutoff Time: ${new Date(cutoffTime)}, Data Points: ${filteredData.length}`);

    solarWindChart.data.labels = filteredData.map(point => point.time);
    solarWindChart.data.datasets[0].data = filteredData.map(point => point.bz);
    solarWindChart.data.datasets[1].data = filteredData.map(point => point.bt);

    if (filteredData.length > 0) {
        latestBz = filteredData[filteredData.length - 1].bz.toFixed(2);
        latestBt = filteredData[filteredData.length - 1].bt.toFixed(2);
    }

    document.getElementById('bz-value').textContent = `Bz GSM: ${latestBz} nT`;
    document.getElementById('bt-value').textContent = `Bt: ${latestBt} nT`;

    solarWindChart.update();
}

// Event Listeners for Time Range Selection
document.getElementById('btn-1day').addEventListener('click', () => { HOURS_TO_DISPLAY = 24; updateChart(); });
document.getElementById('btn-12hr').addEventListener('click', () => { HOURS_TO_DISPLAY = 12; updateChart(); });
document.getElementById('btn-6hr').addEventListener('click', () => { HOURS_TO_DISPLAY = 6; updateChart(); });

// Fetch Data Initially and Update Every Minute
fetchData();
setInterval(fetchData, 60000);