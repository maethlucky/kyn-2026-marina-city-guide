const fs = require("fs");
const places = require("../data/placesOpFormat.json");

const excludedBrands = [
    "subway",
    "taco bell",
    "jack in the box",
    "burger king",
    "mcdonald's",
    "starbucks",
    "kfc",
    "pizza hut",
    "domino's",
    "7-eleven",
    "circle k",
    "chevron",
    "shell"
];

function isChain(tags = {}) {
    const name = (tags.name || "").toLowerCase();
    const brand = (tags.brand || "").toLowerCase();

    return excludedBrands.some((item) => name.includes(item) || brand.includes(item));
}

const placesFormatted = places.elements.map((el) => {
    const osmTags = el.tags || {};
    const tags = [];

    if (osmTags.amenity) tags.push(osmTags.amenity);
    if (osmTags.leisure) tags.push(osmTags.leisure);
    if (osmTags.cuisine) tags.push(osmTags.cuisine);
    if (osmTags.shop) tags.push(osmTags.shop);

    if (osmTags.takeaway === "yes") tags.push("takeaway");
    if (osmTags.delivery === "yes") tags.push("delivery");
    if (osmTags.wheelchair === "yes") tags.push("wheelchair");

    if (
        osmTags.amenity === "restaurant" ||
        osmTags.amenity === "cafe" ||
        osmTags.amenity === "fast_food" ||
        osmTags.amenity === "bar" ||
        osmTags.amenity === "pub"
    ) {
        tags.push("food");
    }

    if (
        osmTags.leisure === "park" ||
        osmTags.leisure === "playground" ||
        osmTags.leisure === "sports_centre" ||
        osmTags.leisure === "fitness_centre"
    ) {
        tags.push("outdoors");
    }

    if (osmTags.amenity === "fast_food") {
        tags.push("budget");
    }

    if (
        osmTags.name &&
        !isChain(osmTags) &&
        (
            osmTags.leisure === "park" ||
            osmTags.leisure === "playground" ||
            osmTags.amenity === "cafe" ||
            osmTags.amenity === "library" ||
            osmTags.amenity === "community_centre" ||
            osmTags.amenity === "bar" ||
            osmTags.amenity === "pub"
        )
    ) {
        tags.push("hidden_gem");
    }

    return {
        id: el.id,
        lat: el.lat,
        lon: el.lon,
        name: osmTags.name,
        tags: [...new Set(tags)],
        website: osmTags.website,
        phone: osmTags.phone,
        hours: osmTags.opening_hours,
    };
});

fs.writeFileSync("./data/places.json", JSON.stringify(placesFormatted, null, 2));
console.log("Done!");