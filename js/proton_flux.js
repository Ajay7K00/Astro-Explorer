const protonCtx = document.getElementById('protonFluxChart').getContext('2d');
let protonData = [];
let selectedTimeRange = 24 * 60 * 60 * 1000; // Last 24 hours
let activeEnergyRanges = { "1MeV": true, "10MeV": true, "100MeV": true, "500MeV": true };

let protonChart = new Chart(protonCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            { 
                label: "≥1 MeV",
                data: [],
                borderColor: '#FF5733', 
                backgroundColor: 'rgba(255, 87, 51, 0.2)',
                borderWidth: 2.5,
                tension: 0.3,
                pointRadius: 0.5, 
                pointHoverRadius: 2,
                hidden: false
            },
            { 
                label: "≥10 MeV",
                data: [],
                borderColor: '#33FF57', 
                backgroundColor: 'rgba(51, 255, 87, 0.2)',
                borderWidth: 2.5,
                tension: 0.3,
                pointRadius: 0.5,
                pointHoverRadius: 2,
                hidden: false
            },
            { 
                label: "≥100 MeV",
                data: [],
                borderColor: '#338CFF', 
                backgroundColor: 'rgba(51, 140, 255, 0.2)',
                borderWidth: 2.5,
                tension: 0.3,
                pointRadius: 0.5,
                pointHoverRadius: 2,
                hidden: false
            },
            { 
                label: "≥500 MeV",
                data: [],
                borderColor: '#FFD700', 
                backgroundColor: 'rgba(255, 215, 0, 0.2)',
                borderWidth: 2.5,
                tension: 0.3,
                pointRadius: 0.5,
                pointHoverRadius: 2,
                hidden: false
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
                time: { 
                    unit: 'hour',
                    tooltipFormat: 'yyyy-MM-dd HH:mm:ss',
                    displayFormats: { hour: 'h a' } // AM/PM format
                },
                ticks: { 
                    color: 'white',
                    maxTicksLimit: 12,
                    callback: function(value) {
                        let date = new Date(value);
                        let hours = date.getUTCHours();
                        let period = hours >= 12 ? 'PM' : 'AM';
                        let formattedHours = hours % 12 || 12;
                        return formattedHours + " " + period;
                    }
                }
            },
            y: { 
                type: 'logarithmic',
                title: { 
                    display: true,
                    text: "Particles · cm² · s⁻¹ · sr⁻¹",
                    color: 'white'
                },
                ticks: { 
                    color: 'white',
                    callback: function(value, index, values) {
                        if (value === 5e-1 || value === 5e0 || value === 5e1 || value === 5e2 || value === 5e3) {
                            return ''; // Hide specific values like 5.0e+0, 5.0e+1, etc.
                        }
                        return value.toExponential(1);
                    }
                },
                grid: { color: 'rgba(255, 255, 255, 0.2)' }
            }
        },
        plugins: {
            legend: { 
                labels: { 
                    color: 'white',
                    usePointStyle: true,
                    pointStyle: 'line' 
                }
            },
            tooltip: {
                callbacks: {
                    title: function(tooltipItems) {
                        if (!tooltipItems.length) return '';
                        return new Date(tooltipItems[0].parsed.x)
                            .toISOString()
                            .replace('T', ' ')
                            .slice(0, -5);
                    }
                }
            }
        }
    }
});

// Fetch Proton Flux Data
async function fetchProtonFluxData() {
    try {
        const response = await fetch('https://services.swpc.noaa.gov/json/goes/primary/integral-protons-1-day.json');
        const rawData = await response.json();

        let groupedData = {}; 

        rawData.forEach(entry => {
            let timestamp = new Date(entry.time_tag).getTime();
            
            if (!groupedData[timestamp]) {
                groupedData[timestamp] = { time: new Date(timestamp), flux1MeV: null, flux10MeV: null, flux100MeV: null, flux500MeV: null };
            }
            
            let fluxValue = parseFloat(entry.flux);
            if (!isNaN(fluxValue)) {
                switch (entry.energy) {
                    case ">=1 MeV":
                        groupedData[timestamp].flux1MeV = fluxValue;
                        break;
                    case ">=10 MeV":
                        groupedData[timestamp].flux10MeV = fluxValue;
                        break;
                    case ">=100 MeV":
                        groupedData[timestamp].flux100MeV = fluxValue;
                        break;
                    case ">=500 MeV":
                        groupedData[timestamp].flux500MeV = fluxValue;
                        break;
                }
            }
        });

        protonData = Object.values(groupedData);
        updateProtonChart();
    } catch (error) {
        console.error("Error fetching proton flux data:", error);
    }
}

// Update Proton Flux Chart
function updateProtonChart() {
    let now = new Date();
    let cutoffTime = now.getTime() - selectedTimeRange;

    let filteredData = protonData.filter(point => point.time.getTime() >= cutoffTime);

    protonChart.data.labels = filteredData.map(point => point.time);
    protonChart.data.datasets[0].data = filteredData.map(point => point.flux1MeV ?? null);
    protonChart.data.datasets[1].data = filteredData.map(point => point.flux10MeV ?? null);
    protonChart.data.datasets[2].data = filteredData.map(point => point.flux100MeV ?? null);
    protonChart.data.datasets[3].data = filteredData.map(point => point.flux500MeV ?? null);

    // **Make Y-Axis Dynamic**
    let allFluxValues = protonData.flatMap(point => [
        point.flux1MeV, point.flux10MeV, point.flux100MeV, point.flux500MeV
    ].filter(v => v !== null));

    if (allFluxValues.length > 0) {
        let minVal = Math.min(...allFluxValues) * 0.8; // 20% padding below min
        let maxVal = Math.max(...allFluxValues) * 1.2; // 20% padding above max

        protonChart.options.scales.y.suggestedMin = minVal;
        protonChart.options.scales.y.suggestedMax = maxVal;
    }

    protonChart.update();
}

// Energy Range Button Click Handling
document.getElementById('btn-1MeV').addEventListener('click', () => toggleEnergyRange(0, 'btn-1MeV', '1MeV'));
document.getElementById('btn-10MeV').addEventListener('click', () => toggleEnergyRange(1, 'btn-10MeV', '10MeV'));
document.getElementById('btn-100MeV').addEventListener('click', () => toggleEnergyRange(2, 'btn-100MeV', '100MeV'));
document.getElementById('btn-500MeV').addEventListener('click', () => toggleEnergyRange(3, 'btn-500MeV', '500MeV'));

// Function to Toggle Energy Range Visibility
function toggleEnergyRange(datasetIndex, buttonId, energyKey) {
    let dataset = protonChart.data.datasets[datasetIndex];
    dataset.hidden = !dataset.hidden;
    activeEnergyRanges[energyKey] = !activeEnergyRanges[energyKey];

    document.getElementById(buttonId).classList.toggle('active-button', !dataset.hidden);
    protonChart.update();
}

// Fetch Data Initially and Update Every Minute
fetchProtonFluxData();
setInterval(fetchProtonFluxData, 60000);
