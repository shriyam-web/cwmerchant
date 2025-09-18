// app/contact/ContactForm.tsx
"use client";
import React, { useState } from "react";

export default function ContactForm() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [sent, setSent] = useState(false);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleEmail(e: React.FormEvent) {
        e.preventDefault();
        const subject = encodeURIComponent(
            "[CityWitty Merchant Support] " + (form.name || "Merchant")
        );
        const body = encodeURIComponent(
            `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nMessage:\n${form.message}`
        );
        window.location.href = `mailto:support.merchant@citywitty.com?subject=${subject}&body=${body}`;
        setSent(true);
    }

    function handleWhatsApp(e: React.FormEvent) {
        e.preventDefault();
        const whatsappNumber = "916389202030"; // +91 country code
        const message = encodeURIComponent(
            `New Merchant Support Request:\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nMessage:\n${form.message}`
        );
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
        setSent(true);
    }

    return (
        <section className="max-w-5xl mx-auto px-6 py-16">
            <div className="bg-white shadow-md rounded-2xl overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                    {/* LEFT INFO */}
                    <div className="p-10">
                        <h1 className="text-3xl font-extrabold">
                            Contact CityWitty Merchant Hub
                        </h1>
                        <p className="mt-4 text-gray-700">
                            If you face any issue with onboarding, payments, listings, or
                            premium services — write to us and our Merchant Support team will
                            reply promptly. You can also reach us on WhatsApp or phone.
                        </p>

                        <div className="mt-6 space-y-4">
                            <div>
                                <h3 className="font-semibold">📧 Email</h3>
                                <a
                                    href="mailto:support.merchant@citywitty.com"
                                    className="text-indigo-600"
                                >
                                    support.merchant@citywitty.com
                                </a>
                            </div>

                            <div>
                                <h3 className="font-semibold">💬 WhatsApp</h3>
                                <a
                                    href="https://wa.me/916389202030"
                                    target="_blank"
                                    className="text-indigo-600"
                                >
                                    +91 6389 202 030
                                </a>
                            </div>

                            <div>
                                <h3 className="font-semibold">📞 Call Support</h3>
                                <a href="tel:+916389202030" className="text-indigo-600">
                                    +91 6389 202 030
                                </a>
                            </div>

                            <div>
                                <h3 className="font-semibold">Response Time</h3>
                                <p className="text-gray-700">
                                    We typically respond within 24–48 hours on business days.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold">Support Hours</h3>
                                <p className="text-gray-700">Mon — Sat: 9:30 AM — 6:30 PM IST</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT FORM */}
                    <div className="p-10 bg-indigo-50">
                        <h2 className="text-2xl font-bold">Write to Merchant Support</h2>
                        <p className="mt-2 text-gray-700">
                            Fill this quick form and choose Email or WhatsApp to reach us
                            instantly.
                        </p>

                        <form className="mt-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Full name
                                </label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full rounded-lg border-gray-200 shadow-sm p-3"
                                    placeholder="e.g. Ramesh Kumar"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full rounded-lg border-gray-200 shadow-sm p-3"
                                    placeholder="your@business.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Phone (WhatsApp)
                                </label>
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-lg border-gray-200 shadow-sm p-3"
                                    placeholder="+91 9XXXXXXXXX"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="mt-1 w-full rounded-lg border-gray-200 shadow-sm p-3"
                                    placeholder="Describe the issue or your request in detail"
                                />
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={handleEmail}
                                    className="inline-flex items-center px-5 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow hover:shadow-lg"
                                >
                                    Send via Email
                                </button>

                                <button
                                    onClick={handleWhatsApp}
                                    className="inline-flex items-center px-5 py-3 rounded-full bg-green-600 text-white font-semibold shadow hover:shadow-lg"
                                >
                                    Send via WhatsApp
                                </button>

                                <a
                                    href="tel:+916389202030"
                                    className="inline-flex items-center px-5 py-3 rounded-full border border-gray-600 text-gray-700 font-semibold hover:bg-gray-100"
                                >
                                    Call Support
                                </a>
                            </div>

                            {sent && (
                                <p className="text-sm text-green-700">
                                    Request initiated — please confirm in your Email/WhatsApp app.
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
