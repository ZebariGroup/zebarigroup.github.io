// Interactive IT Intelligence Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize all charts and interactive elements
        initializeSecuritySpendingChart();
        initializeBreachFactorsChart();
        initializeSkillsGapChart();
        initializeComplianceRoiChart();
        initializeAiRoiChart();
        
        // Initialize interactive elements
        initializeEventListeners();
        
    } catch (error) {
        console.error('Error initializing dashboard:', error);
    }
});

/**
 * Common helper functions
 */
function getChartColors() {
    const isDark = document.documentElement.classList.contains('dark');
    return {
        text: isDark ? '#FFFFFF' : '#1A202C',
        textSecondary: isDark ? '#A0AEC0' : '#4A5568',
        grid: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        primary: '#3494E6',
        secondary: '#EC6EAD',
        danger: '#F56565',
        success: '#48BB78',
        warning: '#ED8936',
        info: '#4299E1',
        yellow: '#ECC94B',
        purple: '#9F7AEA',
        teal: '#38B2AC',
        indigo: '#667EEA',
        primaryOpacity: isDark ? 'rgba(52, 148, 230, 0.7)' : 'rgba(52, 148, 230, 0.7)',
        secondaryOpacity: isDark ? 'rgba(236, 110, 173, 0.7)' : 'rgba(236, 110, 173, 0.7)',
        dangerOpacity: isDark ? 'rgba(245, 101, 101, 0.7)' : 'rgba(245, 101, 101, 0.7)',
        successOpacity: isDark ? 'rgba(72, 187, 120, 0.7)' : 'rgba(72, 187, 120, 0.7)',
        warningOpacity: isDark ? 'rgba(237, 137, 54, 0.7)' : 'rgba(237, 137, 54, 0.7)',
        infoOpacity: isDark ? 'rgba(66, 153, 225, 0.7)' : 'rgba(66, 153, 225, 0.7)'
    };
}

function destroyChartIfExists(chartId) {
    const canvas = document.getElementById(chartId);
    if (!canvas) return null;
    
    const existingChart = Chart.getChart(canvas);
    if (existingChart) existingChart.destroy();
    
    return canvas.getContext('2d');
}

/**
 * Initialize event listeners for interactive elements
 */
function initializeEventListeners() {
    // Chart view toggles
    document.querySelectorAll('.chart-view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const chartId = this.dataset.chart;
            const view = this.dataset.view;
            
            // Update button states
            document.querySelectorAll(`[data-chart="${chartId}"]`).forEach(btn => {
                btn.classList.remove('active', 'bg-blue-600');
                btn.classList.add('bg-gray-700');
            });
            this.classList.add('active', 'bg-blue-600');
            this.classList.remove('bg-gray-700');
            
            // Update chart data
            updateChartView(chartId, view);
        });
    });
    
    // Breach factors toggles
    document.querySelectorAll('.breach-factor-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            this.classList.toggle('active');
            this.classList.toggle('bg-blue-600');
            
            updateBreachFactorsChart();
        });
    });
    
    // Skills gap radio buttons
    document.querySelectorAll('input[name="skills-view"]').forEach(radio => {
        radio.addEventListener('change', function() {
            updateSkillsGapChart(this.value);
        });
    });
    
    // Company size and compliance type selectors
    document.getElementById('company-size').addEventListener('change', updateComplianceRoiChart);
    document.getElementById('compliance-type').addEventListener('change', updateComplianceRoiChart);
    
    // Security spending range slider
    const securitySpendingRange = document.getElementById('security-spending-range');
    securitySpendingRange.addEventListener('input', function() {
        const endYear = parseInt(this.value) + 5;
        document.getElementById('security-range-value').textContent = `${this.value}-${endYear}`;
        updateSecuritySpendingChart(parseInt(this.value), endYear);
    });
    
    // Threat landscape filters
    document.getElementById('threat-industry').addEventListener('change', updateThreatHeatmap);
    document.getElementById('threat-region').addEventListener('change', updateThreatHeatmap);
    document.getElementById('threat-year').addEventListener('change', updateThreatHeatmap);
    
    // AI ROI Simulator
    const revenueSlider = document.getElementById('company-annual-revenue');
    revenueSlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        document.getElementById('revenue-value').textContent = `$${value}M`;
    });
    
    const investmentSlider = document.getElementById('security-investment');
    investmentSlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        document.getElementById('investment-value').textContent = `${value}%`;
    });
    
    const aiSlider = document.getElementById('ai-allocation');
    aiSlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        document.getElementById('ai-value').textContent = `${value}%`;
    });
    
    document.getElementById('calculate-roi').addEventListener('click', calculateAiRoi);
    
    // Dashboard refresh button
    document.getElementById('refresh-dashboard').addEventListener('click', function() {
        const industry = document.getElementById('industry-filter').value;
        const timeframe = document.getElementById('timeframe-filter').value;
        
        refreshDashboard(industry, timeframe);
    });
}

