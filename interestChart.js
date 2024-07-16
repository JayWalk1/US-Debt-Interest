async function fetchInterestData() {
    console.log("Fetching interest data...");
    const response = await fetch('https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/interest_on_debt?sort=-record_date&page[size]=1000');
    const data = await response.json();
    console.log("Interest data fetched:", data);
    return data.data;
}

async function createInterestChart() {
    try {
        const interestData = await fetchInterestData();
        const labels = interestData.map(record => record.record_date);
        const interestAmounts = interestData.map(record => parseFloat(record.interest_on_public_debt_cash_basis));

        const ctx = document.getElementById('interestChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels.reverse(), // reverse to display chronologically
                datasets: [{
                    label: 'Interest Payments on National Debt (in $ millions)',
                    data: interestAmounts.reverse(), // reverse to display chronologically
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1,
                    fill: true,
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Interest Payments (in $ millions)'
                        },
                        beginAtZero: true
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Interest Payments on US National Debt Since 1960'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error creating interest chart:", error);
        document.getElementById('interestChartContainer').innerHTML = "Error loading interest data";
    }
}

document.addEventListener('DOMContentLoaded', function() {
    createInterestChart();
});
