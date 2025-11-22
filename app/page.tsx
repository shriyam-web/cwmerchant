import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Users, TrendingUp, Star, ArrowRight, Shield, Clock, Target } from 'lucide-react';
import { Analytics } from "@vercel/analytics/next"
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { SupportWidget } from '@/components/support-widget';
// import { motion } from "framer-motion";
import AnimatedDiv from '@/components/AnimatedDiv';
import HeroContent from '@/components/HeroContent';
import HeroImage from '@/components/HeroImage';

export default function Home() {
  return (
    <>
      <AnimatedDiv>
        <div className="min-h-screen bg-white relative overflow-hidden">
          {/* Floating background blobs */}
          <div className="absolute -top-32 -left-20 w-72 h-72 bg-orange-300/40 rounded-full filter blur-3xl animate-float z-0"></div>
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-purple-300/40 rounded-full filter blur-3xl animate-float z-0"></div>




          <Navbar />

          {/* Hero Section */}
          <section className="relative overflow-hidden pt-20 pb-5">
            {/* Background gradient */}
            {/* <div className="absolute inset-0 bg-gradient-to-br from-gray-600/5 via-transparent to-gray-600/5"></div> */}

            {/* Content wrapper with proper left/right padding */}
            <div className="relative flex flex-col lg:flex-row items-center gap-12 px-8 lg:px-16 max-w-screen-xl mx-auto">
              {/* Left side content */}
              <HeroContent />

              {/* Right side image */}
              <HeroImage />
            </div>
          </section>




          {/* Process Section */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-12">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  How to Join Citywitty Merchant Community
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Simple 4-step process to start growing your business
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    step: "01",
                    title: "Fill the Form",
                    description: "Complete our simple merchant registration form with your business details",
                    icon: <Users className="h-8 w-8 text-gray-600" />
                  },
                  {
                    step: "02",
                    title: "Application Review",
                    description: "Our team monitors applications to avoid fraud and reviews within 48 hours",
                    icon: <Shield className="h-8 w-8 text-emerald-600" />
                  },
                  {
                    step: "03",
                    title: "Complete Profile",
                    description: "Set up your merchant profile and add your products and services",
                    icon: <Target className="h-8 w-8 text-purple-600" />
                  },
                  {
                    step: "04",
                    title: "Start Earning",
                    description: "Get access to premium Citywitty card users and increase your revenue",
                    icon: <TrendingUp className="h-8 w-8 text-green-600" />
                  }
                ].map((item, index) => (
                  <div key={index} className="text-center group">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <Badge variant="secondary" className="absolute -top-2 -right-2 bg-gray-600 text-white">
                        {item.step}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>


          {/* Features Section */}
          <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-12">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Why Choose Citywitty Merchant Hub?
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Powerful tools and insights to help your business thrive
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    title: "Performance Analytics",
                    description: "Track daily and monthly performance with detailed insights and revenue analytics",
                    icon: <TrendingUp className="h-8 w-8" />
                  },
                  {
                    title: "Premium Customer Base",
                    description: "Access to exclusive Citywitty card users who spend more and are loyal",
                    icon: <Star className="h-8 w-8" />
                  },
                  {
                    title: "Easy Offer Management",
                    description: "Create and manage attractive offers to drive more sales and customer engagement",
                    icon: <Target className="h-8 w-8" />
                  },
                  {
                    title: "Digital Support",
                    description: "Request professional banners and marketing materials from our design team",
                    icon: <Shield className="h-8 w-8" />
                  },
                  {
                    title: "Purchase Verification",
                    description: "Secure system to verify and approve customer purchases for rewards",
                    icon: <CheckCircle className="h-8 w-8" />
                  },
                  {
                    title: "Real-time Dashboard",
                    description: "Monitor your business performance with live data and actionable insights",
                    icon: <Clock className="h-8 w-8" />
                  }
                ].map((feature, index) => (
                  <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <div className="text-gray-600">
                          {feature.icon}
                        </div>
                      </div>
                      <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>


          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-r from-orange-400 via-pink-500 to-gray-600">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
                Join thousands of successful merchants already growing with Citywitty
              </p>
              <Link href="/register">
                <Button size="lg" className="bg-white text-gray-600 hover:bg-gray-100 px-12 py-6 text-lg font-semibold">
                  Register as Merchant Now
                </Button>
              </Link>
            </div>
          </section>



          <Footer />
          <SupportWidget />
        </div>
      </AnimatedDiv>
    </>
  );
}