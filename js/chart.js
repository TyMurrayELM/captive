// js/charts.js

let chartsInitialized = false;
let chartInstances = {};

function initializeCharts() {
    console.log('Initializing charts...');
    
    // Reset if already initialized
    if (chartsInitialized) {
        console.log('Charts already initialized, destroying first...');
        destroyCharts();
    }
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded!');
        return;
    }
    
    // Chart.js configuration
    Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    
    // Wait a bit more to ensure DOM is ready
    setTimeout(() => {
        // Initialize trend chart
        const trendCanvas = document.getElementById('trendChart');
        console.log('Trend canvas:', trendCanvas);
        
        if (trendCanvas) {
            try {
                const trendCtx = trendCanvas.getContext('2d');
                chartInstances.trendChart = new Chart(trendCtx, {
                    type: 'line',
                    data: {
                        labels: ['Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025'],
                        datasets: [
                            {
                                label: 'Total Incurred',
                                data: [0, 0, 0, 7693, 13693, 13693, 13693, 13693, 16683, 39681],
                                borderColor: '#3498db',
                                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                                tension: 0.4,
                                borderWidth: 3
                            },
                            {
                                label: 'WC Claims',
                                data: [0, 0, 0, 0, 5500, 5500, 5500, 5500, 5500, 5500],
                                borderColor: '#2ecc71',
                                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                                tension: 0.4,
                                borderWidth: 2
                            },
                            {
                                label: 'AL Claims',
                                data: [0, 0, 0, 0, 8193, 8193, 8193, 8193, 11183, 26488],
                                borderColor: '#e74c3c',
                                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                                tension: 0.4,
                                borderWidth: 2
                            },
                            {
                                label: 'APD Claims',
                                data: [0, 0, 0, 7693, 0, 0, 0, 0, 0, 7693],
                                borderColor: '#f39c12',
                                backgroundColor: 'rgba(243, 156, 18, 0.1)',
                                tension: 0.4,
                                borderWidth: 2,
                                borderDash: [5, 5]
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom'
                            },
                            tooltip: {
                                mode: 'index',
                                intersect: false,
                                callbacks: {
                                    label: function(context) {
                                        return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function(value) {
                                        return '$' + value.toLocaleString();
                                    }
                                }
                            }
                        }
                    }
                });
                console.log('Trend chart created successfully');
            } catch (error) {
                console.error('Error creating trend chart:', error);
            }
        }
        
        // Initialize coverage chart
        const coverageCanvas = document.getElementById('coverageChart');
        console.log('Coverage canvas:', coverageCanvas);
        
        if (coverageCanvas) {
            try {
                const coverageCtx = coverageCanvas.getContext('2d');
                chartInstances.coverageChart = new Chart(coverageCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Workers Compensation', 'Auto Liability', 'General Liability', 'Auto Physical Damage'],
                        datasets: [{
                            data: [251438, 248864, 55670, 147432],
                            backgroundColor: [
                                '#3498db',
                                '#e74c3c',
                                '#2ecc71',
                                '#f39c12'
                            ],
                            borderWidth: 2,
                            borderColor: '#fff'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom'
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const label = context.label || '';
                                        const value = '$' + context.parsed.toLocaleString();
                                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                        const percentage = ((context.parsed / total) * 100).toFixed(1);
                                        return label + ': ' + value + ' (' + percentage + '%)';
                                    }
                                }
                            }
                        }
                    }
                });
                console.log('Coverage chart created successfully');
            } catch (error) {
                console.error('Error creating coverage chart:', error);
            }
        }
        
        // Initialize development chart
        const developmentCanvas = document.getElementById('developmentChart');
        console.log('Development canvas:', developmentCanvas);
        
        if (developmentCanvas) {
            try {
                const developmentCtx = developmentCanvas.getContext('2d');
                chartInstances.developmentChart = new Chart(developmentCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Paid', 'Reserves', 'Expense Paid', 'Expense Reserve'],
                        datasets: [
                            {
                                label: 'Workers Comp',
                                data: [4947, 53, 65, 435],
                                backgroundColor: '#3498db'
                            },
                            {
                                label: 'Auto Liability',
                                data: [12933, 12840, 65, 650],
                                backgroundColor: '#e74c3c'
                            },
                            {
                                label: 'General Liability',
                                data: [0, 0, 0, 0],
                                backgroundColor: '#2ecc71'
                            },
                            {
                                label: 'Auto Physical Damage',
                                data: [7693, 0, 0, 0],
                                backgroundColor: '#f39c12'
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom'
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function(value) {
                                        return '$' + value.toLocaleString();
                                    }
                                }
                            }
                        }
                    }
                });
                console.log('Development chart created successfully');
            } catch (error) {
                console.error('Error creating development chart:', error);
            }
        }
        
        chartsInitialized = true;
        console.log('All charts initialized');
        
    }, 500); // Increased delay to ensure DOM is ready
}

// Function to destroy all charts (useful when navigating away)
function destroyCharts() {
    console.log('Destroying charts...');
    Object.keys(chartInstances).forEach(key => {
        if (chartInstances[key]) {
            try {
                chartInstances[key].destroy();
                delete chartInstances[key];
            } catch (error) {
                console.error('Error destroying chart:', key, error);
            }
        }
    });
    chartsInitialized = false;
}

// Force re-initialization function for debugging
function forceInitCharts() {
    console.log('Force initializing charts...');
    destroyCharts();
    setTimeout(() => {
        initializeCharts();
    }, 100);
}