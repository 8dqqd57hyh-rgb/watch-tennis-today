/**
 * Supabase Court Data Utilities
 * 
 * Functions to fetch and manage court mappings from Supabase database
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type CourtMapping = {
  id: number;
  tournament_slug: string;
  tournament_year: number;
  match_date: string;
  match_time?: string;
  player1: string;
  player2: string;
  court_number: string;
  court_name?: string;
  surface?: string;
  capacity?: number;
  round?: string;
  notes?: string;
  source?: string;
  created_at: string;
  updated_at: string;
};

/**
 * Fetch court mapping for a specific match
 */
export async function fetchCourtForMatch(
  tournamentSlug: string,
  year: number,
  player1: string,
  player2: string,
  date: string
): Promise<CourtMapping | null> {
  try {
    const dateOnly = date.split("T")[0];
    const p1Lower = player1.toLowerCase();
    const p2Lower = player2.toLowerCase();

    // First try exact player order
    let { data, error } = await supabase
      .from("tournament_court_mappings")
      .select("*")
      .eq("tournament_slug", tournamentSlug)
      .eq("tournament_year", year)
      .eq("match_date", dateOnly)
      .ilike("player1", p1Lower)
      .ilike("player2", p2Lower)
      .single();

    // If not found, try reversed player order
    if (!data || error?.code === "PGRST116") {
      const result = await supabase
        .from("tournament_court_mappings")
        .select("*")
        .eq("tournament_slug", tournamentSlug)
        .eq("tournament_year", year)
        .eq("match_date", dateOnly)
        .ilike("player1", p2Lower)
        .ilike("player2", p1Lower)
        .single();

      data = result.data;
      error = result.error;
    }

    if (error) {
      if (error.code === "PGRST116") {
        // No rows found, return null
        return null;
      }
      console.error("Error fetching court mapping:", error);
      return null;
    }

    return data as CourtMapping;
  } catch (error) {
    console.error("Error fetching court for match:", error);
    return null;
  }
}

/**
 * Fetch all court mappings for a tournament date
 */
export async function fetchCourtsForDate(
  tournamentSlug: string,
  year: number,
  date: string
): Promise<CourtMapping[]> {
  try {
    const dateOnly = date.split("T")[0];

    const { data, error } = await supabase
      .from("tournament_court_mappings")
      .select("*")
      .eq("tournament_slug", tournamentSlug)
      .eq("tournament_year", year)
      .eq("match_date", dateOnly)
      .order("match_time", { ascending: true });

    if (error) {
      console.error("Error fetching courts for date:", error);
      return [];
    }

    return (data || []) as CourtMapping[];
  } catch (error) {
    console.error("Error fetching courts for date:", error);
    return [];
  }
}

/**
 * Fetch all courts for a tournament
 */
export async function fetchAllCourtsForTournament(
  tournamentSlug: string,
  year: number
): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("tournament_court_mappings")
      .select("court_number")
      .eq("tournament_slug", tournamentSlug)
      .eq("tournament_year", year);

    if (error) {
      console.error("Error fetching courts for tournament:", error);
      return [];
    }

    // Get unique court numbers
    const uniqueCourts = new Set<string>();
    (data || []).forEach((row: any) => {
      if (row.court_number) {
        uniqueCourts.add(row.court_number);
      }
    });

    const courts = Array.from(uniqueCourts).sort((a: string, b: string) => {
      const numA = Number(a);
      const numB = Number(b);
      return Number.isFinite(numA) && Number.isFinite(numB)
        ? numA - numB
        : a.localeCompare(b);
    });

    return courts;
  } catch (error) {
    console.error("Error fetching all courts for tournament:", error);
    return [];
  }
}

/**
 * Add or update a court mapping
 */
export async function addCourtMapping(mapping: Omit<CourtMapping, "id" | "created_at" | "updated_at">): Promise<CourtMapping | null> {
  try {
    const { data, error } = await supabase
      .from("tournament_court_mappings")
      .upsert([mapping], {
        onConflict: "tournament_slug,tournament_year,match_date,player1,player2",
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding court mapping:", error);
      return null;
    }

    return data as CourtMapping;
  } catch (error) {
    console.error("Error adding court mapping:", error);
    return null;
  }
}

/**
 * Batch add court mappings from external source
 */
export async function batchAddCourtMappings(
  mappings: Omit<CourtMapping, "id" | "created_at" | "updated_at">[]
): Promise<number> {
  try {
    const { error, data } = await supabase
      .from("tournament_court_mappings")
      .upsert(mappings, {
        onConflict: "tournament_slug,tournament_year,match_date,player1,player2",
      })
      .select();

    if (error) {
      console.error("Error batch adding court mappings:", error);
      return 0;
    }

    return data?.length || 0;
  } catch (error) {
    console.error("Error batch adding court mappings:", error);
    return 0;
  }
}

/**
 * Delete a court mapping
 */
export async function deleteCourtMapping(
  tournamentSlug: string,
  year: number,
  player1: string,
  player2: string,
  date: string
): Promise<boolean> {
  try {
    const dateOnly = date.split("T")[0];
    const p1Lower = player1.toLowerCase();
    const p2Lower = player2.toLowerCase();

    // Try deleting with player order 1,2
    let { error } = await supabase
      .from("tournament_court_mappings")
      .delete()
      .eq("tournament_slug", tournamentSlug)
      .eq("tournament_year", year)
      .eq("match_date", dateOnly)
      .ilike("player1", p1Lower)
      .ilike("player2", p2Lower);

    if (error && error.code !== "PGRST116") {
      console.error("Error deleting court mapping:", error);
      return false;
    }

    // Also try deleting with player order 2,1 in case first didn't match
    const result2 = await supabase
      .from("tournament_court_mappings")
      .delete()
      .eq("tournament_slug", tournamentSlug)
      .eq("tournament_year", year)
      .eq("match_date", dateOnly)
      .ilike("player1", p2Lower)
      .ilike("player2", p1Lower);

    if (result2.error && result2.error.code !== "PGRST116") {
      console.error("Error deleting court mapping:", result2.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting court mapping:", error);
    return false;
  }
}
