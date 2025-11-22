import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import Link from 'next/link';

export const metadata = {
  title: 'Success Stories - Citywitty Merchant Hub',
  description: 'Discover how merchants are growing their business with Citywitty. Read inspiring success stories and case studies.',
  keywords: 'merchant success, business growth, citywitty case studies, merchant testimonials'
};

export default function SuccessStories() {
  const stories = [
    {
      name: 'Raj Electronics Store',
      owner: 'Rajesh Kumar',
      category: 'Electronics',
      location: 'New Delhi',
      growth: '147%',
      revenue: '₹8.5L monthly',
      image: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=400',
      quote: "Citywitty transformed my business completely. Within 6 months, our revenue increased by 147% and we now have loyal customers who visit us regularly.",
      metrics: [
        { label: 'Revenue Growth', value: '147%', icon: TrendingUp },
        { label: 'New Customers', value: '1,200+', icon: Users },
        { label: 'Customer Rating', value: '4.9/5', icon: Star }
      ]
    },
    {
      name: 'Spice Garden Restaurant',
      owner: 'Priya Sharma',
      category: 'Food & Beverages',
      location: 'Mumbai',
      growth: '89%',
      revenue: '₹12.3L monthly',
      image: 'https://images.pexels.com/photos/776538/pexels-photo-776538.jpeg?auto=compress&cs=tinysrgb&w=400',
      quote: "The premium customers from Citywitty really appreciate quality food. Our restaurant is now fully booked most evenings!",
      metrics: [
        { label: 'Revenue Growth', value: '89%', icon: TrendingUp },
        { label: 'Monthly Diners', value: '2,500+', icon: Users },
        { label: 'Repeat Customers', value: '78%', icon: Star }
      ]
    },
    {
      name: 'Fashion Forward Boutique',
      owner: 'Anjali Verma',
      category: 'Fashion & Apparel',
      location: 'Bangalore',
      growth: '203%',
      revenue: '₹6.8L monthly',
      image: 'https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg?auto=compress&cs=tinysrgb&w=400',
      quote: "Citywitty customers have great taste and spending power. They've helped us establish our boutique as a premium destination.",
      metrics: [
        { label: 'Revenue Growth', value: '203%', icon: TrendingUp },
        { label: 'Premium Sales', value: '85%', icon: Users },
        { label: 'Brand Rating', value: '4.8/5', icon: Star }
      ]
    },
    {
      name: 'Wellness Spa Center',
      owner: 'Dr. Kavita Singh',
      category: 'Health & Beauty',
      location: 'Pune',
      growth: '156%',
      revenue: '₹9.2L monthly',
      image: 'https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=400',
      quote: "The quality of customers through Citywitty is exceptional. They value our premium services and have become our most loyal clients.",
      metrics: [
        { label: 'Service Growth', value: '156%', icon: TrendingUp },
        { label: 'VIP Clients', value: '450+', icon: Users },
        { label: 'Satisfaction', value: '4.9/5', icon: Star }
      ]
    },
    {
      name: 'TechRepair Pro',
      owner: 'Amit Patel',
      category: 'Repair Services',
      location: 'Ahmedabad',
      growth: '234%',
      revenue: '₹4.5L monthly',
      image: 'https://images.pexels.com/photos/298864/pexels-photo-298864.jpeg?auto=compress&cs=tinysrgb&w=400',
      quote: "From a small repair shop to the go-to service center in the area. Citywitty customers trust us with their expensive devices.",
      metrics: [
        { label: 'Business Growth', value: '234%', icon: TrendingUp },
        { label: 'Repair Jobs', value: '800+/month', icon: Users },
        { label: 'Trust Rating', value: '4.8/5', icon: Star }
      ]
    },
    {
      name: 'Green Grocery Market',
      owner: 'Sunita Joshi',
      category: 'Grocery & Fresh',
      location: 'Jaipur',
      growth: '178%',
      revenue: '₹7.1L monthly',
      image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=400',
      quote: "Organic and premium products are what Citywitty customers prefer. We've completely transformed our inventory to cater to their needs.",
      metrics: [
        { label: 'Sales Growth', value: '178%', icon: TrendingUp },
        { label: 'Regular Customers', value: '950+', icon: Users },
        { label: 'Quality Rating', value: '4.7/5', icon: Star }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-700 border-green-200">
              Real Success Stories
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Merchants Growing with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-600">
                Citywitty
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover how thousands of merchants across India are transforming their businesses 
              and achieving remarkable growth with our premium customer network.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-gray-600 to-gray-600 hover:from-gray-700 hover:to-gray-700">
                Start Your Success Story
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Success Stories Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {stories.map((story, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={story.image} 
                    alt={story.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-gray-900 border-0">
                      {story.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-600 text-white border-0">
                      +{story.growth} Growth
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-gray-900">{story.name}</CardTitle>
                      <p className="text-gray-600 mt-1">by {story.owner} • {story.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-600">{story.revenue}</div>
                      <div className="text-sm text-gray-500">Monthly Revenue</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <blockquote className="text-gray-700 italic mb-6 leading-relaxed">
                    "{story.quote}"
                  </blockquote>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {story.metrics.map((metric, metricIndex) => {
                      const Icon = metric.icon;
                      return (
                        <div key={metricIndex} className="text-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Icon className="h-5 w-5 text-gray-600" />
                          </div>
                          <div className="text-lg font-bold text-gray-900">{metric.value}</div>
                          <div className="text-xs text-gray-600">{metric.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16 bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Write Your Success Story?</h2>
            <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
              Join thousands of successful merchants and start growing your business today
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-white text-gray-600 hover:bg-gray-100">
                Register as Merchant Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}