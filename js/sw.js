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
                borderColor: 'rgb(255, 136, 0)',  
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                borderWidth: 1.5,  
                tension: 0.4,
                pointRadius: 0, 
                pointHoverRadius: 5 
            },
            { 
                label: "Bt (nT)",
                data: [], 
                borderColor: 'rgba(255, 255, 255, 0.9)',  
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
        aspectRatio: 2.8,  
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
                    align: 'end'
                }
            },
            y: { 
                beginAtZero: false,
                grid: { color: 'rgba(200, 200, 200, 0.1)' },
                ticks: { color: '#ddd', font: { weight: 'bold' } },
                title: {
                    display: true,
                    text: "IMF (nT)",  
                    color: 'white',
                    font: { size: 16, weight: 'bold' }
                }
            }
        },
        plugins: {
            legend: { display: false } 
        }
    }
});

async function fetchData() {
    const response = await fetch('https://services.swpc.noaa.gov/products/solar-wind/mag-1-day.json');
    const data = await response.json();
    let labels = [], bzData = [], btData = [];

    // Get the current time and the time for 12 hours ago
    const now = new Date();
    const twelveHoursAgo = new Date(now - 12 * 60 * 60 * 1000); // 12 hours ago in milliseconds

    // Filter the data to only include the last 12 hours
    const filteredData = data.filter(row => {
        const rowTime = new Date(row[0]);
        return rowTime >= twelveHoursAgo && rowTime <= now;
    });

    // Process the filtered data
    filteredData.forEach(row => {
        labels.push(new Date(row[0]));
        bzData.push(parseFloat(row[3]));
        btData.push(parseFloat(row[6]));
    });

    // Get the latest values
    latestBz = bzData[bzData.length - 1].toFixed(2);
    latestBt = btData[btData.length - 1].toFixed(2);
    
    // Display the latest values
    document.getElementById('bz-value').textContent = `Bz GSM: ${latestBz} nT`;
    document.getElementById('bt-value').textContent = `Bt: ${latestBt} nT`;
    
    // Update the chart data
    solarWindChart.data.labels = labels;
    solarWindChart.data.datasets[0].data = bzData;
    solarWindChart.data.datasets[1].data = btData;
    solarWindChart.update();
}

// Initial data fetch
fetchData();

// Fetch data every minute
setInterval(fetchData, 60000);
