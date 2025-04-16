
import React, { useState, useEffect } from 'react';
import CodeEditor from '@/components/CodeEditor';
import FlowchartDisplay from '@/components/FlowchartDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateFlowchart } from '@/services/api';
import { Code2, Github, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Define a custom FlowChart icon since it doesn't exist in lucide-react
const FlowChart = function FlowChart(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <rect x="9" y="15" width="6" height="6" rx="1" />
      <path d="M6 9v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9" />
      <path d="M12 12v3" />
    </svg>
  );
};

const exampleCode = `#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "Enter a number: ";
    cin >> n;
    
    if (n > 0) {
        cout << "Positive number";
    } else if (n < 0) {
        cout << "Negative number";
    } else {
        cout << "Zero";
    }
    
    return 0;
}`;

const Index = () => {
  const [code, setCode] = useState(exampleCode);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [plantUmlCode, setPlantUmlCode] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const { toast } = useToast();

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleSaveApiKey = () => {
    localStorage.setItem('openai_api_key', apiKey);
    setIsOpenDialog(false);
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been saved.",
    });
  };

  const handleGenerateFlowchart = async () => {
    if (!code.trim()) {
      toast({
        title: "No code provided",
        description: "Please enter some C++ code first.",
        variant: "destructive",
      });
      return;
    }

    const savedApiKey = localStorage.getItem('openai_api_key');
    if (!savedApiKey) {
      setIsOpenDialog(true);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await generateFlowchart(code);
      setImageUrl(result.imageUrl);
      setPlantUmlCode(result.plantUmlCode);
      toast({
        title: "Flowchart generated",
        description: "Your flowchart has been successfully created.",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate flowchart');
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to generate flowchart',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-screen flex-col gap-6 py-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FlowChart className="h-8 w-8 text-cppblue-600" />
          <h1 className="text-2xl font-bold text-cppblue-800">C++ Flow Magic</h1>
        </div>
        <div className="flex items-center gap-4">
          <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Key size={16} />
                <span>API Key</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>OpenAI API Key</DialogTitle>
                <DialogDescription>
                  Enter your OpenAI API key to generate accurate flowcharts from your C++ code.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <Input
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Your API key is stored locally in your browser and never sent to our servers.
                </p>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleSaveApiKey} disabled={!apiKey}>
                  Save Key
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <a
            href="https://github.com/yourusername/cpp-flow-magic"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Github size={16} />
            <span>GitHub</span>
          </a>
        </div>
      </header>

      <main className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="flex flex-col">
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-cppblue-500" />
              <h2 className="font-medium">C++ Code</h2>
            </div>
            <Button onClick={handleGenerateFlowchart} disabled={loading}>
              {loading ? "Generating..." : "Generate Flowchart"}
            </Button>
          </div>
          <CardContent className="flex-1 p-0">
            <div className="h-[calc(100vh-250px)]">
              <CodeEditor code={code} setCode={setCode} />
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-2">
              <FlowChart className="h-5 w-5 text-cppblue-500" />
              <h2 className="font-medium">Generated Flowchart</h2>
            </div>
          </div>
          <CardContent className="flex-1 p-0">
            <Tabs defaultValue="visual" className="h-full">
              <div className="border-b border-border px-4">
                <TabsList className="bg-transparent">
                  <TabsTrigger value="visual">Visual</TabsTrigger>
                  <TabsTrigger value="plantuml">PlantUML Code</TabsTrigger>
                </TabsList>
              </div>
              <div className="h-[calc(100vh-295px)]">
                <TabsContent value="visual" className="h-full mt-0 p-4">
                  <FlowchartDisplay imageUrl={imageUrl} loading={loading} error={error} />
                </TabsContent>
                <TabsContent value="plantuml" className="h-full mt-0 p-4">
                  {plantUmlCode ? (
                    <div className="h-full w-full overflow-auto rounded-md border border-border bg-muted p-4">
                      <pre className="font-mono text-sm">{plantUmlCode}</pre>
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <p className="text-muted-foreground">Generate a flowchart to see the PlantUML code</p>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <footer className="text-center text-sm text-muted-foreground">
        <p>Built with React, TypeScript, and OpenAI. Flowcharts powered by PlantUML.</p>
      </footer>
    </div>
  );
};

export default Index;
