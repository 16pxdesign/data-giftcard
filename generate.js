const fs = require('fs');

const { data, avg } = JSON.parse(fs.readFileSync('temp_data.json', 'utf8'));
const dataStr = JSON.stringify(data, null, 2);
const avgStr = avg.toFixed(2);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gift Card Rewards Chart</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <h1>Tesco Gift Card Rewards Over Time</h1>
    <canvas id="rewardsChart" width="800" height="400"></canvas>

    <script>
        const data = ${dataStr};

        const avg = ${avgStr};

        const ctx = document.getElementById('rewardsChart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => d.date),
                datasets: [{
                    label: 'Tesco Rewards %',
                    data: data.map(d => d.totalRewardsPerc),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }, {
                    label: 'Average',
                    data: data.map(() => avg),
                    borderColor: 'rgb(255, 99, 132)',
                    borderDash: [5, 5],
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    </script>
</body>
</html>`;

fs.writeFileSync('chart.html', html);
fs.unlinkSync('temp_data.json');