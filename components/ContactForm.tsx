"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LoaderCircle } from "lucide-react";
import { contactCopy, type ContactLanguage } from "@/lib/copy";

type Values = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  message: string;
};

export function ContactForm({ language }: { language: ContactLanguage }) {
  const t = contactCopy[language];
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const schema = Yup.object({
    firstName: Yup.string()
      .trim()
      .required(t.required)
      .min(2, t.firstNameLength)
      .max(60, t.firstNameLength),
    lastName: Yup.string().trim().max(60, t.lastNameLength),
    email: Yup.string().trim().email(t.emailInvalid).max(100, t.emailLength),
    phone: Yup.string()
      .trim()
      .test(
        "phone",
        t.phoneInvalid,
        (value) =>
          !value ||
          (/^[+\d\s-]+$/.test(value) &&
            (value.match(/\d/g)?.length ?? 0) >= 8 &&
            (value.match(/\d/g)?.length ?? 0) <= 20),
      ),
    company: Yup.string().trim().max(100, t.companyLength),
    message: Yup.string().max(1000, t.messageLength),
  }).test("contact", t.contactRequired, (values) =>
    Boolean(values.email?.trim() || values.phone?.trim()),
  );

  const formik = useFormik<Values>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    },
    validationSchema: schema,
    onSubmit: async (values, helpers) => {
      setStatus("idle");
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!response.ok) throw new Error("Request failed");
        formik.resetForm();
        setStatus("success");
      } catch {
        setStatus("error");
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });
  const error = (field: keyof Values) =>
    formik.touched[field] && formik.errors[field];
  const contactError =
    formik.submitCount > 0 && !formik.values.email && !formik.values.phone
      ? t.contactRequired
      : undefined;

  return (
    <form
      onSubmit={formik.handleSubmit}
      noValidate
      className="rounded-3xl border border-[#142B3B]/10 bg-white p-6 shadow-[0_24px_70px_rgba(20,43,59,0.08)] sm:p-9"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {(
          [
            ["firstName", t.firstName, t.firstNamePlaceholder],
            ["lastName", t.lastName, t.lastNamePlaceholder],
            ["email", t.emailLabel, t.emailPlaceholder],
            ["phone", t.phone, t.phonePlaceholder],
            ["company", t.company, t.companyPlaceholder],
          ] as const
        ).map(([name, label, placeholder]) => (
          <label
            key={name}
            className={name === "company" ? "sm:col-span-2" : ""}
          >
            <span className="mb-2 block text-sm font-bold">{label}</span>
            <input
              {...formik.getFieldProps(name)}
              id={name}
              type={name === "email" ? "email" : "text"}
              dir={name === "email" || name === "phone" ? "ltr" : undefined}
              placeholder={placeholder}
              aria-invalid={Boolean(error(name) || contactError)}
              aria-describedby={
                error(name) || contactError ? `${name}-error` : undefined
              }
              className="w-full rounded-2xl border border-[#142B3B]/15 bg-[#F7F5EF]/55 px-4 py-3.5 text-[#142B3B] outline-none transition placeholder:text-[#142B3B]/40 focus:border-[#19A7A0] focus:ring-4 focus:ring-[#19A7A0]/10"
            />
            {(error(name) ||
              ((name === "email" || name === "phone") && contactError)) && (
              <span
                id={`${name}-error`}
                className="mt-1.5 block text-sm text-red-700"
              >
                {error(name) || contactError}
              </span>
            )}
          </label>
        ))}
        <label className="sm:col-span-2">
          <span className="mb-2 block text-sm font-bold">{t.message}</span>
          <textarea
            {...formik.getFieldProps("message")}
            rows={5}
            placeholder={t.messagePlaceholder}
            aria-invalid={Boolean(error("message"))}
            aria-describedby={error("message") ? "message-error" : undefined}
            className="w-full resize-y rounded-2xl border border-[#142B3B]/15 bg-[#F7F5EF]/55 px-4 py-3.5 text-[#142B3B] outline-none transition placeholder:text-[#142B3B]/40 focus:border-[#19A7A0] focus:ring-4 focus:ring-[#19A7A0]/10"
          />
          <span className="mt-1.5 block text-end text-xs text-[#142B3B]/50">
            {formik.values.message.length}/1000 {t.characters}
          </span>
          {error("message") && (
            <span id="message-error" className="block text-sm text-red-700">
              {error("message")}
            </span>
          )}
        </label>
      </div>
      <div aria-live="polite" className="mt-5" role="status">
        {status === "success" && (
          <p className="rounded-2xl bg-[#19A7A0]/10 p-4 text-sm font-semibold text-[#142B3B]">
            {t.success}
          </p>
        )}
        {status === "error" && (
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            <span>{t.error}</span>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="shrink-0 font-bold underline"
            >
              {t.retry}
            </button>
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#19A7A0] px-6 py-3.5 font-bold text-white transition hover:bg-[#148b86] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {formik.isSubmitting && (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        )}
        {formik.isSubmitting ? t.sending : t.submit}
      </button>
    </form>
  );
}
