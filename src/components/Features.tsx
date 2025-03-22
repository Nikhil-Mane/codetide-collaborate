
import React from 'react';
import { 
  Users, 
  Code, 
  FileCode, 
  Terminal, 
  History, 
  ShieldCheck 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description, className }) => (
  <div className={cn(
    "glass-panel rounded-2xl p-6 transition-all duration-300 ease-in-out",
    "border border-gray-200/70 dark:border-gray-800/70 hover:border-primary/20",
    "hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1",
    className
  )}>
    <div className="flex flex-col items-start gap-4">
      <div className="p-3 rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Users strokeWidth={1.5} size={24} />,
      title: "Real-Time Collaboration",
      description: "Work together with your team in real-time, seeing everyone's changes instantly as they type."
    },
    {
      icon: <Code strokeWidth={1.5} size={24} />,
      title: "Syntax Highlighting",
      description: "Enjoy beautiful syntax highlighting for over 100+ programming languages and frameworks."
    },
    {
      icon: <FileCode strokeWidth={1.5} size={24} />,
      title: "Code Formatting",
      description: "Automatic code formatting and linting keeps your code clean and consistent."
    },
    {
      icon: <Terminal strokeWidth={1.5} size={24} />,
      title: "Integrated Debugging",
      description: "Debug your code directly in the browser with our powerful integrated debugging tools."
    },
    {
      icon: <History strokeWidth={1.5} size={24} />,
      title: "Version History",
      description: "Track changes over time with complete version history and the ability to revert when needed."
    },
    {
      icon: <ShieldCheck strokeWidth={1.5} size={24} />,
      title: "Secure Environment",
      description: "Your code is executed in a secure, sandboxed environment to prevent security risks."
    }
  ];

  return (
    <section id="features" className="py-20 md:py-28 relative overflow-hidden">
      {/* Background element */}
      <div className="absolute -inset-x-40 top-0 h-40 bg-gradient-to-b from-background to-transparent"></div>
      
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for seamless collaborative coding in one elegant platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              className={`animate-scale [animation-delay:${index * 100}ms]`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
