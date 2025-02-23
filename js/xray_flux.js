const primaryApiUrl = "https://services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json";
const secondaryApiUrl = "https://services.swpc.noaa.gov/json/goes/secondary/xrays-1-day.json";

let xrayChart;

document.addEventListener("DOMContentLoaded", () => {
    createXrayChart();
    fetchXrayData();
    setInterval(fetchXrayData, 60000);
});

async function fetchXrayData() {
    try {
        console.log("Fetching X-ray flux data...");
        const [primaryResponse, secondaryResponse] = await Promise.all([
            fetch(primaryApiUrl),
            fetch(secondaryApiUrl)
        ]);
        const [primaryData, secondaryData] = await Promise.all([
            primaryResponse.json(),
            secondaryResponse.json()
        ]);

        const goes16Data = primaryData.filter(entry => entry.satellite === 16);
        const goes18Data = secondaryData.filter(entry => entry.satellite === 18);

        const goes16Short = goes16Data.filter(entry => entry.energy.includes("0.05"));
        const goes16Long = goes16Data.filter(entry => entry.energy.includes("0.1"));
        const goes18Short = goes18Data.filter(entry => entry.energy.includes("0.05"));
        const goes18Long = goes18Data.filter(entry => entry.energy.includes("0.1"));

        const timeLabels = goes16Short.map(entry =>
            new Date(entry.time_tag).toISOString().split("T")[1].slice(0, 5)
        );

        const goes16ShortFlux = goes16Short.map(entry => parseFloat(entry.flux));
        const goes16LongFlux = goes16Long.map(entry => parseFloat(entry.flux));
        const goes18ShortFlux = goes18Short.map(entry => parseFloat(entry.flux));
        const goes18LongFlux = goes18Long.map(entry => parseFloat(entry.flux));

        updateXrayChart(timeLabels, goes16ShortFlux, goes16LongFlux, goes18ShortFlux, goes18LongFlux);
    } catch (error) {
        console.error("Error fetching X-ray flux data:", error);
    }
}

function updateXrayChart(labels, g16S, g16L, g18S, g18L) {
    const allData = [...g16S, ...g16L, ...g18S, ...g18L].filter(value => value !== null);
    const minValue = Math.min(...allData, 1e-9);
    const maxValue = Math.max(...allData, 1e-3);

    if (xrayChart) {
        xrayChart.data.labels = labels;
        xrayChart.data.datasets[0].data = g16S;
        xrayChart.data.datasets[1].data = g16L;
        xrayChart.data.datasets[2].data = g18S.length ? g18S : new Array(labels.length).fill(null);
        xrayChart.data.datasets[3].data = g18L.length ? g18L : new Array(labels.length).fill(null);

        // Dynamically adjust the Y-axis scale
        xrayChart.options.scales.y.min = minValue * 0.8;
        xrayChart.options.scales.y.max = maxValue * 1.5;
        xrayChart.options.scales.y1.min = minValue * 0.8;
        xrayChart.options.scales.y1.max = maxValue * 1.5;

        xrayChart.update();
    }
}

function createXrayChart() {
    const ctx = document.getElementById("xrayFluxChart").getContext("2d");

    xrayChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [
                { label: "GOES-16 Short", data: [], borderColor: "blue", borderWidth: 1.5, pointRadius: 0, tension: 0.3 },
                { label: "GOES-16 Long", data: [], borderColor: "red", borderWidth: 1.5, pointRadius: 0, tension: 0.3 },
                { label: "GOES-18 Short", data: [], borderColor: "purple", borderWidth: 1.5, pointRadius: 0, tension: 0.3 },
                { label: "GOES-18 Long", data: [], borderColor: "orange", borderWidth: 1.5, pointRadius: 0, tension: 0.3 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', axis: 'x', intersect: false },
            scales: {
                x: {
                    ticks: { color: "white", maxTicksLimit: 12 },
                    grid: { color: "rgba(255,255,255,0.2)" }
                },
                y: {
                    title: { display: true, text: "Watts·m⁻²", color: "white" },
                    type: "logarithmic",
                    min: 1e-9,
                    max: 1e-2,
                    grid: { color: "rgba(255,255,255,0.2)", drawTicks: true },
                    ticks: {
                        color: "white",
                        callback: function(value) {
                            const majorTicks = [1e-9, 1e-8, 1e-7, 1e-6, 1e-5, 1e-4, 1e-3, 1e-2];
                            return majorTicks.includes(value) ? value.toExponential(0) : "";
                        }
                    }
                },
                y1: {
                    position: "right",
                    title: { display: true, text: "X-ray Flare Class", color: "white" },
                    grid: { drawOnChartArea: false },
                    type: "logarithmic",
                    min: 1e-9,
                    max: 1e-2,
                    ticks: {
                        color: "white",
                        callback: function(value) {
                            const flareClasses = {
                                1e-8: "A",
                                1e-7: "B",
                                1e-6: "C",
                                1e-5: "M",
                                1e-4: "X",
                                1e-3: "10X",
                                1e-2: "100X"
                            };
                            return flareClasses[value] || "";
                        }
                    }
                }
            },
            plugins: {
                annotation: {
                    annotations: [
                        { type: "line", mode: "horizontal", scaleID: "y", value: 1e-5, borderColor: "yellow", borderWidth: 1.5, label: { enabled: true, content: "M-Class", color: "yellow", backgroundColor: "rgba(0,0,0,0.7)" } },
                        { type: "line", mode: "horizontal", scaleID: "y", value: 1e-4, borderColor: "red", borderWidth: 1.5, label: { enabled: true, content: "X-Class", color: "red", backgroundColor: "rgba(0,0,0,0.7)" } }
                    ]
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (context.raw) {
                                label += `: ${context.raw.toExponential(2)} W/m²`;
                            }
                            return label;
                        }
                    }
                },
                legend: { labels: { color: "white", usePointStyle: true, pointStyle: "line" } }
            }
        }
    });
}
