const fs = require('fs');

const { data, avg } = JSON.parse(fs.readFileSync('temp_data.json', 'utf8'));
const html = fs.readFileSync('chart.html', 'utf8');
const dataStr = JSON.stringify(data, null, 2);
const avgStr = avg.toFixed(2);
const updatedHtml = html.replace(/const data = \[[\s\S]*?\];/, 'const data = ' + dataStr + ';')
                        .replace(/const avg = discounts\.reduce[\s\S]*?\/ discounts\.length;/, 'const avg = ' + avgStr + ';');
fs.writeFileSync('chart.html', updatedHtml);
fs.unlinkSync('temp_data.json');