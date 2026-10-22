const fs = require('fs');
const path = require('path');

// Read service-providers.ts and extract PREDEFINED_SERVICE_PROVIDERS
const spTsPath = path.join(__dirname, '..', 'apps', 'web', 'lib', 'data', 'service-providers.ts');
const spTsContent = fs.readFileSync(spTsPath, 'utf8');

// Quick parse of PREDEFINED_SERVICE_PROVIDERS array from TS
const startMarker = 'export const PREDEFINED_SERVICE_PROVIDERS: PredefinedServiceProvider[] = [';
const startIndex = spTsContent.indexOf(startMarker);
if (startIndex === -1) {
  console.error('Could not find start marker in service-providers.ts');
  process.exit(1);
}

const endMarker = '\n];';
const endIndex = spTsContent.indexOf(endMarker, startIndex);
if (endIndex === -1) {
  console.error('Could not find end marker in service-providers.ts');
  process.exit(1);
}

const arrayContent = spTsContent.substring(startIndex + startMarker.length - 1, endIndex + 2);

// Evaluate as JS object safely
let providers;
try {
  providers = eval(arrayContent);
} catch (e) {
  console.error('Failed to parse providers array:', e);
  process.exit(1);
}

console.log(`Found ${providers.length} service providers in service-providers.ts`);

// Write to JSON for easy static access
const jsonPath = path.join(__dirname, '..', 'apps', 'web', 'data', 'service_providers.json');
fs.writeFileSync(jsonPath, JSON.stringify(providers, null, 2), 'utf8');
console.log(`Saved ${providers.length} providers to ${jsonPath}`);

// Now merge into apps/web/data/hosts.json
const hostsJsonPath = path.join(__dirname, '..', 'apps', 'web', 'data', 'hosts.json');
let existingHosts = [];
try {
  if (fs.existsSync(hostsJsonPath)) {
    existingHosts = JSON.parse(fs.readFileSync(hostsJsonPath, 'utf8'));
    if (!Array.isArray(existingHosts)) existingHosts = [];
  }
} catch (err) {
  existingHosts = [];
}

const existingById = new Map();
const existingByName = new Map();
existingHosts.forEach((rec, idx) => {
  if (rec && rec.host) {
    if (rec.host.id) existingById.set(rec.host.id, idx);
    if (rec.host.name) existingByName.set(rec.host.name.toLowerCase().trim(), idx);
  }
});

let addedCount = 0;
let updatedCount = 0;

for (const sp of providers) {
  const hostId = `host-${sp.id}`;
  const normName = sp.name.toLowerCase().trim();

  const hostRecord = {
    id: hostId,
    name: sp.name,
    tradingName: sp.name,
    organisationType: sp.organisationType || 'Company',
    countryCode: sp.countryCode,
    city: sp.city,
    address: `${sp.city}, ${sp.country}`,
    registeredAddress: `${sp.city}, ${sp.country}`,
    websiteUrl: sp.websiteUrl,
    generalEmail: sp.generalEmail,
    verificationStatus: 'VERIFIED',
    contactPerson: sp.contactPerson || 'Erasmus Coordinator',
    contactTitle: 'Erasmus+ Mobility Coordinator',
    contactEmail: (sp.contactEmails && sp.contactEmails[0]) || sp.generalEmail,
    contactPhone: '+49 30 1234567', // placeholder standard international format
    languages: sp.languages || ['EN'],
    workingLanguages: sp.languages || ['EN'],
    maxLearnersPerTerm: 12,
    totalAnnualCapacity: 36,
    activities: sp.activities || ['VET_INTERNSHIP', 'JOB_SHADOWING'],
    primarySector: sp.primarySector || 'ict',
    sectors: sp.sectors || [sp.primarySector || 'ict'],
    shortDescription: sp.activityDescription || `${sp.name} Erasmus+ VET hareketlilik ve staj ev sahibi kuruluşu.`,
    shortDescriptionEn: `${sp.name} provides accredited Erasmus+ hosting, internship and training placements in ${sp.city}, ${sp.country}.`,
    isActive: true,
    isPredefinedProvider: true,
    profileCompletenessScore: 80,
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: new Date().toISOString()
  };

  const storedRecord = {
    host: hostRecord,
    userId: `system_${sp.id}`,
    userEmail: sp.generalEmail,
    userFullName: sp.contactPerson || sp.name
  };

  if (existingById.has(hostId)) {
    const idx = existingById.get(hostId);
    existingHosts[idx] = storedRecord;
    updatedCount++;
  } else if (existingByName.has(normName)) {
    const idx = existingByName.get(normName);
    existingHosts[idx] = {
      ...existingHosts[idx],
      host: {
        ...existingHosts[idx].host,
        ...hostRecord,
        id: existingHosts[idx].host.id || hostId
      }
    };
    updatedCount++;
  } else {
    existingHosts.push(storedRecord);
    addedCount++;
  }
}

fs.writeFileSync(hostsJsonPath, JSON.stringify(existingHosts, null, 2), 'utf8');
console.log(`Successfully updated hosts.json! Added: ${addedCount}, Updated: ${updatedCount}, Total: ${existingHosts.length}`);