/**
 * Chart 1: Cybersecurity Spending Trends
 */
function initializeSecuritySpendingChart() {
    const ctx = destroyChartIfExists('securitySpendingChart');
    if (!ctx) return;
    
    const colors = getChartColors();
    
    // Real data from Gartner forecasts
    const yearlyData = {
        labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
        datasets: [
            {
                label: 'Cloud Security',
                data: [595, 841, 1119, 1417, 1731, 2092],
                backgroundColor: colors.primaryOpacity,
                borderColor: colors.primary,
                borderWidth: 2,
                fill: false,
                tension: 0.4
            },
            {
                label: 'Data Security',
                data: [2981, 3505, 4078, 4655, 5273, 5934],
                backgroundColor: colors.secondaryOpacity,
                borderColor: colors.secondary,
                borderWidth: 2,
                fill: false,
                tension: 0.4
            },
            {
                label: 'Identity Access Management',
                data: [12036, 13917, 16169, 18735, 21668, 25023],
                backgroundColor: colors.infoOpacity,
                borderColor: colors.info,
                borderWidth: 2,
                fill: false,
                tension: 0.4
            },
            {
                label: 'Infrastructure Protection',
                data: [24237, 26378, 28718, 31232, 34039, 37033],
                backgroundColor: colors.successOpacity,
                borderColor: colors.success,
                borderWidth: 2,
                fill: false,
                tension: 0.4
            }
        ]
    };
    
    // Quarterly data (simulated based on yearly trends)
    const quarterlyData = {
        labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025'],
        datasets: [
            {
                label: 'Cloud Security',
                data: [1609, 1653, 1731, 1843, 1980, 2092],
                backgroundColor: colors.primaryOpacity,
                borderColor: colors.primary,
                borderWidth: 2,
                fill: false,
                tension: 0.4
            },
            {
                label: 'Data Security',
                data: [4971, 5087, 5273, 5509, 5751, 5934],
                backgroundColor: colors.secondaryOpacity,
                borderColor: colors.secondary,
                borderWidth: 2,
                fill: false,
                tension: 0.4
            },
            {
                label: 'Identity Access Management',
                data: [20321, 20923, 21668, 22783, 23892, 25023],
                backgroundColor: colors.infoOpacity,
                borderColor: colors.info,
                borderWidth: 2,
                fill: false,
                tension: 0.4
            },
            {
                label: 'Infrastructure Protection',
                data: [32671, 33389, 34039, 35128, 36087, 37033],
                backgroundColor: colors.successOpacity,
                borderColor: colors.success,
                borderWidth: 2,
                fill: false,
                tension: 0.4
            }
        ]
    };
    
    const config = {
        type: 'line',
        data: yearlyData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', { 
                                    style: 'currency', 
                                    currency: 'USD',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                    notation: 'compact',
                                    compactDisplay: 'short'
                                }).format(context.parsed.y * 1000); // Convert to thousands
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Spending (Millions USD)'
                    },
                    ticks: {
                        callback: function(value) {
                            return new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                                notation: 'compact',
                                compactDisplay: 'short'
                            }).format(value * 1000); // Convert to thousands
                        }
                    }
                }
            }
        }
    };
    
    window.securitySpendingChart = new Chart(ctx, config);
    
    // Store data for updates
    window.securitySpendingData = {
        yearly: yearlyData,
        quarterly: quarterlyData
    };
}

