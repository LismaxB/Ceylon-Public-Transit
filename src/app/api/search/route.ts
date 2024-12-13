import { NextResponse, NextRequest } from "next/server";
import { supabase } from "../../supabaseClient";

async function searchBuses(query: string) {

    const { data: busResults, error: busError } = await supabase
      .from('BusData')
      .select('*')
      .textSearch('bus_number', query);
  
    // look for errors
    if (busError) {
      throw new Error('Error fetching search results');
    }
  
    return {
      buses: busResults
    };
  }

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get("query");
  
    if (!query) {
      return NextResponse.json({ message: "Query parameter is required." }, { status: 400 });
    }
  
    try {
      const results = await searchBuses(query);
        console.log(results);
      return NextResponse.json({ message: `Search results for "${query}"`, buses: results.buses });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}