const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'public', 'badges');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const svgs = {
  'staff': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#5865F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/><path d="m4 20 2-2"/><path d="m15 4 5 5"/></svg>`,
  
  'helper': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2v1"/></svg>`,
  
  'premium': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#A855F7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 12L2 9z" fill="#A855F7" fill-opacity="0.2"/><path d="M11 3 8 9l4 12 4-12-3-6"/><path d="M2 9h20"/></svg>`,
  
  'verified': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" fill="#3B82F6" fill-opacity="0.2"/><path d="m9 12 2 2 4-4" stroke-width="2.5"/></svg>`,
  
  'donor': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" fill="#10B981" fill-opacity="0.2"/><path d="M12 6v12"/><path d="M15 9.5a2.5 2.5 0 0 0-5 0c0 4 6 2 6 6a2.5 2.5 0 0 1-5 0"/></svg>`,
  
  'gifter': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="13" rx="2" fill="#F97316" fill-opacity="0.2"/><path d="M12 8v13"/><path d="M3 13h18"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>`,
  
  'image-host': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#10B981" fill-opacity="0.25"/></svg>`,
  
  'domain-legend': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" fill="#EF4444" fill-opacity="0.2"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
  
  'og': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#EAB308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3h16v7l-8 5-8-5V3z" fill="#EAB308" fill-opacity="0.2"/><circle cx="12" cy="17" r="4" fill="#EAB308" fill-opacity="0.3"/><path d="M8 3v7l4 2.5L16 10V3"/></svg>`,
  
  'booster': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" fill="#F97316" fill-opacity="0.25"/></svg>`,
  
  'bug-hunter': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="12" x="8" y="8" rx="4" fill="#10B981" fill-opacity="0.2"/><path d="m19 7-3 3"/><path d="m5 7 3 3"/><path d="m19 19-3-3"/><path d="m5 19 3-3"/><path d="M20 14h-4"/><path d="M4 14h4"/><path d="m9 4 1 2"/><path d="m15 4-1 2"/></svg>`,
  
  'summer-2026': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4" fill="#F59E0B" fill-opacity="0.3"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
  
  'easter-2026': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#A855F7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11V4a2 2 0 0 1 4 0v7"/><path d="M17 11V4a2 2 0 0 0-4 0v7"/><ellipse cx="12" cy="15" rx="7" ry="6" fill="#A855F7" fill-opacity="0.2"/><circle cx="10" cy="14" r="1" fill="#A855F7"/><circle cx="14" cy="14" r="1" fill="#A855F7"/></svg>`,
  
  'christmas-2025': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="m17 5-5 5-5-5"/><path d="m17 19-5-5-5 5"/><path d="M2 12h20"/><path d="m5 7 5 5-5 5"/><path d="m19 7-5 5 5 5"/><path d="m4 4 16 16"/><path d="m20 4-16 16"/></svg>`,
  
  'easter-2025': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#EC4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C7 2 4 8 4 14a8 8 0 0 0 16 0c0-6-3-12-8-12z" fill="#EC4899" fill-opacity="0.2"/><path d="M4.5 12h15"/><path d="m7 15 2.5-2.5 2.5 2.5 2.5-2.5 2.5 2.5"/><path d="m7 9 2.5 2.5 2.5-2.5 2.5 2.5 2.5-2.5"/></svg>`,
  
  'christmas-2024': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21V9a5 5 0 0 1 10 0v2"/><path d="m9 18 3-3"/><path d="m9 14 5-5"/><path d="m11 9 4-4"/><path d="m16 8 3-3"/></svg>`,
  
  'the-1k': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.8 11.3 2 22l10.7-3.79" fill="#14B8A6" fill-opacity="0.2"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><circle cx="15" cy="10" r="6" fill="#14B8A6" fill-opacity="0.15"/><text x="15" y="13" font-size="6" font-weight="bold" fill="#14B8A6" text-anchor="middle" font-family="sans-serif" stroke="none">1K</text></svg>`,
  
  'winner': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#EAB308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2"/><path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2"/><path d="M6 3h12v7a6 6 0 0 1-12 0V3z" fill="#EAB308" fill-opacity="0.25"/><path d="M12 16v4"/><path d="M8 20h8"/></svg>`,
  
  'second-place': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="7" fill="#94A3B8" fill-opacity="0.2"/><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12"/><text x="12" y="16" font-size="8" font-weight="bold" fill="#94A3B8" text-anchor="middle" font-family="sans-serif" stroke="none">2</text></svg>`,
  
  'third-place': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="7" fill="#D97706" fill-opacity="0.2"/><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12"/><text x="12" y="16" font-size="8" font-weight="bold" fill="#D97706" text-anchor="middle" font-family="sans-serif" stroke="none">3</text></svg>`,
  
  'christmas-2026': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8" fill="#06B6D4" fill-opacity="0.15"/><path d="m9 12 2 2 4-4"/><path d="M12 2a3 3 0 0 1 3 3v1"/></svg>`,
  
  'easter-2027': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#F472B6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8 2 5 7 5 13a7 7 0 0 0 14 0c0-6-3-11-7-11z" fill="#F472B6" fill-opacity="0.2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>`,
  
  'summer-2027': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5" fill="#F59E0B" fill-opacity="0.25"/><path d="M12 1v3"/><path d="M12 20v3"/><path d="M1 12h3"/><path d="M20 12h3"/><path d="m4.22 4.22 2.12 2.12"/><path d="m17.66 17.66 2.12 2.12"/><path d="m4.22 19.78 2.12-2.12"/><path d="m17.66 6.34 2.12-2.12"/></svg>`,
  
  'founder': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#EC4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" fill="#EC4899" fill-opacity="0.2"/></svg>`,
  
  'developer': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  
  'early-supporter': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="#8B5CF6" fill-opacity="0.2"/></svg>`
};

for (const [name, content] of Object.entries(svgs)) {
  fs.writeFileSync(path.join(outDir, `${name}.svg`), content.trim(), 'utf-8');
}

console.log('Successfully generated', Object.keys(svgs).length, 'badge SVG icons in public/badges!');
