import { LoginForm } from "@/app/(auth)/login/_components/login-form";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
