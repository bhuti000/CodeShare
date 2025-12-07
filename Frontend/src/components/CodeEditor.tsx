import Editor from "@monaco-editor/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  Download, 
  Share2, 
  Save, 
  Play,
  Settings,
  ChevronDown
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "ruby", label: "Ruby" },
  { value: "php", label: "PHP" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "sql", label: "SQL" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
  { value: "yaml", label: "YAML" },
];

const DEFAULT_CODE = `// Welcome to CodeShare!
// Start typing your code here...

function greet(name: string): string {
  return \`Hello, \${name}! Welcome to CodeShare.\`;
}

// Example usage
const message = greet("Developer");
console.log(message);

// Features:
// - Real-time collaboration
// - Syntax highlighting for 100+ languages
// - Version history
// - Line-by-line comments`;

interface CodeEditorProps {
  initialCode?: string;
  initialLanguage?: string;
  title?: string;
  readOnly?: boolean;
}

export function CodeEditor({ 
  initialCode = DEFAULT_CODE, 
  initialLanguage = "typescript",
  title = "",
  readOnly = false 
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(initialLanguage);
  const [snippetTitle, setSnippetTitle] = useState(title);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const handleSave = () => {
    toast.success("Snippet saved successfully!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card overflow-hidden shadow-xl"
    >
      {/* Editor Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/70" />
            <div className="w-3 h-3 rounded-full bg-accent/70" />
            <div className="w-3 h-3 rounded-full bg-primary/70" />
          </div>
          <Input
            value={snippetTitle}
            onChange={(e) => setSnippetTitle(e.target.value)}
            placeholder="Untitled Snippet"
            className="max-w-[200px] h-8 bg-transparent border-none focus:ring-0 text-sm font-medium"
            disabled={readOnly}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Select value={language} onValueChange={setLanguage} disabled={readOnly}>
            <SelectTrigger className="w-[140px] h-8 text-xs bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
          {!readOnly && (
            <Button variant="hero" size="sm" className="h-8" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          )}
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="h-[400px] md:h-[500px]">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => setCode(value || "")}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            minimap: { enabled: false },
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            glyphMargin: true,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 4,
            renderLineHighlight: "all",
            cursorBlinking: "smooth",
            smoothScrolling: true,
            readOnly,
          }}
        />
      </div>

      {/* Editor Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-secondary/30 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Lines: {code.split("\n").length}</span>
          <span>Characters: {code.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="language" className="text-xs">
            {LANGUAGES.find((l) => l.value === language)?.label || language}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
}
