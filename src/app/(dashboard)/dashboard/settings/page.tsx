import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account settings</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Account</h2>
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-gray-500">Email</dt>
            <dd className="text-gray-900 mt-0.5">{user.email}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Full Name</dt>
            <dd className="text-gray-900 mt-0.5">
              {profile?.full_name || "Not set"}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Member since</dt>
            <dd className="text-gray-900 mt-0.5">
              {new Date(user.created_at).toLocaleDateString()}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
