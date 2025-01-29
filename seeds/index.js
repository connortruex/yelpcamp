const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb+srv://connorTruex:qDwmfv9mcWEG8Sth@myudemycoursecluster.tgifl19.mongodb.net/yelpCamp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '638e4579b6658588ff4b5c17',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            images: [
                {
                    url: "https://res.cloudinary.com/dcjyle0lh/image/upload/v1670448778/YelpCamp/hjgo1wguyhrcjnjhpjfa.jpg",
                    filename: "YelpCamp/hjgo1wguyhrcjnjhpjfa",
                },
                {
                    url: "https://res.cloudinary.com/dcjyle0lh/image/upload/v1670448779/YelpCamp/zjon8sfcliwyjfcotbot.jpg",
                    filename: "YelpCamp/zjon8sfcliwyjfcotbot",
                },
                {
                    url: "https://res.cloudinary.com/dcjyle0lh/image/upload/v1670448781/YelpCamp/qksmpdak9xtcjotktwtb.jpg",
                    filename: "YelpCamp/qksmpdak9xtcjotktwtb",
                },
                {
                    url: "https://res.cloudinary.com/dcjyle0lh/image/upload/v1670448781/YelpCamp/xyjqvzommw5p8nythrqu.jpg",
                    filename: "YelpCamp/xyjqvzommw5p8nythrqu",
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur vitae minus error et? Voluptatem dolorem voluptate, voluptatum corporis quam unde mollitia eaque? Necessitatibus facere omnis dicta eaque laboriosam consectetur et.',
            price: Math.floor(Math.random() * 50) + 1
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})