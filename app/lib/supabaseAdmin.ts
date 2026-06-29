import "server-only";

import { createClient } from "@supabase/supabase-js";

type SupabaseMockResult = Promise<{ data: null | never[]; error: null }>;

type SupabaseMockBuilder = {
  select: (...args: unknown[]) => SupabaseMockBuilder;
  insert: (...args: unknown[]) => SupabaseMockResult;
  upsert: (...args: unknown[]) => SupabaseMockResult;
  eq: (...args: unknown[]) => SupabaseMockBuilder;
  gte: (...args: unknown[]) => SupabaseMockBuilder;
  in: (...args: unknown[]) => SupabaseMockBuilder;
  not: (...args: unknown[]) => SupabaseMockBuilder;
  order: (...args: unknown[]) => SupabaseMockBuilder;
  limit: (...args: unknown[]) => SupabaseMockBuilder;
  maybeSingle: <T>() => Promise<{ data: T | null; error: null }>;
  then: SupabaseMockResult["then"];
};

function createBuildTimeSupabaseMock() {
  const emptyResult = Promise.resolve({ data: null, error: null });
  const emptyArrayResult = Promise.resolve({ data: [], error: null });

  const builder = {} as SupabaseMockBuilder;
  builder.select = () => builder;
  builder.insert = () => emptyResult;
  builder.upsert = () => emptyResult;
  builder.eq = () => builder;
  builder.gte = () => builder;
  builder.in = () => builder;
  builder.not = () => builder;
  builder.order = () => builder;
  builder.limit = () => builder;
  builder.maybeSingle = async <T>() => ({ data: null as T | null, error: null });
  builder.then = emptyArrayResult.then.bind(emptyArrayResult);

  return {
    from: () => builder,
  };
}

const hasSupabaseAdminEnv = Boolean(
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
);

if (!hasSupabaseAdminEnv) {
  console.warn(
    "Supabase admin environment variables are missing; using a build-time no-op client. Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in production."
  );
}

export const supabaseAdmin = hasSupabaseAdminEnv
  ? createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  : createBuildTimeSupabaseMock();
