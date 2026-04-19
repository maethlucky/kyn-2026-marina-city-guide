const tags = [
    {
        id: 'restaurant', label: 'Restaurant',
        subcategories: [
            { id: 'fast_food', label: 'Fast Food' },
            { id: 'pizza', label: 'Pizza' },
            { id: 'burger', label: 'Burgers' },
            { id: 'mexican', label: 'Mexican' },
            { id: 'chinese', label: 'Chinese' },
            { id: 'japanese', label: 'Japanese' },
            { id: 'sushi', label: 'Sushi' },
            { id: 'vietnamese', label: 'Vietnamese' },
            { id: 'mediterranean', label: 'Mediterranean' },
            { id: 'american', label: 'American' },
            { id: 'sandwich', label: 'Sandwiches' },
        ]
    },
    { id: 'cafe', label: 'Cafe' },
    { id: 'pub', label: 'Pub' },
    { id: 'fitness_centre', label: 'Fitness' },
    { id: 'supermarket', label: 'Supermarket' },
    { id: 'convenience', label: 'Convenience Store' },
    { id: 'library', label: 'Library' },
    { id: 'community_centre', label: 'Community Centre' },
    { id: 'public_bookcase', label: 'Public Bookcase' },
    { id: 'takeaway', label: 'Takeaway' },
    { id: 'delivery', label: 'Delivery' },
    { id: 'wheelchair', label: 'Wheelchair Accessible' },
    { 
        id: 'outdoors', label: 'Outdoors',
        subcategories: [
            { id: 'park', label: 'Park' },
            { id: 'beach', label: 'Beach'},
        ]
    },
    { id: 'editors_choice', label: `Editor's Choice`},
    { id: 'hidden_gem', label: 'Hidden Gems'},
    { id: 'local_owned', label: 'Local Owned'},
];

module.exports = tags;