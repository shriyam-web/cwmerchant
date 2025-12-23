// import { Header } from '@/components/layout/header';
// import { Footer } from '@/components/layout/footer';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { Metadata } from 'next';


export default function TermsPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />
            <br /> <br />
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-4xl font-bold mb-8">Terms & Conditions for the CW Merchant Partners</h1>

                <p className="mb-6">
                    Welcome to CityWitty Merchant Hub (CWMH). By registering as a merchant partner, you agree to comply with the following terms and conditions. Please read these carefully before proceeding with your registration.
                </p>

                <h2 className="text-2xl font-semibold mb-4">1. Eligibility</h2>
                <p className="mb-4">
                    To register as a merchant, you must have a legally recognized business entity, valid GST and PAN numbers, and operate within the regions supported by CityWitty Merchant Hub. By registering, you confirm that all information provided is accurate and truthful.
                </p>

                <h2 className="text-2xl font-semibold mb-4">2. Account Registration</h2>
                <p className="mb-4">
                    You must complete the registration form with accurate details, including business name, owner name, contact information, GST and PAN numbers, and any other requested information. Providing false or misleading information may result in immediate termination of your registration.
                </p>

                <h2 className="text-2xl font-semibold mb-4">3. Merchant Responsibilities</h2>
                <ul className="list-disc list-inside mb-4">
                    <li>Offer valid discounts as agreed upon during registration.</li>
                    <li>Ensure products and services meet quality and safety standards.</li>
                    <li>Maintain accurate and up-to-date contact and business information.</li>
                    <li>Comply with all applicable laws, regulations, and taxation requirements.</li>
                </ul>

                <h2 className="text-2xl font-semibold mb-4">4. Payment and Fees</h2>
                <p className="mb-4">
                    CityWitty may charge service fees, commissions, or other agreed-upon charges. Payments will be processed securely and in accordance with the agreed schedule. Delayed or non-compliant services may result in payment withholding.
                </p>

                <h2 className="text-2xl font-semibold mb-4">5. Content and Marketing</h2>
                <p className="mb-4">
                    By partnering with CityWitty Merchant Hub, you allow your business information, promotions, and offers to be displayed on our platform and marketing materials. All marketing content must be truthful, not infringe on third-party rights, and comply with applicable laws.
                </p>

                <h2 className="text-2xl font-semibold mb-4">6. Termination</h2>
                <p className="mb-4">
                    CityWitty Merchant Hub reserves the right to suspend or terminate any merchant account at its discretion, including for non-compliance with these terms, fraudulent activities, or failure to maintain agreed standards. Termination may occur with or without prior notice.
                </p>

                <h1 className='text-xl font-bold mb-4'>6A. Termination by Merchant (Voluntary Exit) </h1>
                <p>
                    If a Merchant Partner chooses to discontinue or terminate services from CityWitty Merchant Hub (CWMH) at their own discretion, the following terms shall apply:
                    <br /> <br />
                    i. Annual Plan Commitment
                    Merchant Partners are required to opt for an annual billing plan, payable in full at the time of onboarding.
                    If a merchant chooses an installment-based payment option (monthly or quarterly), the annual plan value remains binding and applicable.

                    <br /> <br />
                    ii. Non-Refundable Setup & First Quarter Charges
                    Any amount paid to CityWitty or its authorized representatives during the first quarter of the subscription period shall be treated as a basic setup and onboarding fee, which includes but is not limited to:
                    <br />
                    - Merchant dashboard setup
                    <br />
                    - Website design and development
                    <br />
                    - Social media account creation and setup
                    <br />
                    - Google Business Profile setup
                    <br />
                    - Initial branding, listings, and platform integration
                    <br />

                    These charges are non-refundable under any circumstances, irrespective of whether the merchant exits early or discontinues services.

                    <br /> <br />
                    iii. Liability for Services Rendered
                    The merchant agrees to bear the full cost of:

                    All services rendered

                    Development work completed

                    Marketing, branding, and promotional activities executed
                    during the active subscription period up to the termination date.

                    <br /> <br />

                    iv. No Adjustment Based on Installments
                    Termination rights or financial obligations are not linked to the payment frequency (monthly/quarterly).
                    The merchant’s liability is determined by the services already performed, not by the installment amount paid.

                    <br /> <br />
                    v. Outstanding Dues
                    Any pending service fees, development charges, or agreed commercial dues up to the termination date must be cleared in full before account closure.
                    <br /> <br />

                vi. Effect of Termination
                    Upon termination initiated by the merchant:

                    Access to CityWitty Merchant Hub services may be discontinued

                    Listings, offers, and promotions may be removed from the platform

                    CityWitty shall not be liable for any loss of business, visibility, or data arising from such termination</p>
                <br />

                vii. By proceeding with OTP verification of the Merchant Hub, you agree that you have read and accepted all CityWitty Merchant Terms & Conditions available at <a href="https://partner.citywitty.com/terms">https://partner.citywitty.com/terms</a>.

                <br /> <br />
                <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
                <p className="mb-4">
                    CityWitty Merchant Hub is not liable for any indirect, incidental, or consequential damages arising from your participation in the program, including lost revenue or reputational damage. Your sole remedy is limited to the termination of the partnership in accordance with these terms.
                </p>

                <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
                <p className="mb-4">
                    These terms and your registration are governed by the laws of India. Any disputes shall be subject to the jurisdiction of the competent courts in Noida, Uttar Pradesh.
                </p>

                <p className="text-gray-600 mt-8">
                    By completing the merchant registration, you acknowledge that you have read, understood, and agree to abide by these Terms & Conditions.
                </p>

                <br />
                <p>CityWitty Merchant Hub is a part of CityWitty's ecosystem.</p>
            </section>


        </main>
    );
}
