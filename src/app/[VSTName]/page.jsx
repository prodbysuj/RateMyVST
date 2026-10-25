import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";
import NavigationBar from "@/components/universal/navigationbar";
import ReviewForm from "./ReviewForm";
import styles from "./page.module.css";

export const instant = false;

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
        review_date,
        stars
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
  const [vst, user] = await Promise.all([getVst(VSTName), currentUser()]);

  if (!vst) notFound();

  const reviewCount = vst.reviews.length;
  const isSignedIn = !!user;

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

        {/* Review form */}
        <section className={styles.writeReview}>
          {isSignedIn ? (
            <ReviewForm vstId={vst.id} vstSlug={VSTName} />
          ) : (
            <p className={styles.signInPrompt}>
              <a href="/sign-in" className={styles.signInLink}>Sign in</a>{" "}
              to leave a review.
            </p>
          )}
        </section>

        {/* Reviews list */}
        <section className={styles.reviews}>
          <h2 className={styles.reviewsHeading}>
            {reviewCount === 0
              ? "No reviews yet"
              : `${reviewCount} ${reviewCount === 1 ? "Review" : "Reviews"}`}
          </h2>

          {reviewCount === 0 ? (
            <p className={styles.empty}>Be the first to review {vst.name}.</p>
          ) : (
            <ul className={styles.reviewList}>
              {vst.reviews.map((review) => (
                <li key={review.id} className={styles.reviewCard}>
                  <div className={styles.reviewMeta}>
                    <span className={styles.username}>{review.username}</span>
                    {review.stars != null && (
                      <span className={styles.reviewStars} aria-label={`${review.stars} out of 5 stars`}>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <span
                            key={n}
                            className={n <= review.stars ? styles.starFilled : styles.starEmpty}
                          >
                            ★
                          </span>
                        ))}
                      </span>
                    )}
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
