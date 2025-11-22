import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Store, 
  Utensils, 
  Shirt, 
  Laptop, 
  Heart, 
  Car, 
  GraduationCap, 
  Home,
  Coffee,
  Dumbbell,
  Camera,
  Palette,
  ArrowRight
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import Link from 'next/link';

export const metadata = {
  title: 'Merchant Categories - Citywitty Merchant Hub',
  description: 'Explore the wide range of business categories we serve. From restaurants to electronics, fashion to services - join the right category for your business.',
  keywords: 'merchant categories, business types, citywitty merchants, restaurant partners, retail partners'
};

export default function Categories() {
  const categories = [
    {
      title: 'Restaurants & Food',
      description: 'Cafes, restaurants, bakeries, food trucks, and catering services',
      icon: Utensils,
      merchantCount: '2,400+',
      avgGrowth: '89%',
      color: 'bg-orange-100 text-orange-600',
      examples: ['Fine Dining', 'Fast Food', 'Cafes', 'Bakeries', 'Cloud Kitchens']
    },
    {
      title: 'Fashion & Apparel',
      description: 'Clothing stores, boutiques, footwear, and accessories',
      icon: Shirt,
      merchantCount: '1,800+',
      avgGrowth: '124%',
      color: 'bg-pink-100 text-pink-600',
      examples: ['Clothing Stores', 'Boutiques', 'Footwear', 'Accessories', 'Jewelry']
    },
    {
      title: 'Electronics & Gadgets',
      description: 'Mobile phones, laptops, home appliances, and tech accessories',
      icon: Laptop,
      merchantCount: '1,200+',
      avgGrowth: '156%',
      color: 'bg-gray-100 text-gray-600',
      examples: ['Mobile Stores', 'Computer Shops', 'Home Appliances', 'Gaming', 'Accessories']
    },
    {
      title: 'Health & Beauty',
      description: 'Salons, spas, clinics, pharmacies, and wellness centers',
      icon: Heart,
      merchantCount: '950+',
      avgGrowth: '134%',
      color: 'bg-green-100 text-green-600',
      examples: ['Beauty Salons', 'Spas', 'Clinics', 'Pharmacies', 'Wellness Centers']
    },
    {
      title: 'Automotive',
      description: 'Car dealerships, service centers, spare parts, and accessories',
      icon: Car,
      merchantCount: '650+',
      avgGrowth: '98%',
      color: 'bg-gray-100 text-gray-600',
      examples: ['Car Dealers', 'Service Centers', 'Spare Parts', 'Car Accessories', 'Fuel Stations']
    },
    {
      title: 'Education & Training',
      description: 'Coaching institutes, skill development, and educational services',
      icon: GraduationCap,
      merchantCount: '480+',
      avgGrowth: '167%',
      color: 'bg-purple-100 text-purple-600',
      examples: ['Coaching Centers', 'Skill Training', 'Language Classes', 'Music Schools', 'Art Classes']
    },
    {
      title: 'Home & Living',
      description: 'Furniture, home decor, appliances, and interior design',
      icon: Home,
      merchantCount: '720+',
      avgGrowth: '112%',
      color: 'bg-yellow-100 text-yellow-600',
      examples: ['Furniture Stores', 'Home Decor', 'Interior Design', 'Kitchen Appliances', 'Lighting']
    },
    {
      title: 'Cafes & Beverages',
      description: 'Coffee shops, tea stalls, juice bars, and beverage outlets',
      icon: Coffee,
      merchantCount: '890+',
      avgGrowth: '145%',
      color: 'bg-amber-100 text-amber-600',
      examples: ['Coffee Shops', 'Tea Stalls', 'Juice Bars', 'Ice Cream', 'Bakery Cafes']
    },
    {
      title: 'Fitness & Sports',
      description: 'Gyms, sports equipment, fitness centers, and wellness',
      icon: Dumbbell,
      merchantCount: '340+',
      avgGrowth: '189%',
      color: 'bg-red-100 text-red-600',
      examples: ['Gyms', 'Sports Equipment', 'Yoga Studios', 'Fitness Centers', 'Sports Academies']
    },
    {
      title: 'Photography & Events',
      description: 'Photographers, event planners, and entertainment services',
      icon: Camera,
      merchantCount: '280+',
      avgGrowth: '201%',
      color: 'bg-gray-100 text-gray-600',
      examples: ['Photography', 'Event Planning', 'Wedding Services', 'Entertainment', 'Decorations']
    },
    {
      title: 'Professional Services',
      description: 'Legal, financial, consulting, and business services',
      icon: Store,
      merchantCount: '420+',
      avgGrowth: '87%',
      color: 'bg-teal-100 text-teal-600',
      examples: ['Legal Services', 'Financial Advisory', 'Consulting', 'Accounting', 'Insurance']
    },
    {
      title: 'Arts & Crafts',
      description: 'Art supplies, handicrafts, creative workshops, and studios',
      icon: Palette,
      merchantCount: '190+',
      avgGrowth: '213%',
      color: 'bg-cyan-100 text-cyan-600',
      examples: ['Art Supplies', 'Handicrafts', 'Creative Workshops', 'Art Studios', 'Craft Materials']
    }
  ];

  const totalMerchants = categories.reduce((sum, cat) => sum + parseInt(cat.merchantCount.replace(/[^0-9]/g, '')), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gray-100 text-gray-700 border-gray-200">
              {totalMerchants.toLocaleString()}+ Active Merchants
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Business Categories
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-600">
                We Serve
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From local restaurants to tech stores, beauty salons to fitness centers - 
              we support businesses across all major categories with our premium customer network.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 bg-white group">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${category.color}`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          +{category.avgGrowth} avg growth
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-xl text-gray-900 mt-4">{category.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 mb-4 leading-relaxed">{category.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500">Active Merchants:</span>
                      <span className="font-semibold text-gray-900">{category.merchantCount}</span>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <div className="text-sm font-medium text-gray-700">Popular Types:</div>
                      <div className="flex flex-wrap gap-2">
                        {category.examples.slice(0, 3).map((example, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-gray-50 group-hover:border-gray-200 group-hover:text-gray-600"
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Stats Section */}
          <div className="mt-20 bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl p-12 text-white">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Growing Across All Categories</h2>
              <p className="text-xl text-gray-100">
                Our merchants are succeeding in every business vertical
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{totalMerchants.toLocaleString()}+</div>
                <div className="text-gray-100">Total Merchants</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">12</div>
                <div className="text-gray-100">Business Categories</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-gray-100">Cities Covered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">145%</div>
                <div className="text-gray-100">Average Growth</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Don't See Your Category?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We're always expanding to serve more business types. Get in touch with us!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-gray-600 to-gray-600">
                  Register Anyway
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}