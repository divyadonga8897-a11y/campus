"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { adminService } from "@/services/adminService";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GraduationCap, ShieldAlert } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type LoginFields = z.infer<typeof loginSchema>;

export default function AdminLoginClient() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = async (data: LoginFields) => {
    setErrorMessage("");
    setSubmitting(true);
    
    const res = await adminService.login(data.email, data.password);
    setSubmitting(false);

    if (res.success) {
      router.push("/admin/dashboard");
    } else {
      setErrorMessage(res.error || "Invalid credentials. Access denied.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16 font-sans">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0 opacity-40 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-indigo-100/40 blur-2xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="p-8 sm:p-10 border border-slate-200/50 shadow-xl shadow-slate-900/5 bg-white rounded-3xl space-y-8">
          {/* Header Branding */}
          <div className="space-y-4 text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-md shadow-primary/5">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                SSIET Admin Console
              </span>
              <h1 className="font-display font-extrabold text-xl text-text-dark tracking-tight">
                Gateway Login
              </h1>
              <p className="text-[10px] text-text-gray font-medium max-w-xs mx-auto leading-relaxed">
                Enter administrative credentials to access CMS control panels and parameters settings.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {errorMessage && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-[10px] font-bold text-left leading-relaxed">
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="admin@ssiet.ac.in"
                error={errors.email?.message}
                disabled={submitting}
                {...register("email")}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                disabled={submitting}
                {...register("password")}
              />
            </div>

            <Button
              type="submit"
              loading={submitting}
              fullWidth
              className="bg-gradient-to-r from-primary to-indigo-600 border-none shadow-md shadow-indigo-500/10 py-3 mt-2"
            >
              Sign In to Console
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
