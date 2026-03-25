/**
 * Generate Traditional Chinese name mappings from ffxiv-datamining-tc CSV files.
 * Produces a TypeScript module with item ID -> TC name maps.
 *
 * Usage: node scripts/generate_tc_names.mjs <path-to-datamining-tc>
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';

const dataminingPath = process.argv[2] || 'E:/FFXIV/XIVLauncher/ffxiv-datamining-tc';

/**
 * Parse a CSV file, handling quoted fields with commas and newlines inside.
 * Returns array of rows, each row is array of field strings.
 * Skips the first 3 header rows.
 */
function parseCSV(filePath) {
    const content = readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, ''); // strip BOM
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;
    let headerRowsSkipped = 0;

    for (let i = 0; i < content.length; i++) {
        const ch = content[i];

        if (inQuotes) {
            if (ch === '"') {
                if (i + 1 < content.length && content[i + 1] === '"') {
                    field += '"';
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                field += ch;
            }
        } else {
            if (ch === '"') {
                inQuotes = true;
            } else if (ch === ',') {
                row.push(field);
                field = '';
            } else if (ch === '\n' || ch === '\r') {
                if (ch === '\r' && i + 1 < content.length && content[i + 1] === '\n') {
                    i++; // skip \r\n
                }
                row.push(field);
                field = '';
                if (headerRowsSkipped < 3) {
                    headerRowsSkipped++;
                } else if (row.length > 1) {
                    rows.push(row);
                }
                row = [];
            } else {
                field += ch;
            }
        }
    }
    // Last row
    if (row.length > 0 || field.length > 0) {
        row.push(field);
        if (headerRowsSkipped >= 3 && row.length > 1) {
            rows.push(row);
        }
    }
    return rows;
}

// --- Item names ---
// Column layout (0-indexed): 0=key, 10=Name
console.log('Processing Item.csv...');
const itemRows = parseCSV(join(dataminingPath, 'Item.csv'));
const itemNames = {};
let itemCount = 0;
for (const row of itemRows) {
    const id = parseInt(row[0]);
    const name = row[10];
    if (isNaN(id) || !name || name === '') continue;
    itemNames[id] = name;
    itemCount++;
}
console.log(`  Found ${itemCount} items with names`);

// --- ClassJob names ---
// Column layout: 0=key, 1=Name, 2=Abbreviation
console.log('Processing ClassJob.csv...');
const jobRows = parseCSV(join(dataminingPath, 'ClassJob.csv'));
const jobNames = {};
for (const row of jobRows) {
    const id = parseInt(row[0]);
    const name = row[1];
    const abbr = row[2];
    if (isNaN(id) || !name || !abbr) continue;
    jobNames[abbr] = name;
}
console.log(`  Found ${Object.keys(jobNames).length} jobs`);

// Write output
const outputPath = resolve('packages/core/src/tc_names.ts');
const output = `/**
 * Auto-generated Traditional Chinese name mappings.
 * Generated from ffxiv-datamining-tc CSV files.
 * Do not edit manually - run: node scripts/generate_tc_names.mjs
 */

/**
 * Item ID -> Traditional Chinese item name.
 */
export const TC_ITEM_NAMES: Record<number, string> = ${JSON.stringify(itemNames)};

/**
 * Job abbreviation -> Traditional Chinese job name.
 */
export const TC_JOB_NAMES: Record<string, string> = ${JSON.stringify(jobNames, null, 2)};
`;

writeFileSync(outputPath, output, 'utf-8');
console.log(`\nWritten to ${outputPath}`);
console.log(`Total items: ${itemCount}`);
