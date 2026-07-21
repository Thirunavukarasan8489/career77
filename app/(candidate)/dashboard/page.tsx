import { redirect } from "next/navigation";

export default function CandidateDashboardRedirect() {
  redirect("/candidate/profile");
}
