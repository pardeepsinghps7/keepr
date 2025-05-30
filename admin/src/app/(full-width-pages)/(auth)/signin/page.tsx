import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keepr | Sign In",
  description: "",
};

export default function SignIn() {
  return <SignInForm />;
}
