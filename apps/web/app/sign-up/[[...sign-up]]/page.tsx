import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kayıt Ol / Sign Up | ErasmusMobility",
  description: "ErasmusMobility kurumsal kayıt ekranı / Institutional onboarding portal for VET schools and host enterprises.",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <div className="mb-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-black text-xl text-slate-950 hover:text-blue-700 transition-colors"
        >
          <span className="text-2xl">🇪🇺</span>
          <span>ErasmusMobility</span>
        </Link>
        <p className="text-xs text-slate-600 mt-1 font-semibold">
          Mesleki Eğitim Hareketlilik & Ortaklık Platformu • VET Mobility & Partnership Platform
        </p>
      </div>
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/onboarding"
        forceRedirectUrl="/onboarding"
      />
    </div>
  );
}
