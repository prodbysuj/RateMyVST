import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignUpPage() {
  return (
    <main style={{ display: "flex", justifyContent: "center", padding: "4rem 1.5rem" }}>
      <Suspense>
        <SignUp />
      </Suspense>
    </main>
  );
}
