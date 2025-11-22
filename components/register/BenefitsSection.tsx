import { Users, TrendingUp, Shield, Globe } from 'lucide-react';

const benefits = [
  {
    icon: Users,
    title: 'Increased Customer Base',
    description: 'Access to 50,000+ active CityWitty cardholders'
  },
  {
    icon: TrendingUp,
    title: 'Boost Revenue',
    description: 'Average 30% increase in sales for partner merchants'
  },
  {
    icon: Shield,
    title: 'Guaranteed Payments',
    description: 'Secure and timely payment processing'
  },
  {
    icon: Globe,
    title: 'Marketing Support',
    description: 'Featured placement on our platform and marketing materials'
  }
];

export default function BenefitsSection() {
  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {benefits.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Icon className="w-12 h-12 text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
