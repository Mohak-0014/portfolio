import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, sanityConfigured } from "./env";

/**
 * Read-only client used by Server Components to fetch published posts.
 * Returns null when Sanity isn't configured yet (blog uses sample data then).
 */
export const sanityClient = sanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    })
  : null;