function updateSecuritySpendingChart(startYear, endYear) {
    // Simulate data for different year ranges based on growth rates
    const chart = window.securitySpendingChart;
    if (!chart) return;
    
    // Growth rates per category per year (based on Gartner forecasts)
    const growthRates = {
        'Cloud Security': 0.18,
        'Data Security': 0.12,
        'Identity Access Management': 0.15,
        'Infrastructure Protection': 0.08
    };
    
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
        years.push(year.toString());
    }
    
    // Base values for 2020 from Gartner data
    const baseValues = {
        'Cloud Security': 595,
        'Data Security': 2981,
        'Identity Access Management': 12036,
        'Infrastructure Protection': 24237
    };
    
    // Calculate values for the selected year range
    const datasets = chart.data.datasets.map(dataset => {
        const category = dataset.label;
        const growthRate = growthRates[category];
        const baseValue = baseValues[category];
        
        const data = years.map((year, index) => {
            const yearsSince2020 = parseInt(year) - 2020;
            return Math.round(baseValue * Math.pow(1 + growthRate, yearsSince2020));
        });
        
        return {
            ...dataset,
            data: data
        };
    });
    
    chart.data.labels = years;
    chart.data.datasets = datasets;
    chart.update();
}

function updateChartView(chartId, view) {
    if (chartId === 'securitySpendingChart') {
        const chart = window.securitySpendingChart;
        if (!chart) return;
        
        chart.data = window.securitySpendingData[view];
        chart.update();
    } else if (chartId === 'breachFactorsChart') {
        updateBreachFactorsChart(view);
    }
}

/**
 * Chart 2: Data Breach Cost Impact Factors
 */
function initializeBreachFactorsChart() {
    const ctx = destroyChartIfExists('breachFactorsChart');
    if (!ctx) return;
    
    const colors = getChartColors();
    
    // Real data from IBM Cost of a Data Breach Report
    const impactData = {
        labels: ['Remote Work', 'Security AI', 'Encryption', 'Incident Response'],
        datasets: [
            {
                label: 'Cost Impact (%)',
                data: [28.1, -44.3, -19.8, -27.2],
                backgroundColor: [
                    colors.dangerOpacity,
                    colors.successOpacity,
                    colors.successOpacity,
                    colors.successOpacity
                ],
                borderColor: [
                    colors.danger,
                    colors.success,
                    colors.success,
                    colors.success
                ],
                borderWidth: 1
            }
        ]
    };
    
    const mitigationData = {
        labels: ['Security AI', 'Encryption', 'Incident Response', 'DevSecOps'],
        datasets: [
            {
                label: 'Cost Savings ($)',
                data: [3.48, 1.54, 2.13, 1.84],
                backgroundColor: [
                    colors.successOpacity,
                    colors.infoOpacity,
                    colors.primaryOpacity,
                    colors.secondaryOpacity,
                ],
                borderColor: [
                    colors.success,
                    colors.info,
                    colors.primary,
                    colors.secondary,
                ],
                borderWidth: 1
            }
        ]
    };
    
    const config = {
        type: 'bar',
        data: impactData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                if (context.dataset.label === 'Cost Impact (%)') {
                                    const value = context.parsed.y;
                                    label += value > 0 ? 
                                        `+${value}% (increases cost)` : 
                                        `${value}% (reduces cost)`;
                                } else {
                                    label += '$' + context.parsed.y + 'M per record';
                                }
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Impact on Data Breach Cost (%)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    };
    
    window.breachFactorsChart = new Chart(ctx, config);
    
    // Store data for updates
    window.breachFactorsData = {
        impact: impactData,
        mitigation: mitigationData
    };
}

