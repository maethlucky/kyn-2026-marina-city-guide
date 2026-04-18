const fs = require('fs');

fetchAndWrite();

async function fetchAndWrite() {
    const MARINA_BBOX = '36.644090,-121.817608,36.705391,-121.746197';
    const OVERPASS_URL = 'https://overpass.kumi.systems/api/interpreter';

    const query = `
  [out:json][timeout:25];
  (
    node["amenity"~"restaurant|bar|cafe|pub|nightclub|fast_food|community_centre|library"](${MARINA_BBOX});
    node["leisure"~"fitness_centre|sports_centre|park|playground"](${MARINA_BBOX});
    node["shop"~"supermarket|convenience"](${MARINA_BBOX});
  );
  out body;
`;

    const response = await fetch(OVERPASS_URL, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'marina-hackathon-app/1.0',
        },
        body: `data=${encodeURIComponent(query)}`,
    });

    const data = await response.json();
    fs.writeFileSync('./data/places.json', JSON.stringify(data, null, 2));
    console.log('Done!');
}
