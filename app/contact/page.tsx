import { Navbar } from "@/components/navbar";
import ContactForm from "./ContactForm";
import { Footer } from "@/components/footer";

export const metadata = {
    title: "Contact Us — CityWitty Merchant Hub",
    description:
        "Need help? Contact CityWitty Merchant Hub support for merchant onboarding, payments, listings, and premium plans. Get help via email, WhatsApp, or phone.",
    keywords: [
        "CityWitty Merchant Hub",
        "merchant support",
        "contact",
        "merchant help",
        "merchant WhatsApp support",
    ].join(", "),
};

export default function ContactPage() {
    return (
        <>
            <Navbar />
            <br /><br />
            <main className="min-h-screen bg-gray-50 text-gray-900">

                <ContactForm />
            </main>
            <Footer />
        </>
    );
}