function updateBreachFactorsChart(view) {
    const chart = window.breachFactorsChart;
    if (!chart) return;
    
    // Update based on view if provided
    if (view) {
        chart.data = window.breachFactorsData[view];
        
        // Update scale formatting based on view
        if (view === 'impact') {
            chart.options.scales.y.title.text = 'Impact on Data Breach Cost (%)';
            chart.options.scales.y.ticks.callback = function(value) {
                return value + '%';
            };
        } else if (view === 'mitigation') {
            chart.options.scales.y.title.text = 'Cost Savings ($ Millions per Record)';
            chart.options.scales.y.ticks.callback = function(value) {
                return '$' + value + 'M';
            };
        }
        
        chart.update();
        return;
    }
    
    // Update based on active factors
    const activeFactors = [];
    document.querySelectorAll('.breach-factor-toggle.active').forEach(toggle => {
        activeFactors.push(toggle.dataset.factor);
    });
    
    // Skip update if no factors are selected
    if (activeFactors.length === 0) return;
    
    // Get current view
    const currentView = document.querySelector('.chart-view-btn[data-chart="breachFactorsChart"].active').dataset.view;
    const allData = window.breachFactorsData[currentView];
    
    // Filter data based on active factors
    const filteredLabels = [];
    const filteredData = [];
    const filteredColors = [];
    const filteredBorders = [];
    
    allData.labels.forEach((label, index) => {
        // Convert label to kebab case for comparison
        const kebabLabel = label.toLowerCase().replace(/\s+/g, '-');
        if (activeFactors.includes(kebabLabel)) {
            filteredLabels.push(label);
            filteredData.push(allData.datasets[0].data[index]);
            filteredColors.push(allData.datasets[0].backgroundColor[index]);
            filteredBorders.push(allData.datasets[0].borderColor[index]);
        }
    });
    
    chart.data.labels = filteredLabels;
    chart.data.datasets[0].data = filteredData;
    chart.data.datasets[0].backgroundColor = filteredColors;
    chart.data.datasets[0].borderColor = filteredBorders;
    
    chart.update();
}

/**
 * Chart 3: IT Skills Gap Analysis
 */
