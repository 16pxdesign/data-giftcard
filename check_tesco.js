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
  console.log('::set-output name=alert::false');
  process.exit(0);
}

const avg = data.reduce((sum, d) => sum + d.totalRewardsPerc, 0) / data.length;
const latest = data[data.length - 1];
const previous = data[data.length - 2];

console.log(`Average: ${avg.toFixed(2)}%`);
console.log(`Latest (${latest.datePart}-${latest.timePart}): ${latest.totalRewardsPerc.toFixed(2)}%`);
console.log(`Previous (${previous.datePart}-${latest.timePart}): ${previous.totalRewardsPerc.toFixed(2)}%`);

if (latest.totalRewardsPerc > avg && latest.totalRewardsPerc > previous.totalRewardsPerc) {
  console.log('Condition met: Notify owner.');
  console.log('::set-output name=alert::true');
  process.exit(0);
} else {
  console.log('Condition not met.');
  console.log('::set-output name=alert::false');
  process.exit(0);
}
