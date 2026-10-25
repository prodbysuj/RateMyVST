"use client";

import { useState, useTransition } from "react";
import { submitReview } from "./actions";
import styles from "./page.module.css";

const STAR_OPTIONS = [1, 2, 3, 4, 5];

export default function ReviewForm({ vstId, vstSlug }) {
  const [text, setText] = useState("");
  const [stars, setStars] = useState(0);       // 0 = nothing selected yet
  const [hovered, setHovered] = useState(0);
  const [message, setMessage] = useState(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    if (stars === 0) {
      setMessage({ type: "error", text: "Please select a star rating." });
      return;
    }

    startTransition(async () => {
      const result = await submitReview(vstId, vstSlug, text, stars);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Review submitted — thanks!" });
        setText("");
        setStars(0);
      }
    });
  }

  const displayStars = hovered || stars;

  return (
    <form onSubmit={handleSubmit} className={styles.reviewForm}>
      <h3 className={styles.formHeading}>Leave a Review</h3>

      {/* Star picker */}
      <div className={styles.starPicker} role="group" aria-label="Star rating">
        {STAR_OPTIONS.map((n) => (
          <button
            key={n}
            type="button"
            className={`${styles.starBtn} ${n <= displayStars ? styles.starFilled : ""}`}
            onClick={() => setStars(n)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            disabled={isPending}
          >
            ★
          </button>
        ))}
        {stars > 0 && (
          <span className={styles.starLabel}>{stars} / 5</span>
        )}
      </div>

      <textarea
        className={styles.textarea}
        placeholder="Share your thoughts on this plugin…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        required
        minLength={10}
        disabled={isPending}
        aria-label="Review text"
      />

      {message && (
        <p className={message.type === "error" ? styles.formError : styles.formSuccess}>
          {message.text}
        </p>
      )}

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isPending || text.trim().length < 10 || stars === 0}
      >
        {isPending ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