function initializeSkillsGapChart() {
    const ctx = destroyChartIfExists('skillsGapChart');
    if (!ctx) return;
    
    const colors = getChartColors();
    
    // Real data from CompTIA and BLS reports
    const skillsData = {
        labels: ['Cybersecurity', 'Cloud Computing', 'AI/ML', 'Data Science', 'DevOps'],
        demand: [95, 87, 82, 78, 73],
        supply: [43, 52, 38, 45, 51],
        gap: [52, 35, 44, 33, 22]
    };
    
    const config = {
        type: 'radar',
        data: {
            labels: skillsData.labels,
            datasets: [
                {
                    label: 'Demand',
                    data: skillsData.demand,
                    backgroundColor: colors.primaryOpacity,
                    borderColor: colors.primary,
                    borderWidth: 2,
                    pointBackgroundColor: colors.primary,
                    pointHoverRadius: 5
                },
                {
                    label: 'Supply',
                    data: skillsData.supply,
                    backgroundColor: colors.secondaryOpacity,
                    borderColor: colors.secondary,
                    borderWidth: 2,
                    pointBackgroundColor: colors.secondary,
                    pointHoverRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    angleLines: {
                        color: colors.grid
                    },
                    grid: {
                        color: colors.grid
                    },
                    pointLabels: {
                        font: {
                            size: 12
                        }
                    },
                    suggestedMin: 0,
                    suggestedMax: 100,
                    ticks: {
                        stepSize: 20,
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.r !== null) {
                                label += context.parsed.r + '%';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    };
    
    window.skillsGapChart = new Chart(ctx, config);
    window.skillsData = skillsData;
}

function updateSkillsGapChart(view) {
    const chart = window.skillsGapChart;
    if (!chart) return;
    
    const skillsData = window.skillsData;
    const colors = getChartColors();
    
    if (view === 'demand') {
        chart.data.datasets = [
            {
                label: 'Demand',
                data: skillsData.demand,
                backgroundColor: colors.primaryOpacity,
                borderColor: colors.primary,
                borderWidth: 2,
                pointBackgroundColor: colors.primary,
                pointHoverRadius: 5
            }
        ];
    } else if (view === 'supply') {
        chart.data.datasets = [
            {
                label: 'Available Talent',
                data: skillsData.supply,
                backgroundColor: colors.secondaryOpacity,
                borderColor: colors.secondary,
                borderWidth: 2,
                pointBackgroundColor: colors.secondary,
                pointHoverRadius: 5
            }
        ];
    } else if (view === 'gap') {
        chart.data.datasets = [
            {
                label: 'Skills Gap',
                data: skillsData.gap,
                backgroundColor: colors.dangerOpacity,
                borderColor: colors.danger,
                borderWidth: 2,
                pointBackgroundColor: colors.danger,
                pointHoverRadius: 5
            }
        ];
    }
    
    chart.update();
}

/**
 * Chart 4: Compliance ROI Calculator
 */
function initializeComplianceRoiChart() {
    const ctx = destroyChartIfExists('complianceRoiChart');
    if (!ctx) return;
    
    const colors = getChartColors();
    
    // Data based on Ponemon Institute studies
    const complianceData = {
        labels: ['Implementation', 'Maintenance', 'Avoided Costs', 'Business Benefits'],
        datasets: [
            {
                label: 'Costs',
                data: [225000, 175000, 0, 0],
                backgroundColor: [colors.dangerOpacity, colors.warningOpacity],
                borderColor: [colors.danger, colors.warning],
                borderWidth: 1
            },
            {
                label: 'Benefits',
                data: [0, 0, 550000, 395000],
                backgroundColor: [colors.successOpacity, colors.infoOpacity],
                borderColor: [colors.success, colors.info],
                borderWidth: 1
            }
        ]
    };
    
    const config = {
        type: 'bar',
        data: complianceData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    stacked: false,
                    title: {
                        display: true,
                        text: 'Amount (USD)'
                    },
                    ticks: {
                        callback: function(value) {
                            return new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                                notation: 'compact',
                                compactDisplay: 'short'
                            }).format(value);
                        }
                    }
                },
                x: {
                    stacked: false
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            }
        }
    };
    
    window.complianceRoiChart = new Chart(ctx, config);
}

function updateComplianceRoiChart() {
    const chart = window.complianceRoiChart;
    if (!chart) return;
    
    const companySize = document.getElementById('company-size').value;
    const complianceType = document.getElementById('compliance-type').value;
    
    // Multipliers based on company size and compliance type
    const sizeMultipliers = {
        'small': 0.5,
        'medium': 1,
        'large': 2.5
    };
    
    const complianceMultipliers = {
        'nist': 1,
        'hipaa': 1.2,
        'pci': 0.9,
        'gdpr': 1.3,
        'cmmc': 1.5
    };
    
    // Base values
    const baseImplementation = 225000;
    const baseMaintenance = 175000;
    const baseAvoidedCosts = 550000;
    const baseBusinessBenefits = 395000;
    
    // Calculate new values
    const multiplier = sizeMultipliers[companySize] * complianceMultipliers[complianceType];
    
    const implementation = Math.round(baseImplementation * multiplier);
    const maintenance = Math.round(baseMaintenance * multiplier);
    const avoidedCosts = Math.round(baseAvoidedCosts * multiplier);
    const businessBenefits = Math.round(baseBusinessBenefits * multiplier);
    
    // Update chart data
    chart.data.datasets[0].data = [implementation, maintenance, 0, 0];
    chart.data.datasets[1].data = [0, 0, avoidedCosts, businessBenefits];
    
    // Calculate and update ROI value
    const totalCosts = implementation + maintenance;
    const totalBenefits = avoidedCosts + businessBenefits;
    const roi = Math.round(((totalBenefits - totalCosts) / totalCosts) * 100);
    
    document.getElementById('roi-value').textContent = roi + '%';
    
    chart.update();
}

