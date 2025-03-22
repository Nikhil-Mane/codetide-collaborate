
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-3xl transform rotate-45" />
        <div className="absolute -bottom-[30%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Subtle chip above heading */}
        <div className="flex justify-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Now in public beta
          </div>
        </div>

        {/* Hero content */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-slide-up [animation-delay:100ms]">
            <span className="block">Real-Time Collaborative</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
              Code Editor
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up [animation-delay:200ms]">
            Experience seamless collaboration with syntax highlighting, real-time updates, and integrated debugging tools in a beautifully designed environment.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-slide-up [animation-delay:300ms]">
            <Button asChild size="lg" className="rounded-full px-8 py-6 text-base">
              <Link to="/editor">
                Try Editor Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 py-6 text-base">
              <a href="#features">
                Learn More
              </a>
            </Button>
          </div>
        </div>

        {/* Code snippet preview */}
        <div className="mt-16 md:mt-20 max-w-4xl mx-auto animate-slide-up [animation-delay:400ms]">
          <div className={cn(
            "glass-panel rounded-xl overflow-hidden",
            "border border-gray-200 dark:border-gray-800",
            "shadow-xl shadow-primary/5"
          )}>
            <div className="flex items-center px-4 py-2 bg-secondary/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
              <div className="flex space-x-2 mr-4">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 text-xs font-medium text-center text-muted-foreground">
                index.js - CodeTide Editor
              </div>
            </div>
            <div className="p-4 md:p-6 text-sm md:text-base font-mono bg-background/50 text-left overflow-x-auto">
              <pre className="language-javascript">
                <code className="text-xs md:text-sm whitespace-pre text-left">
                  <span className="text-blue-600">import</span> <span className="text-amber-600">React</span> <span className="text-blue-600">from</span> <span className="text-green-600">'react'</span>;<br/>
                  <br/>
                  <span className="text-purple-600">function</span> <span className="text-amber-600">App</span>() {'{'}<br/>
                  {'  '}<span className="text-blue-600">const</span> <span className="text-amber-600">[count, setCount]</span> = <span className="text-amber-600">React</span>.<span className="text-blue-600">useState</span>(<span className="text-purple-600">0</span>);<br/>
                  <br/>
                  {'  '}<span className="text-purple-600">return</span> (<br/>
                  {'    '}&lt;<span className="text-amber-600">div</span> <span className="text-blue-600">className</span>=<span className="text-green-600">"app"</span>&gt;<br/>
                  {'      '}&lt;<span className="text-amber-600">h1</span>&gt;Collaborative Editing&lt;/<span className="text-amber-600">h1</span>&gt;<br/>
                  {'      '}&lt;<span className="text-amber-600">p</span>&gt;You clicked {'{'}count{'}'} times&lt;/<span className="text-amber-600">p</span>&gt;<br/>
                  {'      '}&lt;<span className="text-amber-600">button</span> <span className="text-blue-600">onClick</span>={'{'}() =&gt; <span className="text-amber-600">setCount</span>(<span className="text-amber-600">count</span> + <span className="text-purple-600">1</span>){'}'}&gt;<br/>
                  {'        '}Click me<br/>
                  {'      '}&lt;/<span className="text-amber-600">button</span>&gt;<br/>
                  {'    '}&lt;/<span className="text-amber-600">div</span>&gt;<br/>
                  {'  '});<br/>
                  {'}'}<br/>
                  <br/>
                  <span className="text-blue-600">export</span> <span className="text-blue-600">default</span> <span className="text-amber-600">App</span>;<br/>
                </code>
              </pre>
            </div>
            {/* Collaboration indicators */}
            <div className="absolute top-1/3 left-[60%] h-4 w-0.5 bg-yellow-400 animate-cursor-blink rounded"></div>
            <div className="absolute top-2/3 left-[30%] h-4 w-0.5 bg-blue-400 animate-cursor-blink [animation-delay:500ms] rounded"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
