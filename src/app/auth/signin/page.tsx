"use client";

import React, { useState } from "react";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import EducabaLogo from "@/assets/educaba-logo.png";

const formSchema = z.object({
  email: z.string().email("Forneça um email válido."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

type SignInFormValues = z.infer<typeof formSchema>;

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInFormValues) {
    setIsLoading(true);
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setIsLoading(false);
      toast.error("Email ou senha incorretos.");
    } else {
      setIsLoading(false);
      router.push("/");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Image src={EducabaLogo} alt="Logo Educaba" className="max-w-52" />
      <div className="w-full max-w-md rounded-md bg-white dark:bg-gray-900 p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-semibold text-text-title dark:text-white">
          Bem vindo(a) de volta
        </h1>
        <p className="mb-6 text-sm text-text-light dark:text-gray-300">
          Por favor, insira seu endereço de e-mail e senha para login
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-gray-200">E-mail</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="jane.doe@gmail.com"
                      className="border-[#E9F1FF] dark:border-gray-700 dark:bg-gray-800 dark:text-white border"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-gray-200">Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Insira sua senha"
                      className="border-[#E9F1FF] dark:border-gray-700 dark:bg-gray-800 dark:text-white border"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <a
                href="#"
                className="text-sm font-medium text-text-title dark:text-gray-200 hover:underline"
              >
                Esqueceu sua senha?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer bg-blue-primary hover:bg-blue-primary/67 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all duration-300"
            >
              {isLoading && (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              )}
              Entrar
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
