const protonCtx = document.getElementById('protonFluxChart').getContext('2d');
let protonData = [];
let selectedTimeRange = 24 * 60 * 60 * 1000; // Last 24 hours
let activeEnergyRanges = { "1MeV": true, "10MeV": true, "100MeV": true, "500MeV": true };

let protonChart = new Chart(protonCtx, {
    type: 'line',
    data: {
        labels: [], // 🟢 Keep this as Date objects
        datasets: [
            { label: "≥1 MeV", data: [], borderColor: '#FF5733', borderWidth: 2, tension: 0.3, pointRadius: 0, hidden: false },
            { label: "≥10 MeV", data: [], borderColor: '#33FF57', borderWidth: 2, tension: 0.3, pointRadius: 0, hidden: false },
            { label: "≥100 MeV", data: [], borderColor: '#338CFF', borderWidth: 2, tension: 0.3, pointRadius: 0, hidden: false },
            { label: "≥500 MeV", data: [], borderColor: '#FFD700', borderWidth: 2, tension: 0.3, pointRadius: 0, hidden: false }
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
                    displayFormats: { hour: 'HH:mm' } 
                }, 
                ticks: { 
                    color: 'white', 
                    maxRotation: 0, // Prevent rotation
                    minRotation: 0,
                    callback: (value) => {
                        return new Date(value).toISOString().substring(11, 16); // 🟢 Properly format for display
                    }
                }, 
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)',
                    drawOnChartArea: true,
                    drawTicks: true
                },
                adapters: { date: { zone: 'UTC' } }
            },
            y: { 
                type: 'logarithmic', 
                title: { display: true, text: "Particles · cm² · s⁻¹ · sr⁻¹", color: 'white' }, 
                ticks: { 
                    color: 'white', 
                    callback: (value) => {
                        const allowedTicks = [1e-1, 1e0, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6]; 
                        return allowedTicks.includes(value) ? value.toExponential(1) : '';
                    } 
                }, 
                grid: { color: 'rgba(255, 255, 255, 0.2)', drawTicks: false } 
            }
        },
        plugins: {
            legend: {
                labels: { color: 'white', usePointStyle: true, pointStyle: 'line' }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    title: (tooltipItems) => {
                        let utcTime = new Date(tooltipItems[0].parsed.x).toISOString().replace('T', ' ').slice(0, -5);
                        return utcTime; // Tooltip still shows full timestamp
                    }
                }
            }
        },
        interaction: { mode: 'index', intersect: false },
        animation: false
    },
    plugins: [{
        id: 'verticalHoverLine',
        beforeDraw: (chart, args, options) => {
            if (!chart.tooltip?.active || chart.tooltip.opacity === 0) return;
            
            const ctx = chart.ctx;
            const x = chart.tooltip.caretX;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, chart.chartArea.top);
            ctx.lineTo(x, chart.chartArea.bottom);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.stroke();
            ctx.restore();
        }
    }]
});

// 🛰️ Fetch Proton Flux Data
async function fetchProtonFluxData() {
    try {
        const response = await fetch('https://services.swpc.noaa.gov/json/goes/primary/integral-protons-1-day.json');
        const rawData = await response.json();

        let groupedData = {}; 

        rawData.forEach(entry => {
            let timestamp = Date.parse(entry.time_tag);
            let timeUTC = new Date(timestamp).toISOString();

            if (!groupedData[timeUTC]) {
                groupedData[timeUTC] = { time: new Date(timestamp), flux1MeV: null, flux10MeV: null, flux100MeV: null, flux500MeV: null };
            }

            let fluxValue = parseFloat(entry.flux);
            if (!isNaN(fluxValue)) {
                switch (entry.energy) {
                    case ">=1 MeV": groupedData[timeUTC].flux1MeV = fluxValue; break;
                    case ">=10 MeV": groupedData[timeUTC].flux10MeV = fluxValue; break;
                    case ">=100 MeV": groupedData[timeUTC].flux100MeV = fluxValue; break;
                    case ">=500 MeV": groupedData[timeUTC].flux500MeV = fluxValue; break;
                }
            }
        });

        protonData = Object.values(groupedData);
        updateProtonChart();
    } catch (error) {
        console.error("Error fetching proton flux data:", error);
    }
}

// 🔄 Update Proton Flux Chart
function updateProtonChart() {
    let now = new Date();
    let cutoffTime = now.getTime() - selectedTimeRange;

    let filteredData = protonData.filter(point => point.time.getTime() >= cutoffTime);

    protonChart.data.labels = filteredData.map(point => point.time);
    protonChart.data.datasets.forEach((dataset, index) => {
        dataset.data = filteredData.map(point => point[`flux${dataset.label.replace('≥', '').split(' ')[0]}MeV`] ?? null);
    });
    
    protonChart.update();
}

// Function to Toggle Energy Range Visibility
function toggleEnergyRange(datasetIndex, buttonId, energyKey) {
    let dataset = protonChart.data.datasets[datasetIndex];
    dataset.hidden = !dataset.hidden;
    activeEnergyRanges[energyKey] = !activeEnergyRanges[energyKey];

    document.getElementById(buttonId).classList.toggle('active-button', !dataset.hidden);
    protonChart.update();
}

// Attach event listeners after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-1MeV').addEventListener('click', () => toggleEnergyRange(0, 'btn-1MeV', '1MeV'));
    document.getElementById('btn-10MeV').addEventListener('click', () => toggleEnergyRange(1, 'btn-10MeV', '10MeV'));
    document.getElementById('btn-100MeV').addEventListener('click', () => toggleEnergyRange(2, 'btn-100MeV', '100MeV'));
    document.getElementById('btn-500MeV').addEventListener('click', () => toggleEnergyRange(3, 'btn-500MeV', '500MeV'));
});

// Fetch Data Initially and Update Every Minute
fetchProtonFluxData();
setInterval(fetchProtonFluxData, 60000);
