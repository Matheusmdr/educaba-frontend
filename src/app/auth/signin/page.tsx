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

import EducabaLogo from "@/assets/educaba-logo.png"
import Image from "next/image";

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
    <div className="flex min-h-screen flex-col items-center justify-center  p-4">
      <Image src={EducabaLogo} alt="Logo Educaba" className="max-w-52"/>
      <div className="w-full max-w-md rounded-md bg-white p-6">
        <h1 className="mb-4 text-2xl font-semibold text-text-title">
          Bem vindo(a) de volta
        </h1>
        <p className="mb-6 text-sm text-text-light">
          Por favor, insira seu endereço de e-mail e senha para login
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="jane.doe@gmail.com" className="border-[#E9F1FF] border rounded-xl text-text-title" {...field} />
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
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Insira sua senha"
                      className="border-[#E9F1FF] border rounded-xl text-text-title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <a href="#" className="text-sm font-medium text-text-title hover:underline">
                Esqueceu sua senha?
              </a>
            </div>

            <Button type="submit" className="w-full cursor-pointer bg-blue-primary hover:bg-blue-primary/67 transition-all duration-300 rounded-xl">
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
