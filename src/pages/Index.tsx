
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        
        {/* Pricing Section */}
        <section id="pricing" className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[30%] right-[5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl" />
          </div>
          
          <div className="container max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose the perfect plan for your needs with our straightforward pricing options.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <div className={cn(
                "glass-panel rounded-2xl p-6 flex flex-col border border-gray-200/70 dark:border-gray-800/70",
                "hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300",
                "animate-scale [animation-delay:100ms]"
              )}>
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Free</h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold">$0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Perfect for individuals and small projects.
                  </p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Up to 3 projects</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Basic syntax highlighting</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>3 collaborators per project</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>7-day history</span>
                  </li>
                </ul>
                <a
                  href="#"
                  className="inline-flex justify-center items-center px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 font-medium text-sm hover:bg-secondary transition-colors"
                >
                  Get Started
                </a>
              </div>
              
              {/* Pro Plan */}
              <div className={cn(
                "glass-panel rounded-2xl p-6 flex flex-col border-2 border-primary",
                "shadow-xl shadow-primary/10 relative",
                "animate-scale [animation-delay:200ms]"
              )}>
                <div className="absolute top-0 right-6 transform -translate-y-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                    Popular
                  </span>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Pro</h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold">$29</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    For professionals and growing teams.
                  </p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Unlimited projects</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Advanced syntax highlighting</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>10 collaborators per project</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>30-day history</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Code execution environment</span>
                  </li>
                </ul>
                <a
                  href="#"
                  className="inline-flex justify-center items-center px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                  Start Free Trial
                </a>
              </div>
              
              {/* Enterprise Plan */}
              <div className={cn(
                "glass-panel rounded-2xl p-6 flex flex-col border border-gray-200/70 dark:border-gray-800/70",
                "hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300",
                "animate-scale [animation-delay:300ms]"
              )}>
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Enterprise</h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold">$99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    For large teams and organizations.
                  </p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>All Pro features</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Unlimited collaborators</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Unlimited history</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Advanced security features</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Dedicated support</span>
                  </li>
                </ul>
                <a
                  href="#"
                  className="inline-flex justify-center items-center px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 font-medium text-sm hover:bg-secondary transition-colors"
                >
                  Contact Sales
                </a>
              </div>
            </div>
          </div>
        </section>
        
        {/* About Section */}
        <section id="about" className="py-20 md:py-28 bg-secondary/50">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="animate-slide-right">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-6">
                  Our Mission
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Building the future of collaborative coding
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  We believe that coding is better when done together. Our platform enables teams of any size to collaborate in real-time, with tools built for the modern development workflow.
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                  Founded by a team of developers frustrated with existing collaboration tools, CodeTide aims to make remote collaboration as seamless as working side by side.
                </p>
              </div>
              <div className="glass-panel rounded-2xl overflow-hidden border shadow-xl shadow-primary/5 animate-slide-left">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <div className="text-center p-8">
                    <h3 className="text-2xl font-bold mb-4">Our Values</h3>
                    <ul className="space-y-4 text-left max-w-md mx-auto">
                      <li className="flex items-start">
                        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-primary font-medium">1</span>
                        </span>
                        <p><strong>Simplicity</strong> — We believe that the best tools get out of your way.</p>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-primary font-medium">2</span>
                        </span>
                        <p><strong>Quality</strong> — We're committed to building products that developers love.</p>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-primary font-medium">3</span>
                        </span>
                        <p><strong>Collaboration</strong> — We're building for teams first, not individuals.</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
          </div>
          
          <div className="container max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-slide-up">
              Ready to start collaborating?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up [animation-delay:100ms]">
              Join thousands of developers who are already using CodeTide to build better software together.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-slide-up [animation-delay:200ms]">
              <a
                href="/editor"
                className="inline-flex justify-center items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Try it for free
              </a>
              <a
                href="#pricing"
                className="inline-flex justify-center items-center px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 font-medium hover:bg-secondary transition-colors"
              >
                View pricing
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
