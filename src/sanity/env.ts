/**
 * Sanity environment config. Fill these in `.env.local` once you create a
 * Sanity project (https://www.sanity.io/manage). Until then the blog falls
 * back to local sample posts so the site still runs.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

/** True only when a real Sanity project is configured. */
export const sanityConfigured = Boolean(projectId);
