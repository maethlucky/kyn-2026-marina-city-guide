const fs = require('fs');
const places = require("../data/placesOpFormat.json");

const placesFormatted = places.elements.map((el) => ({
    id: el.id,
    lat: el.lat,
    lon: el.lon,
    name: el.tags?.name,
    tags: [
        el.tags?.amenity,
        el.tags?.leisure,
        el.tags?.cuisine,
        el.tags?.shop,
        el.tags?.takeaway === "yes" ? "takeaway" : null,
        el.tags?.delivery === "yes" ? "delivery" : null,
        el.tags?.wheelchair === "yes" ? "wheelchair" : null,
    ].filter(Boolean),
    website: el.tags?.website,
    phone: el.tags?.phone,
    hours: el.tags?.opening_hours,
}));

fs.writeFileSync('./data/places.json', JSON.stringify(placesFormatted, null, 2));
console.log('Done!');