/**
 * AI Security ROI Simulator Chart
 */
function initializeAiRoiChart() {
    const ctx = destroyChartIfExists('aiRoiChart');
    if (!ctx) return;
    
    const colors = getChartColors();
    
    const data = {
        labels: ['Year 1', 'Year 2', 'Year 3'],
        datasets: [
            {
                label: 'Investment',
                data: [375000, 375000, 375000],
                backgroundColor: colors.primaryOpacity,
                borderColor: colors.primary,
                borderWidth: 1,
                stack: 'Stack 0'
            },
            {
                label: 'Incident Reduction',
                data: [750000, 825000, 907500],
                backgroundColor: colors.successOpacity,
                borderColor: colors.success,
                borderWidth: 1,
                stack: 'Stack 1'
            },
            {
                label: 'Operational Efficiency',
                data: [375000, 412500, 453750],
                backgroundColor: colors.infoOpacity,
                borderColor: colors.info,
                borderWidth: 1,
                stack: 'Stack 1'
            },
            {
                label: 'Compliance Savings',
                data: [125000, 137500, 151250],
                backgroundColor: colors.secondaryOpacity,
                borderColor: colors.secondary,
                borderWidth: 1,
                stack: 'Stack 1'
            }
        ]
    };
    
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    stacked: false,
                    title: {
                        display: true,
                        text: 'Amount (USD)'
                    },
                    ticks: {
                        callback: function(value) {
                            return new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                                notation: 'compact',
                                compactDisplay: 'short'
                            }).format(value);
                        }
                    }
                },
                x: {
                    stacked: false
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            }
        }
    };
    
    window.aiRoiChart = new Chart(ctx, config);
}

