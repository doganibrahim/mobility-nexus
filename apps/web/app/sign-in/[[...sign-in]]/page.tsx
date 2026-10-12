import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Giriş Yap / Sign In | ErasmusMobility",
  description: "ErasmusMobility kurumsal giriş ekranı / Secure institutional login portal for VET schools and host partners.",
};

export default function SignInPage() {
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
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </div>
  );
}
