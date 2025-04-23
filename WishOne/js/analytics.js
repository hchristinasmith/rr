// Analytics JavaScript with Chart.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all charts
    initBudgetComparisonChart();
    initCategoryChart();
    initSavingsChart();
    initPriorityPriceChart();
    
    // Handle date range changes
    document.getElementById('date-range').addEventListener('change', function() {
        // In a real app, this would fetch new data based on the selected range
        // For now, we'll just regenerate the charts with slightly different data
        updateChartsForDateRange(this.value);
    });
    
    // Handle download buttons
    document.querySelectorAll('.chart-actions .action-btn[title="Download"]').forEach(button => {
        button.addEventListener('click', function() {
            const chartCard = this.closest('.chart-card');
            const chartTitle = chartCard.querySelector('h3').textContent;
            const canvas = chartCard.querySelector('canvas');
            
            // Create a temporary link to download the chart as an image
            const link = document.createElement('a');
            link.download = `${chartTitle.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });
    
    // Handle info buttons
    document.querySelectorAll('.chart-actions .action-btn[title="Info"]').forEach(button => {
        button.addEventListener('click', function() {
            const chartCard = this.closest('.chart-card');
            const chartTitle = chartCard.querySelector('h3').textContent;
            
            // Show info about the chart (in a real app, this would be a modal or tooltip)
            alert(`Information about ${chartTitle}:\n\nThis chart helps you visualize your wishlist data to make better financial decisions.`);
        });
    });
});

// 1. Budget vs Wishlist Cost Chart
function initBudgetComparisonChart() {
    const ctx = document.getElementById('budget-comparison-chart').getContext('2d');
    
    // Sample data
    const data = {
        labels: ['Budget Allocation'],
        datasets: [
            {
                label: 'Total Budget',
                data: [2500],
                backgroundColor: '#333',
                barThickness: 40
            },
            {
                label: 'Wishlist Cost',
                data: [1750],
                backgroundColor: '#666',
                barThickness: 40
            },
            {
                label: 'Remaining Budget',
                data: [750],
                backgroundColor: '#999',
                barThickness: 40
            }
        ]
    };
    
    // Chart configuration
    const config = {
        type: 'bar',
        data: data,
        options: {
            indexAxis: 'y',
            plugins: {
                title: {
                    display: false
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            family: "'Libre Franklin', sans-serif",
                            size: 12
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: $${context.raw}`;
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: false,
                    beginAtZero: true,
                    grid: {
                        display: true,
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            family: "'Libre Franklin', sans-serif"
                        },
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                },
                y: {
                    stacked: false,
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            family: "'Libre Franklin', sans-serif"
                        }
                    }
                }
            }
        }
    };
    
    // Create the chart
    new Chart(ctx, config);
}

// 2. Category Spending Overview Chart
function initCategoryChart() {
    const ctx = document.getElementById('category-chart').getContext('2d');
    
    // Sample data
    const data = {
        labels: ['Electronics', 'Clothing', 'Accessories', 'Home', 'Other'],
        datasets: [{
            data: [45, 25, 15, 10, 5],
            backgroundColor: [
                '#333333',
                '#555555',
                '#777777',
                '#999999',
                '#bbbbbb'
            ],
            borderWidth: 0
        }]
    };
    
    // Chart configuration
    const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            family: "'Libre Franklin', sans-serif",
                            size: 12
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    };
    
    // Create the chart
    new Chart(ctx, config);
}

