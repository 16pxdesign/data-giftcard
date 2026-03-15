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
  return { date: date.toISOString().split('T')[0], totalRewardsPerc };
}).sort((a, b) => new Date(a.date) - new Date(b.date));

const avg = data.reduce((sum, d) => sum + d.totalRewardsPerc, 0) / data.length;

console.log(JSON.stringify({ data, avg }, null, 2));