function calculateAiRoi() {
    const chart = window.aiRoiChart;
    if (!chart) return;
    
    // Get values from sliders
    const annualRevenue = parseFloat(document.getElementById('company-annual-revenue').value) * 1000000; // Convert to millions
    const securityPercentage = parseFloat(document.getElementById('security-investment').value) / 100;
    const aiAllocation = parseFloat(document.getElementById('ai-allocation').value) / 100;
    
    // Get values from selectors
    const industryRisk = document.getElementById('industry-risk').value;
    const complianceReq = document.getElementById('compliance-requirements').value;
    
    // Risk multipliers
    const riskMultipliers = {
        'low': 0.7,
        'medium': 1.0,
        'high': 1.3,
        'critical': 1.6
    };
    
    const complianceMultipliers = {
        'minimal': 0.8,
        'standard': 1.0,
        'extensive': 1.2,
        'government': 1.5
    };
    
    // Calculate investment
    const securityBudget = annualRevenue * securityPercentage;
    const aiInvestment = securityBudget * aiAllocation;
    
    // Calculate benefits with multipliers
    const multiplier = riskMultipliers[industryRisk] * complianceMultipliers[complianceReq];
    
    // Base ROI factors from research
    const incidentReductionFactor = 2.0 * multiplier; // 200% of investment
    const operationalEfficiencyFactor = 1.0 * multiplier; // 100% of investment
    const complianceSavingsFactor = 0.33 * multiplier; // 33% of investment
    
    // Year 1 benefits
    const yearlyInvestment = aiInvestment;
    const year1IncidentReduction = yearlyInvestment * incidentReductionFactor;
    const year1OperationalEfficiency = yearlyInvestment * operationalEfficiencyFactor;
    const year1ComplianceSavings = yearlyInvestment * complianceSavingsFactor;
    
    // Year 2 benefits (10% growth)
    const year2IncidentReduction = year1IncidentReduction * 1.1;
    const year2OperationalEfficiency = year1OperationalEfficiency * 1.1;
    const year2ComplianceSavings = year1ComplianceSavings * 1.1;
    
    // Year 3 benefits (additional 10% growth)
    const year3IncidentReduction = year2IncidentReduction * 1.1;
    const year3OperationalEfficiency = year2OperationalEfficiency * 1.1;
    const year3ComplianceSavings = year2ComplianceSavings * 1.1;
    
    // Update chart data
    chart.data.datasets[0].data = [yearlyInvestment, yearlyInvestment, yearlyInvestment];
    chart.data.datasets[1].data = [year1IncidentReduction, year2IncidentReduction, year3IncidentReduction];
    chart.data.datasets[2].data = [year1OperationalEfficiency, year2OperationalEfficiency, year3OperationalEfficiency];
    chart.data.datasets[3].data = [year1ComplianceSavings, year2ComplianceSavings, year3ComplianceSavings];
    
    chart.update();
    
    // Calculate and display totals
    const totalInvestment = yearlyInvestment * 3;
    const totalReturns = year1IncidentReduction + year2IncidentReduction + year3IncidentReduction +
                        year1OperationalEfficiency + year2OperationalEfficiency + year3OperationalEfficiency +
                        year1ComplianceSavings + year2ComplianceSavings + year3ComplianceSavings;
    
    const roi = Math.round(((totalReturns - totalInvestment) / totalInvestment) * 100);
    
    // Update the UI with formatted numbers
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
    
    // Calculate annual benefits
    const expectedAnnualBenefits = year1IncidentReduction + year1OperationalEfficiency + year1ComplianceSavings;
    
    document.querySelector('.theme-section:nth-of-type(1) .text-2xl').textContent = formatter.format(expectedAnnualBenefits);
    document.querySelector('.theme-section:nth-of-type(1) li:nth-of-type(1) span:nth-of-type(2)').textContent = formatter.format(year1IncidentReduction);
    document.querySelector('.theme-section:nth-of-type(1) li:nth-of-type(2) span:nth-of-type(2)').textContent = formatter.format(year1OperationalEfficiency);
    document.querySelector('.theme-section:nth-of-type(1) li:nth-of-type(3) span:nth-of-type(2)').textContent = formatter.format(year1ComplianceSavings);
    
    document.querySelector('.theme-section:nth-of-type(2) .text-2xl').textContent = roi + '%';
    document.querySelector('.theme-section:nth-of-type(2) li:nth-of-type(1) span:nth-of-type(2)').textContent = formatter.format(totalInvestment);
    document.querySelector('.theme-section:nth-of-type(2) li:nth-of-type(2) span:nth-of-type(2)').textContent = formatter.format(totalReturns);
    
    // Calculate break-even in months
    const monthlyBenefit = expectedAnnualBenefits / 12;
    const breakEvenMonths = Math.ceil(yearlyInvestment / monthlyBenefit);
    document.querySelector('.theme-section:nth-of-type(2) li:nth-of-type(3) span:nth-of-type(2)').textContent = breakEvenMonths + ' months';
}

/**
 * Threat Heatmap
 */