// 3. Savings Progress Chart
function initSavingsChart() {
    const ctx = document.getElementById('savings-chart').getContext('2d');
    
    // Sample data - last 6 months of savings
    const labels = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        labels.push(date.toLocaleString('default', { month: 'short' }));
    }
    
    const data = {
        labels: labels,
        datasets: [{
            label: 'Total Savings',
            data: [350, 520, 750, 900, 1100, 1250],
            fill: true,
            backgroundColor: 'rgba(51, 51, 51, 0.1)',
            borderColor: '#333',
            tension: 0.4,
            pointBackgroundColor: '#333',
            pointRadius: 4
        }]
    };
    
    // Chart configuration
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Savings: $${context.raw}`;
                        }
                    }
                },
                annotation: {
                    annotations: {
                        milestone25: {
                            type: 'line',
                            yMin: 625,
                            yMax: 625,
                            borderColor: 'rgba(102, 102, 102, 0.5)',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            label: {
                                content: '25%',
                                enabled: true,
                                position: 'end'
                            }
                        },
                        milestone50: {
                            type: 'line',
                            yMin: 1250,
                            yMax: 1250,
                            borderColor: 'rgba(102, 102, 102, 0.5)',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            label: {
                                content: '50%',
                                enabled: true,
                                position: 'end'
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            family: "'Libre Franklin', sans-serif"
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        display: true,
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            family: "'Libre Franklin', sans-serif"
                        },
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            }
        }
    };
    
    // Create the chart
    new Chart(ctx, config);
}

// 4. Priority vs Price Scatter Plot
function initPriorityPriceChart() {
    const ctx = document.getElementById('priority-price-chart').getContext('2d');
    
    // Sample data - wishlist items with priority (1-3) and price
    const data = {
        datasets: [{
            label: 'Wishlist Items',
            data: [
                { x: 3, y: 350, name: 'Leather Jacket' },
                { x: 3, y: 250, name: 'Wireless Headphones' },
                { x: 3, y: 250, name: 'Running Shoes' },
                { x: 2, y: 150, name: 'Leather Bag' },
                { x: 2, y: 200, name: 'Silver Watch' },
                { x: 2, y: 90, name: 'Summer Dress' },
                { x: 1, y: 500, name: 'Tablet' },
                { x: 1, y: 120, name: 'Desk Lamp' },
                { x: 1, y: 80, name: 'Books' }
            ],
            backgroundColor: function(context) {
                const value = context.raw.x;
                return value === 3 ? '#333' : value === 2 ? '#777' : '#bbb';
            },
            pointRadius: function(context) {
                const value = context.raw.y;
                // Scale point size based on price
                return Math.max(5, Math.min(15, value / 50));
            },
            pointHoverRadius: function(context) {
                const value = context.raw.y;
                return Math.max(7, Math.min(18, value / 40));
            }
        }]
    };
    
    // Chart configuration
    const config = {
        type: 'scatter',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const item = context.raw;
                            return `${item.name}: $${item.y} (Priority: ${item.x})`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    min: 0.5,
                    max: 3.5,
                    title: {
                        display: true,
                        text: 'Priority (Higher = More Important)',
                        font: {
                            family: "'Libre Franklin', sans-serif",
                            size: 12
                        }
                    },
                    ticks: {
                        stepSize: 1,
                        font: {
                            family: "'Libre Franklin', sans-serif"
                        },
                        callback: function(value) {
                            if (value === 1) return 'Low';
                            if (value === 2) return 'Medium';
                            if (value === 3) return 'High';
                            return '';
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Price ($)',
                        font: {
                            family: "'Libre Franklin', sans-serif",
                            size: 12
                        }
                    },
                    ticks: {
                        font: {
                            family: "'Libre Franklin', sans-serif"
                        },
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            }
        }
    };
    
    // Create the chart
    new Chart(ctx, config);
}

// Update charts when date range changes
function updateChartsForDateRange(range) {
    // In a real app, this would fetch new data based on the range
    // For this demo, we'll just show a message
    console.log(`Date range changed to: ${range} days`);
    
    // You could reinitialize the charts here with new data
    // For simplicity, we'll just reload the page
    // In a real app, you would make API calls to get new data
    
    // Show loading state
    document.querySelectorAll('.chart-container').forEach(container => {
        container.style.opacity = '0.5';
    });
    
    // Simulate loading new data
    setTimeout(() => {
        document.querySelectorAll('.chart-container').forEach(container => {
            container.style.opacity = '1';
        });
        
        // Reinitialize charts with slightly different data
        // This is just for demonstration
        initBudgetComparisonChart();
        initCategoryChart();
        initSavingsChart();
        initPriorityPriceChart();
    }, 800);
}
