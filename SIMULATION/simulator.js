const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
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

async function getBusId() {
  const { data, error } = await supabase.from('BusData').select('id').eq('bus_number', 'SIMULATOR');
  if (error) console.error(error);
  else return data[0].id;
};

async function sendLocationUpdate(location, totalUpdates, busId) {
  await supabase
    .from('DriverLocations')
    .insert([
      {
        driver_id: location.driver_id,
         // bus_number: location.bus_number,
        bus_id: busId,
        latitude: location.lat,
        longitude: location.lng,
        timestamp: new Date().toISOString(),
      },
    ]);

  // Update percentage after sending each location
  const percentage = Math.floor(((index + 1) / totalUpdates) * 100);
  displayLoadingAnimation(percentage, location);
}

async function simulateLocationUpdates() {
  const totalUpdates = route.length;
  await getBusId().then((busId) => {
    let locationInterval = setInterval(() => {
      if (index < totalUpdates) {
        sendLocationUpdate(route[index], totalUpdates, busId);
        index++;
      } else {
        clearInterval(locationInterval);
        console.log('Simulation finished.');
      }
    }, 5000);
  });
}

// Loading animation with percentage and last sent location
function displayLoadingAnimation(percentage, location) {
  const frames = ['-', '/', '|', '\\'];
  let i = 0;
  
  // Clear previous animation before starting a new one
  if (this.animationInterval) clearInterval(this.animationInterval);
  
  this.animationInterval = setInterval(() => {
    process.stdout.write(`\r${frames[i++ % frames.length]} Sending location updates... | ${percentage}% DONE | Last sent: Bus No: ${location.bus_number}, Lat: ${location.lat}, Lng: ${location.lng}`);
    
    if (percentage >= 100) {
      clearInterval(this.animationInterval);
      process.stdout.write('\rUpdates complete!                                          \n'); // Clear line
    }
  }, 100);
}
