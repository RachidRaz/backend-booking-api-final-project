const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const userData = require('../src/data/users.json');
const propertyData = require('../src/data/properties.json');
const amenityData = require('../src/data/amenities.json');
const bookingData = require('../src/data/bookings.json');
const hostData = require('../src/data/hosts.json');
const reviewData = require('../src/data/reviews.json');

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] })

// generate a random integer between two values
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
    const { users } = userData
    const { properties } = propertyData
    const { amenities } = amenityData
    const { bookings } = bookingData
    const { hosts } = hostData
    const { reviews } = reviewData

    // seed users
    for (const user of users) {
        user.password =  await bcrypt.hash(user.password, 10);
        await prisma.user.upsert({
            where: { id: user.id },
            update: {},
            create: user
        })
    }

    // seed hosts
    for (const host of hosts) {
        await prisma.host.upsert({
            where: { id: host.id },
            update: {},
            create: host
        });
    }

    // seed properties
    for (const property of properties) {
        await prisma.property.upsert({
            where: { id: property.id },
            update: {},
            create: property
        })
    }

    // seed amenities
    for (const amenity of amenities) {
        await prisma.amenity.upsert({
            where: { id: amenity.id },
            update: {},
            create: amenity
        });
    }

    // seed bookings
    for (const booking of bookings) {
        await prisma.booking.upsert({
            where: { id: booking.id },
            update: {},
            create: booking
        });
    }

    // seed reviews
    for (const review of reviews) {
        await prisma.review.upsert({
            where: { id: review.id },
            update: {},
            create: review
        });
    }

    // clear propertyAmenity table to avoid existing propertyId / amenityId creation (uniqueness) 
    await prisma.propertyAmenity.deleteMany({});

    // seed PropertyAmenity w/ random amenities for each property
    for (const property of properties) {
        
        // each property will get 1 to 3 amenities
        const numberOfAmenitiesToAdd = getRandomInt(1, 3);

        // shuffeling the amenities array and retrieving x-amenities
        const shuffledAmenities = amenities.sort(() => 0.5 - Math.random());
        const selectedAmenities = shuffledAmenities.slice(0, numberOfAmenitiesToAdd);

        for (const amenity of selectedAmenities) {
            await prisma.propertyAmenity.create({
                data: {
                    propertyId: property.id,
                    amenityId: amenity.id
                }
            });
        }
    }

}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })