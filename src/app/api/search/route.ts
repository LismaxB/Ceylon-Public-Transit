import { NextResponse, NextRequest } from "next/server";
import { supabase } from "../../supabaseClient";
import Fuse from 'fuse.js';

async function search(query: string) {

    const { data: busResults, error: busError } = await supabase
      .from('BusData')
      .select('*')

    const { data: routeResults, error: routeError } = await supabase
      .from('Routes')
      .select('*')
  
    // look for errors
    if (busError || routeError) {
      throw new Error('Error fetching search results');
    }

    const dataset = [
      ...busResults.map((bus) => ({ type: "bus", ...bus })),
      ...routeResults.map((route) => ({ type: "route", ...route })),
    ];

    // Setup Fuse
    const fuse = new Fuse(dataset, {
      keys: ["bus_number", "route_name"],
      threshold: 0.4, // fuzzy matching
    });

    const results = fuse.search(query);

    const finalResults = results.map((result) => result.item);
  
    return finalResults;
  }

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get("query");
  
    if (!query) {
      return NextResponse.json({ message: "Query parameter is required." }, { status: 400 });
    }
  
    try {
      const results = await search(query);
      return NextResponse.json({ message: `Search results for "${query}"`, results });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}