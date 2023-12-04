const { onSchedule } = require("firebase-functions/v2/scheduler");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const { format, add } = require('date-fns');

// Initialize Firebase Admin
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sitnserve-fbaed-default-rtdb.europe-west1.firebasedatabase.app"
});

// Access Realtime Database
const dbRT = admin.database();

// Access Firestore
const db = getFirestore();

// Manually run the task here https://console.cloud.google.com/cloudscheduler
// Run once a day at 21:15, to perform a specific task
exports.createNewDate = onSchedule("every day 00:00", async (event) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const tomorrowDate = add(new Date(), {days: 7});
  const tomorrow = format(add(new Date(), {days: 7}), 'yyyy-MM-dd');
  const restaurants = await getRestaurantObject(tomorrowDate);

  restaurants.forEach((restaurant) => {
    if (restaurant.openingHours !== 'Closed') {
      const timeSlots = generateTimeSlots(restaurant.openingHours);
      restaurant.tables.forEach(table => {
        timeSlots.forEach((slot) => {
          // Create path using today's date and table number
          const slotRef = dbRT.ref(`restaurant_id/${restaurant.id}/tables/${table.table}/reserved/${tomorrow}/${slot}`);
          slotRef.set({
            occupied: false,
            user: ""
          });
        });
      });
    }
  });
});


const getRestaurantObject = async (specificDate) => {
    const restaurantCollection = db.collection('restaurants');
    const snapshot = await restaurantCollection.get();
    const dayOfWeek = format(new Date(specificDate), 'EEEE');

    if (snapshot.empty) {
        logger.log('No matching documents.');
        return [];
    }

    const restaurantInfo = [];

    snapshot.forEach(doc => {
        const id = doc.id;
        const tables = doc.data().tables || []; // Ensure tables is an array
        const openingHours = doc.data().openingHours || {};
        const todayOpeningHours = openingHours[dayOfWeek] || 'Closed';
        restaurantInfo.push({id, tables, openingHours: todayOpeningHours});
    });

    return restaurantInfo;
}


function generateTimeSlots(openingHours) {
  if (!openingHours || openingHours === 'Closed') return [];

  let [openTime, closeTime] = openingHours.split('-');
  let openHour = parseInt(openTime.split(':')[0]);
  let closeHour = parseInt(closeTime.split(':')[0]);

  if (closeTime === '00:00') closeHour = 24;
  else if (closeHour < openHour) closeHour += 24;

  const timeSlots = [];
  for (let hour = openHour; hour < closeHour; hour++) {
    let currentHour = hour % 24;
    const start = `${String(currentHour).padStart(2, '0')}:00`;
    currentHour = (currentHour + 1) % 24;
    const end = (currentHour === 0) ? '24:00' : `${String(currentHour).padStart(2, '0')}:00`;
    timeSlots.push(`${start}-${end}`);
  }
  return timeSlots;
}

exports.deleteOldDate = onSchedule("every day 00:00", async (event) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const yesterday = format(add(new Date(), {days: -1}), 'yyyy-MM-dd');
    const yesterdayUnformatted = add(new Date(), {days: -1});
    const restaurants = await getRestaurantObject(yesterdayUnformatted);

    restaurants.forEach((restaurant) => {
        if (restaurant.openingHours !== 'Closed') {
        const timeSlots = generateTimeSlots(restaurant.openingHours);
        restaurant.tables.forEach(table => {
            timeSlots.forEach((slot) => {
            // Create path using today's date and table number
            const slotRef = dbRT.ref(`restaurant_id/${restaurant.id}/tables/${table.table}/reserved/${yesterday}/${slot}`);
            slotRef.remove();
            });
        });
        }
    });
});