import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertTriangle, Shield, FileText } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'Terms & Conditions - Citywitty Merchant Hub',
  description: 'Read the terms and conditions for Citywitty merchants. Understand your rights, responsibilities, and guidelines for being a merchant partner.',
  keywords: 'merchant terms, conditions, guidelines, merchant agreement, citywitty policy'
};

export default function Terms() {
  const sections = [
    {
      title: 'Merchant Eligibility',
      icon: CheckCircle,
      color: 'text-green-600',
      items: [
        'Must be a legitimate business with proper registration',
        'Valid GST registration (where applicable)',
        'Physical business location required',
        'Minimum 6 months of business operation',
        'Good business reputation and customer reviews'
      ]
    },
    {
      title: 'Quality Standards',
      icon: Shield,
      color: 'text-blue-600',
      items: [
        'Maintain high-quality products and services',
        'Provide accurate product descriptions and pricing',
        'Honor all promotional offers and discounts',
        'Ensure timely delivery and service completion',
        'Maintain professional customer service standards'
      ]
    },
    {
      title: 'Commission & Payments',
      icon: FileText,
      color: 'text-purple-600',
      items: [
        'Standard commission rate: 3-5% per transaction',
        'Payments processed within 7 business days',
        'Minimum payout threshold: ₹500',
        'TDS deductions as per government regulations',
        'Monthly detailed transaction reports provided'
      ]
    },
    {
      title: 'Prohibited Activities',
      icon: AlertTriangle,
      color: 'text-red-600',
      items: [
        'Fraudulent activities or misrepresentation',
        'Selling counterfeit or illegal products',
        'Discriminatory practices against customers',
        'Violation of local laws and regulations',
        'Spam or unsolicited marketing communications'
      ]
    }
  ];

  const policies = [
    {
      title: 'Account Suspension',
      content: 'Accounts may be suspended for policy violations, fraud, or quality issues. Merchants will be notified and given opportunity to resolve issues before permanent action.'
    },
    {
      title: 'Data Privacy',
      content: 'Customer data shared through Citywitty must be handled in compliance with privacy laws. Merchants cannot use customer data for marketing without explicit consent.'
    },
    {
      title: 'Dispute Resolution',
      content: 'All disputes will be resolved through our internal mediation process. Escalation to legal proceedings will be the last resort after exhausting all internal options.'
    },
    {
      title: 'Platform Updates',
      content: 'Citywitty reserves the right to update platform features, commission structures, and policies with 30 days advance notice to all merchants.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
              Merchant Agreement
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Terms & Conditions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Understanding your rights, responsibilities, and guidelines as a Citywitty merchant partner.
              Please read these terms carefully before joining our platform.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last Updated: January 15, 2025 | Version 2.1
            </p>
          </div>

          {/* Key Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card key={index} className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${section.color}`} />
                      </div>
                      <CardTitle className="text-xl text-gray-900">{section.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-3">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Detailed Policies */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Detailed Policies</h2>
              <p className="text-lg text-gray-600">
                Important policies and procedures you should be aware of
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {policies.map((policy, index) => (
                <Card key={index} className="border-0 shadow-md bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">{policy.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{policy.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Additional Terms */}
          <Card className="mt-16 border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Additional Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Agreement Duration</h3>
                <p className="text-gray-700 leading-relaxed">
                  This agreement is effective from the date of merchant approval and continues indefinitely 
                  unless terminated by either party with 30 days written notice.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Intellectual Property</h3>
                <p className="text-gray-700 leading-relaxed">
                  Merchants retain ownership of their brand, products, and content. Citywitty retains 
                  rights to platform technology, processes, and customer data analytics.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Liability & Insurance</h3>
                <p className="text-gray-700 leading-relaxed">
                  Merchants are responsible for product quality, customer satisfaction, and legal compliance. 
                  Citywitty provides platform services but is not liable for merchant business operations.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Contact Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  For questions about these terms or merchant policies, contact us at{' '}
                  <a href="mailto:legal@citywitty.com" className="text-blue-600 hover:underline">
                    legal@citywitty.com
                  </a>{' '}
                  or call our merchant helpline at{' '}
                  <a href="tel:+919876543210" className="text-blue-600 hover:underline">
                    +91 98765 43210
                  </a>.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Agreement Notice */}
          <div className="text-center mt-12 p-8 bg-blue-50 rounded-2xl border border-blue-200">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Ready to Accept These Terms?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              By registering as a merchant, you agree to these terms and conditions. 
              Our team will guide you through the onboarding process.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Register as Merchant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}