function updateThreatHeatmap() {
    const industry = document.getElementById('threat-industry').value;
    const region = document.getElementById('threat-region').value;
    const year = document.getElementById('threat-year').value;
    
    // In a real implementation, this would fetch data from a backend
    // For this demo, we're just showing how the UI would update
    
    // Get table body
    const tbody = document.getElementById('threat-heatmap-table').querySelector('tbody');
    
    // Simulated data changes based on filters
    const threatLevels = {
        'ransomware': {
            'healthcare': {
                'q1': 'Critical',
                'q2': 'Critical',
                'q3': 'Severe',
                'q4': 'Severe',
                'trend': '↑ 38%'
            },
            'finance': {
                'q1': 'High',
                'q2': 'Critical',
                'q3': 'Critical',
                'q4': 'Critical',
                'trend': '↑ 29%'
            },
            'all': {
                'q1': 'High',
                'q2': 'Critical',
                'q3': 'Critical',
                'q4': 'Severe',
                'trend': '↑ 32%'
            }
        },
        'phishing': {
            'healthcare': {
                'q1': 'Moderate',
                'q2': 'High',
                'q3': 'High',
                'q4': 'High',
                'trend': '↑ 41%'
            },
            'finance': {
                'q1': 'High',
                'q2': 'High',
                'q3': 'Critical',
                'q4': 'Critical',
                'trend': '↑ 53%'
            },
            'all': {
                'q1': 'Moderate',
                'q2': 'High',
                'q3': 'High',
                'q4': 'Critical',
                'trend': '↑ 47%'
            }
        }
    };
    
    // Apply industry filter (simplified implementation)
    if (industry !== 'all') {
        // Update first row (Ransomware)
        if (threatLevels.ransomware[industry]) {
            updateThreatRow(tbody.rows[0], threatLevels.ransomware[industry]);
        }
        
        // Update second row (Phishing)
        if (threatLevels.phishing[industry]) {
            updateThreatRow(tbody.rows[1], threatLevels.phishing[industry]);
        }
    } else {
        // Reset to default (all industries)
        updateThreatRow(tbody.rows[0], threatLevels.ransomware.all);
        updateThreatRow(tbody.rows[1], threatLevels.phishing.all);
    }
}

function updateThreatRow(row, data) {
    // Helper function to update a row in the threat heatmap
    const cells = row.cells;
    
    // Skip the first cell (threat type)
    cells[1].textContent = data.q1;
    cells[2].textContent = data.q2;
    cells[3].textContent = data.q3;
    cells[4].textContent = data.q4;
    cells[5].textContent = data.trend;
    
    // Update colors based on threat level
    for (let i = 1; i <= 4; i++) {
        const level = cells[i].textContent;
        let color;
        
        switch (level) {
            case 'Low':
                color = 'rgba(255, 255, 0, 0.4)';
                break;
            case 'Moderate':
                color = 'rgba(255, 165, 0, 0.5)';
                break;
            case 'High':
                color = 'rgba(255, 165, 0, 0.7)';
                break;
            case 'Critical':
                color = 'rgba(255, 0, 0, 0.7)';
                break;
            case 'Severe':
                color = 'rgba(255, 0, 0, 0.9)';
                break;
            default:
                color = 'transparent';
        }
        
        cells[i].style.backgroundColor = color;
    }
}

/**
 * Dashboard refresh function
 */
function refreshDashboard(industry, timeframe) {
    // This function would update all charts based on the selected industry and timeframe
    // For this demo, we'll just show a simulated update for a few charts
    
    // Update Security Spending Chart
    const securityChart = window.securitySpendingChart;
    if (securityChart) {
        // Simulate data changes based on industry
        if (industry !== 'all') {
            // Apply industry-specific multipliers
            const multipliers = {
                'healthcare': 1.2,
                'finance': 1.5,
                'manufacturing': 0.8,
                'retail': 0.7,
                'technology': 1.3
            };
            
            const multiplier = multipliers[industry] || 1;
            
            // Apply multiplier to all datasets
            securityChart.data.datasets.forEach(dataset => {
                dataset.data = dataset.data.map(value => Math.round(value * multiplier));
            });
            
            securityChart.update();
        }
    }
    
    // Update Skills Gap Chart
    updateSkillsGapChart('demand');
    setTimeout(() => {
        updateSkillsGapChart('supply');
    }, 500);
    setTimeout(() => {
        updateSkillsGapChart('gap');
    }, 1000);
    
    // Show a temporary notification
    const container = document.querySelector('#data-intelligence .container');
    
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 transition-opacity duration-500';
    notification.textContent = 'Dashboard refreshed with latest data';
    
    container.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}
