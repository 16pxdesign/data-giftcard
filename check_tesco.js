const fs = require('fs');
const path = require('path');

const dataDir = './data';
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

const data = files.map(file => {
  const parts = file.replace('.json', '').split('_');
  const datePart = parts[0];
  const timePart = parts[1].replace(/-/g, ':');
  const dateStr = `${datePart}T${timePart}`;
  const date = new Date(dateStr);
  const filePath = path.join(dataDir, file);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const tesco = content.brands.find(b => b.id === 'tesco');
  const totalRewardsPerc = tesco ? tesco.total_rewards_perc * 100 : null;
  return { date: date.toISOString().split('T')[0], totalRewardsPerc, timestamp: date.getTime() };
}).filter(d => d.totalRewardsPerc !== null).sort((a, b) => a.timestamp - b.timestamp);

if (data.length < 2) {
  console.log('Not enough data to compare.');
  process.exit(0);
}

const avg = data.reduce((sum, d) => sum + d.totalRewardsPerc, 0) / data.length;
const latest = data[data.length - 1];
const previous = data[data.length - 2];

console.log(`Average: ${avg.toFixed(2)}%`);
console.log(`Latest (${latest.date}): ${latest.totalRewardsPerc.toFixed(2)}%`);
console.log(`Previous (${previous.date}): ${previous.totalRewardsPerc.toFixed(2)}%`);

if (latest.totalRewardsPerc > avg && latest.totalRewardsPerc > previous.totalRewardsPerc) {
  console.log('Condition met: Notify owner.');
  process.exit(1); // Exit code 1 to indicate notification needed
} else {
  console.log('Condition not met.');
  process.exit(0);
}