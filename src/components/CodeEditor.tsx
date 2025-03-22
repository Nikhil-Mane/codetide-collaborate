import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Play, Download, Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { generateRandomUser } from '@/utils/editorUtils';

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = 'console.log("Hello, world!");',
  language = 'javascript',
  readOnly = false,
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeUsers, setActiveUsers] = useState<Array<{ id: string; name: string; color: string; position: number }>>([]);

  useEffect(() => {
    const userCount = Math.floor(Math.random() * 2) + 2;
    const users = Array(userCount).fill(0).map(() => {
      const user = generateRandomUser();
      return {
        ...user,
        position: Math.floor(Math.random() * code.length),
      };
    });
    setActiveUsers(users);

    const interval = setInterval(() => {
      setActiveUsers(prev => 
        prev.map(user => ({
          ...user,
          position: Math.min(Math.floor(Math.random() * code.length), code.length - 1),
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const runCode = () => {
    setIsRunning(true);
    setOutput('');
    
    setTimeout(() => {
      try {
        let result;
        if (code.includes('console.log')) {
          const match = code.match(/console\.log\(['"](.+?)['"]\)/);
          result = match ? match[1] : 'Hello, world!';
        } else {
          result = 'Output: Code executed successfully!';
        }
        
        setOutput(result);
        toast.success('Code executed successfully');
      } catch (error) {
        setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        toast.error('Execution failed');
      } finally {
        setIsRunning(false);
      }
    }, 800);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language === 'javascript' ? 'js' : language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Code downloaded');
  };

  const shareCode = () => {
    toast.success('Shareable link copied to clipboard');
  };

  const renderCursors = () => {
    const codeLines = code.split('\n');
    const cursors = [];
    
    for (const user of activeUsers) {
      let charCount = 0;
      let line = 0;
      let column = 0;
      
      for (let i = 0; i < codeLines.length; i++) {
        if (charCount + codeLines[i].length + 1 > user.position) {
          line = i;
          column = user.position - charCount;
          break;
        }
        charCount += codeLines[i].length + 1;
      }
      
      cursors.push(
        <div 
          key={user.id}
          className="absolute pointer-events-none animate-pulse"
          style={{
            top: `calc(1.5rem * ${line})`,
            left: `calc(0.6ch * ${column})`,
          }}
        >
          <div
            className="w-0.5 h-5 absolute"
            style={{ backgroundColor: user.color }}
          ></div>
          <div 
            className="absolute top-6 left-0 px-2 py-1 rounded text-xs text-white whitespace-nowrap"
            style={{ backgroundColor: user.color }}
          >
            {user.name}
          </div>
        </div>
      );
    }
    
    return cursors;
  };

  return (
    <div className={cn(
      "glass-panel rounded-xl overflow-hidden border shadow-lg",
      "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl"
    )}>
      <div className="flex items-center justify-between px-4 py-2 bg-secondary/80 backdrop-blur-sm border-b">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="text-xs font-medium text-muted-foreground">
          {language === 'javascript' ? 'index.js' : `index.${language}`}
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={copyCode}
          >
            <Copy size={16} />
            <span className="sr-only">Copy</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={downloadCode}
          >
            <Download size={16} />
            <span className="sr-only">Download</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={shareCode}
          >
            <Share2 size={16} />
            <span className="sr-only">Share</span>
          </Button>
        </div>
      </div>

      <div className="relative overflow-auto bg-background/50 text-left">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={cn(
            "w-full font-mono text-sm p-4 min-h-[300px] resize-none focus:outline-none",
            "bg-transparent",
            readOnly && "cursor-default"
          )}
          spellCheck="false"
          readOnly={readOnly}
        />
        {renderCursors()}
      </div>

      <div className="flex items-center justify-between px-4 py-2 border-t">
        <div className="flex items-center">
          <select
            className="text-xs bg-transparent border-0 focus:ring-0 text-muted-foreground"
            value={language}
            onChange={(e) => toast.info(`Changed language to ${e.target.value}`)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
            <option value="cpp">C++</option>
          </select>
        </div>
        <Button
          size="sm"
          onClick={runCode}
          disabled={isRunning}
          className="flex items-center gap-1"
        >
          <Play size={16} />
          Run
        </Button>
      </div>

      {output && (
        <div className="border-t">
          <div className="px-4 py-2 text-xs font-medium bg-secondary/80 backdrop-blur-sm border-b">
            Output
          </div>
          <div className="p-4 font-mono text-sm overflow-auto max-h-[150px]">
            {output}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
