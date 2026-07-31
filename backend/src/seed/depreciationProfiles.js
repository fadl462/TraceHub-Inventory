// Real-world-informed default depreciation profiles by asset category.
// These seed the "AI-Driven Disposable Period" engine's knowledge base and can
// be edited per-company or refined later via refineWithAI() in the engine.
module.exports = [
  { name: 'Laptops & Computers', usefulLifeYears: 4, scrapValuePercent: 10 },
  { name: 'Mobile Phones & Tablets', usefulLifeYears: 3, scrapValuePercent: 8 },
  { name: 'Office Furniture', usefulLifeYears: 8, scrapValuePercent: 15 },
  { name: 'Office Equipment (Printers, Scanners)', usefulLifeYears: 5, scrapValuePercent: 10 },
  { name: 'Industrial Machinery', usefulLifeYears: 12, scrapValuePercent: 20 },
  { name: 'Vehicles', usefulLifeYears: 8, scrapValuePercent: 25 },
  { name: 'Generators', usefulLifeYears: 10, scrapValuePercent: 15 },
  { name: 'Forklifts & Material Handling', usefulLifeYears: 10, scrapValuePercent: 20 },
  { name: 'Appliances', usefulLifeYears: 7, scrapValuePercent: 10 },
  { name: 'Tools & Hand Equipment', usefulLifeYears: 5, scrapValuePercent: 12 },
  { name: 'Networking & IT Infrastructure', usefulLifeYears: 5, scrapValuePercent: 8 },
  { name: 'Other / General Equipment', usefulLifeYears: 5, scrapValuePercent: 10 },
];
