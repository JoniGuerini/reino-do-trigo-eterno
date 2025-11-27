
const toSuperscript = (num) => {
    const map = {
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
        '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
    };
    return num.toString().split('').map(d => map[d] || '').join('');
};

const formatNumber = (num) => {
    const n = Math.floor(num);

    if (n < 1000000) {
        return new Intl.NumberFormat('pt-BR').format(n);
    }

    // Standard Suffixes: M, B, T
    if (n < 1e15) {
        if (n >= 1e12) return (n / 1e12).toLocaleString('en-US', { maximumFractionDigits: 2 }) + 'T';
        if (n >= 1e9) return (n / 1e9).toLocaleString('en-US', { maximumFractionDigits: 2 }) + 'B';
        if (n >= 1e6) return (n / 1e6).toLocaleString('en-US', { maximumFractionDigits: 2 }) + 'M';
    }

    // AA System (Starts at 10^15)
    // 10^15 = AA. Log10(10^15) = 15. 15/3 = 5.
    // We want index 0 for AA. So log1000 - 5.
    const log1000 = Math.floor(Math.log10(n) / 3);
    const aaIndex = log1000 - 5;

    // Each "Mega Cycle" has 4 phases: 2 chars, 3 chars, 4 chars, 5 chars.
    // Each phase has 26 letters.
    // Total steps per Mega Cycle = 26 * 4 = 104.
    const megaCycle = Math.floor(aaIndex / 104);
    const indexInMegaCycle = aaIndex % 104;

    const phase = Math.floor(indexInMegaCycle / 26); // 0, 1, 2, 3
    const letterIdx = indexInMegaCycle % 26;
    const letter = String.fromCharCode(65 + letterIdx); // 65 is 'A'

    // Phase 0 -> 2 chars (AA)
    // Phase 1 -> 3 chars (AAA)
    // Phase 2 -> 4 chars (AAAA)
    // Phase 3 -> 5 chars (AAAAA)
    const charCount = phase + 2;

    let suffix = letter.repeat(charCount);

    if (megaCycle > 0) {
        suffix += toSuperscript(megaCycle + 1);
    }

    const divisor = Math.pow(10, log1000 * 3);
    return (n / divisor).toLocaleString('en-US', { maximumFractionDigits: 2 }) + suffix;
};

// Test values
const val1 = 1e300; // Safe
const val2 = 1e308; // Max safe-ish
const val3 = 1e309; // Infinity

console.log(`1e300: ${formatNumber(val1)}`);
console.log(`1e308: ${formatNumber(val2)}`);
console.log(`1e309: ${formatNumber(val3)}`);

// Calculate what ZZZZZ corresponds to
// ZZZZZ is the last step of Mega Cycle 0.
// aaIndex = 103.
// log1000 = 103 + 5 = 108.
// Exponent = 108 * 3 = 324.
const valZZZZZ = Math.pow(10, 324);
console.log(`10^324 (Target ZZZZZ): ${valZZZZZ}`);
console.log(`Formatted 10^324: ${formatNumber(valZZZZZ)}`);
