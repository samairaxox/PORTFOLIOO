import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type ContributionDay = { date: string; contributionCount: number };
type FailureCategory = "AUTHENTICATION_FAILED" | "RATE_LIMITED" | "FORBIDDEN" | "PROFILE_NOT_FOUND" | "GRAPHQL_ERROR" | "NETWORK_ERROR";
type GitHubError = { type?: string; message?: string };
type GitHubResult = {
  data?: { user?: { login: string; contributionsCollection?: { contributionYears?: number[]; contributionCalendar?: { weeks: Array<{ contributionDays: ContributionDay[] }> } } } | null };
  errors?: GitHubError[];
};
type ContributionPayload = {
  available: true;
  days: Array<{ date: string; count: number }>;
  years: number[];
  failedYears: Array<{ year: number; category: FailureCategory }>;
  leapDayOmitted: number;
  complete: boolean;
};
type CachedContributions = { expiresAt: number; payload: ContributionPayload };

const cacheKey = "__portfolioGithubContributionCache";
const cacheStore = globalThis as typeof globalThis & { [cacheKey]?: CachedContributions };
const PROFILE = "samairaxox";
const GRAPHQL_URL = "https://api.github.com/graphql";
const DISCOVER_QUERY = `query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) { login contributionsCollection(from: $from, to: $to) { contributionYears } }
}`;
const YEAR_QUERY = `query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    login
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar { weeks { contributionDays { date contributionCount } } }
    }
  }
}`;

class ContributionRequestError extends Error {
  constructor(readonly category: FailureCategory) { super(category); }
}

function categorizeGraphQLErrors(errors: GitHubError[]): FailureCategory {
  const text = errors.map((error) => `${error.type ?? ""} ${error.message ?? ""}`).join(" ").toLowerCase();
  if (/bad credentials|unauthenticated|authentication/.test(text)) return "AUTHENTICATION_FAILED";
  if (/rate limit|secondary rate/.test(text)) return "RATE_LIMITED";
  if (/not found|could not resolve to a user/.test(text)) return "PROFILE_NOT_FOUND";
  if (/forbidden|resource not accessible/.test(text)) return "FORBIDDEN";
  return "GRAPHQL_ERROR";
}

async function graphQL(token: string, query: string, variables: Record<string, string>): Promise<GitHubResult> {
  let response: Response;
  try {
    response = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "User-Agent": "Samaira-Portfolio-Contribution-Calendar" },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new ContributionRequestError("NETWORK_ERROR");
  }
  if (!response.ok) {
    if (response.status === 401) throw new ContributionRequestError("AUTHENTICATION_FAILED");
    if (response.status === 429 || (response.status === 403 && response.headers.get("x-ratelimit-remaining") === "0")) throw new ContributionRequestError("RATE_LIMITED");
    if (response.status === 403) throw new ContributionRequestError("FORBIDDEN");
    throw new ContributionRequestError("NETWORK_ERROR");
  }
  const result = await response.json() as GitHubResult;
  if (result.errors?.length) throw new ContributionRequestError(categorizeGraphQLErrors(result.errors));
  return result;
}

function errorResponse(category: FailureCategory, status: number) {
  return NextResponse.json({ available: false, reason: category }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET() {
  const cached = cacheStore[cacheKey];
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.payload, { headers: { "Cache-Control": "private, max-age=3600" } });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) return NextResponse.json({ available: false, reason: "MISSING_TOKEN" }, { status: 503, headers: { "Cache-Control": "no-store" } });

  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const currentTime = now.toISOString();
  const yearsFrom = `${currentYear}-01-01T00:00:00Z`;

  try {
    const discovery = await graphQL(token, DISCOVER_QUERY, { login: PROFILE, from: yearsFrom, to: currentTime });
    const profile = discovery.data?.user;
    if (!profile) return errorResponse("PROFILE_NOT_FOUND", 404);
    const years = [...new Set(profile.contributionsCollection?.contributionYears ?? [])]
      .filter((year) => year >= 2008 && year <= currentYear)
      .sort((a, b) => a - b);

    const totals = new Map<string, number>();
    const fetchedYears: number[] = [];
    const failedYears: ContributionPayload["failedYears"] = [];
    let leapDayOmitted = 0;

    // Fetch each year separately, in small batches. A failure in one year never hides successful years.
    for (let index = 0; index < years.length; index += 3) {
      const batch = await Promise.all(years.slice(index, index + 3).map(async (year) => {
        const from = `${year}-01-01T00:00:00Z`;
        const to = year === currentYear ? currentTime : `${year}-12-31T23:59:59Z`;
        try {
          const result = await graphQL(token, YEAR_QUERY, { login: PROFILE, from, to });
          const calendar = result.data?.user?.contributionsCollection?.contributionCalendar;
          if (!calendar) throw new ContributionRequestError("PROFILE_NOT_FOUND");
          return { year, days: calendar.weeks.flatMap((week) => week.contributionDays) };
        } catch (error) {
          return { year, error: error instanceof ContributionRequestError ? error.category : "NETWORK_ERROR" as FailureCategory };
        }
      }));

      for (const item of batch) {
        if (!("days" in item) || !item.days) {
          failedYears.push({ year: item.year, category: item.error ?? "NETWORK_ERROR" });
          continue;
        }
        fetchedYears.push(item.year);
        for (const day of item.days) {
          const [, month, date] = day.date.split("-");
          if (month === "02" && date === "29") {
            leapDayOmitted += day.contributionCount;
            continue;
          }
          const monthDay = `${month}-${date}`;
          totals.set(monthDay, (totals.get(monthDay) ?? 0) + day.contributionCount);
        }
      }
    }

    if (!fetchedYears.length && failedYears.length) {
      const category = failedYears.some(({ category }) => category === "RATE_LIMITED") ? "RATE_LIMITED" : failedYears[0].category;
      return errorResponse(category, category === "RATE_LIMITED" ? 429 : category === "AUTHENTICATION_FAILED" ? 401 : 502);
    }

    const days = Array.from({ length: 365 }, (_, index) => {
      const date = new Date(Date.UTC(2025, 0, index + 1));
      const monthDay = `${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
      return { date: monthDay, count: totals.get(monthDay) ?? 0 };
    });
    const payload: ContributionPayload = {
      available: true,
      days,
      years: fetchedYears.sort((a, b) => a - b),
      failedYears: failedYears.sort((a, b) => a.year - b.year),
      leapDayOmitted,
      complete: failedYears.length === 0,
    };
    cacheStore[cacheKey] = { expiresAt: Date.now() + (payload.complete ? 24 : 1) * 60 * 60 * 1000, payload };
    return NextResponse.json(payload, { headers: { "Cache-Control": "private, max-age=3600" } });
  } catch (error) {
    const category = error instanceof ContributionRequestError ? error.category : "NETWORK_ERROR";
    const status = category === "AUTHENTICATION_FAILED" ? 401 : category === "RATE_LIMITED" ? 429 : category === "PROFILE_NOT_FOUND" ? 404 : category === "FORBIDDEN" ? 403 : 502;
    return errorResponse(category, status);
  }
}
