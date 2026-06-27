import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Connexion administrateur",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-4xl">❄️</span>
          <h1 className="mt-3 text-xl font-bold text-gray-900">Espace administrateur</h1>
          <p className="mt-1 text-sm text-gray-500">TropChaud</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white px-8 py-8 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
