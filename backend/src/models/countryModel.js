const axios = require("axios");

// Function to fetch and format country data
const fetchCountryInfo = async (countryName) => {
    try {
        const response = await axios.get(`https://restcountries.com/v3.1/name/${countryName}`);

        if (!response.data || response.data.length === 0) {
            return { error: "Country not found", data: null };
        }

        const country = response.data[0];

        const formattedData = {
            name: country.name?.common || "Unknown",
            capital: country.capital?.[0] || "Unknown",
            currency: country.currencies ? Object.keys(country.currencies)[0] : "Unknown",
            languages: country.languages ? Object.values(country.languages) : [],
            flag: country.flags?.png || "No flag available"
        };

        return { error: null, data: formattedData };

    } catch (error) {
        console.error("API error:", error.message);
        return { error: "Failed to fetch country data", data: null };
    }
};

module.exports = { fetchCountryInfo };
