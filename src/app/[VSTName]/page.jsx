import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import NavigationBar from "@/components/universal/navigationbar";
import styles from "./page.module.css";

export const instant = false;

// Convert a URL slug back to a name pattern for querying.
// e.g. "vital-synth" → "vital synth" (case-insensitive match in Supabase)
function slugToName(slug) {
  return decodeURIComponent(slug).replace(/-/g, " ");
}

async function getVst(slug) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vsts")
    .select(`
      id,
      name,
      company_developer,
      cover_image,
      website,
      is_free,
      is_open_source,
      reviews (
        id,
        username,
        review_text,
        review_date
      )
    `)
    .ilike("name", slugToName(slug))
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }) {
  const { VSTName } = await params;
  const vst = await getVst(VSTName);
  if (!vst) return { title: "VST Not Found — RateMyVST" };
  return {
    title: `${vst.name} — RateMyVST`,
    description: `Reviews and info for ${vst.name} by ${vst.company_developer}.`,
  };
}

export default async function VSTPage({ params }) {
  const { VSTName } = await params;
  const vst = await getVst(VSTName);

  if (!vst) notFound();

  const reviewCount = vst.reviews.length;

  return (
    <main>
      <NavigationBar />

      <article className={styles.container}>
        {/* Hero */}
        <div className={styles.hero}>
          {vst.cover_image && (
            <img
              src={vst.cover_image}
              alt={vst.name}
              className={styles.cover}
            />
          )}

          <div className={styles.heroBody}>
            <p className={styles.developer}>{vst.company_developer}</p>
            <h1 className={styles.title}>{vst.name}</h1>

            <div className={styles.tags}>
              {vst.is_free && <span className={styles.tag}>Free</span>}
              {vst.is_open_source && (
                <span className={styles.tag}>Open Source</span>
              )}
            </div>

            {vst.website && (
              <a
                href={vst.website}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.websiteLink}
              >
                Visit website →
              </a>
            )}
          </div>
        </div>

        {/* Reviews */}
        <section className={styles.reviews}>
          <h2 className={styles.reviewsHeading}>
            {reviewCount === 0
              ? "No reviews yet"
              : `${reviewCount} ${reviewCount === 1 ? "Review" : "Reviews"}`}
          </h2>

          {reviewCount === 0 ? (
            <p className={styles.empty}>
              Be the first to review {vst.name}.
            </p>
          ) : (
            <ul className={styles.reviewList}>
              {vst.reviews.map((review) => (
                <li key={review.id} className={styles.reviewCard}>
                  <div className={styles.reviewMeta}>
                    <span className={styles.username}>{review.username}</span>
                    <span className={styles.date}>
                      {new Date(review.review_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className={styles.reviewText}>{review.review_text}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </article>
    </main>
  );
}
