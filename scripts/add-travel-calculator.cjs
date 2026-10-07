const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const newCalculator = {
  id: "calc_travel_insurance",
  name: "Travel Insurance Calculator",
  slug: "travel-insurance-calculator",
  subcategoryId: "sub_1791257127047_p7q0v",
  description: "Calculate your travel insurance premium based on trip details, medical coverage, and add-ons.",
  seoTitle: "Travel Insurance Calculator",
  seoDescription: "Easily estimate your travel insurance premiums for single trips or annual plans with our online calculator.",
  seoKeywords: "travel insurance, travel insurance calculator, premium calculator, travel medical insurance",
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const existingIndex = db.calculators.findIndex(c => c.slug === newCalculator.slug);
if (existingIndex !== -1) {
  db.calculators[existingIndex] = { ...db.calculators[existingIndex], ...newCalculator };
  console.log('Updated existing calculator.');
} else {
  db.calculators.push(newCalculator);
  console.log('Added new calculator.');
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Database updated successfully.');
