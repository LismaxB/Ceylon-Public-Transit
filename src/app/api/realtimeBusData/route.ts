import { NextRequest,NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export async function GET(req: NextRequest) {
  const busMap: { [key: string]: any } = {};

  const groupBusesById = (busData: any[]) => {
    busData.forEach(bus => {
      if (!busMap[bus.driver_id] || new Date(bus.timestamp) > new Date(busMap[bus.driver_id].timestamp)) {
        busMap[bus.driver_id] = bus;  // Keep the latest location
      }
    });
    return Object.values(busMap);  // Convert the map back to an array
  };

  try {
    const { data, error } = await supabase
      .from('DriverLocations')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const uniqueBuses = groupBusesById(data);

    return NextResponse.json(uniqueBuses);
  } catch (err) {
    return NextResponse.json({ error: 'An error occurred while fetching data' }, { status: 500 });
  }
}