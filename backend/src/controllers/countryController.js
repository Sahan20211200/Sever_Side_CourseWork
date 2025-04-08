const { fetchCountryInfo } = require("../models/countryModel");

const getCountryInfo = async (req, res) => {
    const countryName = req.params.name;

    const { error, data } = await fetchCountryInfo(countryName);

    if (error) {
        const statusCode = error === "Country not found" ? 404 : 500;
        return res.status(statusCode).json({ error });
    }

    res.json(data);
};

module.exports = { getCountryInfo };
