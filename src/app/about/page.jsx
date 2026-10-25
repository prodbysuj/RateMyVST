import NavigationBar from "@/components/universal/navigationbar";
import styles from "./page.module.css";

export const metadata = {
  title: "About — RateMyVST",
  description: "Learn what RateMyVST is and why we built it.",
};

export default function About() {
  return (
    <main>
      <NavigationBar />

      <article className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>About</p>
          <h1 className={styles.title}>What is RateMyVST?</h1>
          <p className={styles.lede}>
            A community-driven directory for VST plugins — honest reviews, real
            opinions, no sponsored rankings.
          </p>
        </header>

        <section className={styles.body}>
          <h2>Why we built it</h2>
          <p>
            Finding the right VST plugin is harder than it should be. Search
            results are cluttered with affiliate lists, and most review sites
            prioritise sponsored products over genuinely useful tools. RateMyVST
            exists to fix that — a straightforward place where producers and
            engineers can share what actually works.
          </p>

          <h2>How it works</h2>
          <p>
            Every plugin in the directory is submitted by the community. Ratings
            and reviews come from real users, and nothing is promoted based on
            commercial relationships. Free and open-source plugins sit alongside
            paid ones on equal footing.
          </p>

          <h2>Contributing</h2>
          <p>
            Know a plugin that should be listed? Hit <strong>Submit a Plugin</strong>{" "}
            in the navigation. Have a review to add? Find the plugin in the
            directory and leave your thoughts. The more people contribute, the
            more useful this becomes for everyone.
          </p>
        </section>
      </article>
    </main>
  );
}
