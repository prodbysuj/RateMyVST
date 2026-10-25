"use server";

import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitReview(vstId, vstSlug, reviewText, stars) {
  // Auth check — must be signed in
  const user = await currentUser();
  if (!user) {
    return { error: "You must be signed in to leave a review." };
  }

  const username = user.username ?? user.firstName ?? user.emailAddresses[0]?.emailAddress ?? "Anonymous";
  const email = user.emailAddresses[0]?.emailAddress ?? null;

  if (!reviewText || reviewText.trim().length < 10) {
    return { error: "Review must be at least 10 characters." };
  }

  const starsFloat = parseFloat(stars);
  if (isNaN(starsFloat) || starsFloat < 1 || starsFloat > 5) {
    return { error: "Please provide a star rating between 1 and 5." };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("reviews").insert({
    vst_id: vstId,
    username,
    Email: email,
    review_text: reviewText.trim(),
    stars: starsFloat,
    review_date: new Date().toISOString(),
  });

  if (error) {
    return { error: `Could not submit review: ${error.message}` };
  }

  // Revalidate the page so the new review appears immediately
  revalidatePath(`/${vstSlug}`);
  return { success: true };
}
