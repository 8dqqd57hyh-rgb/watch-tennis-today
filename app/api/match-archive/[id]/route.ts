import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

type ArchivedMatchRow = {
  id?: string | number | null;
  player1?: string | null;
  player2?: string | null;
  tournament?: string | null;
  category?: string | null;
  status?: string | null;
  score?: string | null;
  start_time?: string | null;
  watch_providers?: unknown[] | null;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("match_archive")
    .select("*")
    .eq("id", id)
    .maybeSingle<ArchivedMatchRow>();

  if (error || !data) {
    return NextResponse.json(
      { match: null },
      { status: 404 }
    );
  }

  return NextResponse.json({
    match: {
      id: data.id,
      player1: data.player1,
      player2: data.player2,
      tournament: data.tournament,
      category: data.category,
      status: data.status,
      score: data.score,
      startTime: data.start_time,
      watchProviders:
        data.watch_providers || [],
    },
  });
}
