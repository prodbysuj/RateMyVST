import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <main style={{ display: "flex", justifyContent: "center", padding: "4rem 1.5rem" }}>
      <Suspense>
        <SignIn />
      </Suspense>
    </main>
  );
}
