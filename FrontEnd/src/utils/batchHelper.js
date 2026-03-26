const START_YEARS = {//starting year
    bca: 2018,
    csit: 2025,
    bsc: 2013
};

const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const getDynamicBatches = (faculty) => {
    const startYear = START_YEARS[faculty?.toLowerCase()];
    if (!startYear) return [];

    const currentYear = new Date().getFullYear();
    const batches = [];

    // Loop from the year it started up to the current year
    for (let year = startYear; year <= currentYear; year++) {
        const batchNumber = year - startYear + 1;
        // Matches your format: "1st Batch 2017"
        batches.push(`${getOrdinal(batchNumber)} Batch ${year}`);
    }

    return batches.reverse();
};
