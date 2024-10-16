const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');
const { time } = require('console');

require('dotenv').config();
console.log(process.env.SUPABASE_URL);

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Load the CSV data
const route = [];

fs.createReadStream('./SIMULATION/sample-data-sheet-SIMULATION.csv')
  .pipe(csv())
  .on('data', (row) => {
    route.push({
      lat: row.latitude,
      lng: row.longitude,
      driver_id: 'SIMULATOR',
      bus_number: row.bus_number,
      bus_type: row.bus_type,
    });
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
    simulateLocationUpdates();
  });

// Send updates to Supabase every 5 seconds
let index = 0;

async function sendLocationUpdate(location) {
  const { data, error } = await supabase
    .from('DriverLocations')
    .insert([
      {
        driver_id: location.driver_id,
        // bus_number: location.bus_number,
        bus_type: location.bus_type,
        latitude: location.lat,
        longitude: location.lng,
        timestamp: new Date().toISOString(),
      },
    ]);

  if (error) console.error(error);
  else console.log(`Location update sent for Driver: ${location.driver_id}`);
}

function simulateLocationUpdates() {
  const locationInterval = setInterval(() => {
    if (index < route.length) {
      sendLocationUpdate(route[index]);
      index++;
    } else {
      clearInterval(locationInterval);
      console.log('Simulation finished.');
    }
  }, 5000);
}