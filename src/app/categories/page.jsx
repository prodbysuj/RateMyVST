import { createClient } from "@/utils/supabase/server";
import NavigationBar from "@/components/universal/navigationbar";
import styles from "./page.module.css";

export const instant = false;

async function getVsts() {
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
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Could not fetch VSTs: ${error.message}`);
  }

  return data;
}

export default async function Home() {
  const vsts = await getVsts();

  return (
    <main>
      <NavigationBar />

      <section className={styles.container}>
        <h2 className={styles.heading}>All VSTs</h2>

        {vsts.length === 0 ? (
          <p className={styles.empty}>No VSTs found.</p>
        ) : (
          <ul className={styles.grid}>
            {vsts.map((vst) => (
              <li key={vst.id} className={styles.card}>
                {vst.cover_image && (
                  <img
                    src={vst.cover_image}
                    alt={vst.name}
                    className={styles.image}
                  />
                )}

                <div className={styles.body}>
                  <p className={styles.developer}>{vst.company_developer}</p>
                  <h3 className={styles.name}>{vst.name}</h3>

                  <div className={styles.tags}>
                    {vst.is_free && <span className={styles.tag}>Free</span>}
                    {vst.is_open_source && (
                      <span className={styles.tag}>Open Source</span>
                    )}
                  </div>

                  <p className={styles.reviewCount}>
                    {vst.reviews.length}{" "}
                    {vst.reviews.length === 1 ? "review" : "reviews"}
                  </p>

                  {vst.website && (
                    <a
                      href={vst.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      Visit website →
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
