// NOAA API URLs
const primaryApiUrl = "https://services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json";
const secondaryApiUrl = "https://services.swpc.noaa.gov/json/goes/secondary/xrays-1-day.json";

// Global Chart Variable
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
    if (xrayChart) {
        xrayChart.data.labels = labels;
        xrayChart.data.datasets[0].data = g16S;
        xrayChart.data.datasets[1].data = g16L;
        xrayChart.data.datasets[2].data = g18S.length ? g18S : new Array(labels.length).fill(null);
        xrayChart.data.datasets[3].data = g18L.length ? g18L : new Array(labels.length).fill(null);
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
                {
                    label: "GOES-16 Short",
                    data: [],
                    borderColor: "blue",
                    borderWidth: 1.5,
                    pointRadius: 0,
                    tension: 0.3
                },
                {
                    label: "GOES-16 Long",
                    data: [],
                    borderColor: "red",
                    borderWidth: 1.5,
                    pointRadius: 0,
                    tension: 0.3
                },
                {
                    label: "GOES-18 Short",
                    data: [],
                    borderColor: "purple",
                    borderWidth: 1.5,
                    pointRadius: 0,
                    tension: 0.3
                },
                {
                    label: "GOES-18 Long",
                    data: [],
                    borderColor: "orange",
                    borderWidth: 1.5,
                    pointRadius: 0,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: { color: "white", maxTicksLimit: 12 },
                    grid: { color: "rgba(255,255,255,0.2)" }
                },
                y: {
                    title: { display: true, text: "Watts·m⁻²", color: "white" },
                    type: "logarithmic",
                    min: 1e-9,
                    max: 1e-4,
                    grid: { color: "rgba(255,255,255,0.2)" },
                    ticks: {
                        color: "white",
                        major: { enabled: true },
                        callback: function(value) {
                            const majorTicks = [1e-9, 1e-8, 1e-7, 1e-6, 1e-5, 1e-4];
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
                    max: 1e-4,
                    ticks: {
                        color: "white",
                        major: { enabled: true },
                        callback: function(value) {
                            const flareClasses = {
                                1e-8: "A",
                                1e-7: "B",
                                1e-6: "C",
                                1e-5: "M",
                                1e-4: "X"
                            };
                            return flareClasses[value] || "";
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: "white",
                        usePointStyle: true,
                        pointStyle: "line"
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.raw.toExponential(2) + " W/m²";
                        }
                    }
                },
                annotation: {
                    annotations: {
                        A: {
                            type: "box",
                            yMin: 1e-8,
                            yMax: 1e-7,
                            backgroundColor: "rgba(255, 255, 0, 0.2)",
                            borderWidth: 0,
                            z: -1
                        },
                        B: {
                            type: "box",
                            yMin: 1e-7,
                            yMax: 1e-6,
                            backgroundColor: "rgba(255, 165, 0, 0.2)",
                            borderWidth: 0,
                            z: -1
                        },
                        C: {
                            type: "box",
                            yMin: 1e-6,
                            yMax: 1e-5,
                            backgroundColor: "rgba(255, 69, 0, 0.2)",
                            borderWidth: 0,
                            z: -1
                        },
                        M: {
                            type: "box",
                            yMin: 1e-5,
                            yMax: 1e-4,
                            backgroundColor: "rgba(255, 0, 0, 0.2)",
                            borderWidth: 0,
                            z: -1
                        },
                        X: {
                            type: "box",
                            yMin: 1e-4,
                            yMax: 1e-3,
                            backgroundColor: "rgba(139, 0, 0, 0.3)",
                            borderWidth: 0,
                            z: -1
                        }
                    }
                }
            }
        }
    });
}
