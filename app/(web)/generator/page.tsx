"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  Copy,
  Download,
  FileText,
  Info,
  Layers,
  Play,
  Settings,
  Upload,
  X
} from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface UploadedSVG {
  id: string;
  name: string;
  content: string;
  size: number;
  preview: string;
}

interface SpriteConfig {
  mode: "css" | "symbol" | "stack" | "defs";
  layout: "packed" | "horizontal" | "vertical" | "diagonal";
  padding: number;
  prefix: string;
  cssPrefix: string;
  dimensions: boolean;
  sprite: {
    dest: string;
    prefix: string;
  };
  css: {
    dest: string;
    prefix: string;
    dimensions: boolean;
    sprite: string;
  };
}

export default function GeneratorPage() {
  const [svgFiles, setSvgFiles] = useState<UploadedSVG[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generatedSprite, setGeneratedSprite] = useState<string>("");
  const [generatedCSS, setGeneratedCSS] = useState<string>("");
  const [copied, setCopied] = useState<"sprite" | "css" | null>(null);

  const [config, setConfig] = useState<SpriteConfig>({
    mode: "css",
    layout: "packed",
    padding: 2,
    prefix: "icon-",
    cssPrefix: ".icon-",
    dimensions: true,
    sprite: {
      dest: "sprite.svg",
      prefix: "icon-%s",
    },
    css: {
      dest: "sprite.css",
      prefix: ".icon-%s",
      dimensions: true,
      sprite: "sprite.svg",
    },
  });






  const removeSVG = (id: string) => {
    setSvgFiles((prev) => prev.filter((svg) => svg.id !== id));
  };

  const generateSprite = async () => {
    if (svgFiles.length === 0) return;

    setGenerating(true);

    // Simulate sprite generation (in real app, this would use svg-sprite package on server)
    setTimeout(() => {
      // Mock generated sprite
      const mockSprite = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    ${svgFiles
      .map(
        (svg) => `
    <symbol id="${config.prefix}${svg.name}" viewBox="0 0 24 24">
      ${svg.content.replace(/<svg[^>]*>|<\/svg>/g, "")}
    </symbol>`
      )
      .join("")}
  </defs>
</svg>`;

      const mockCSS = svgFiles
        .map(
          (svg) => `
${config.cssPrefix}${svg.name} {
  width: 24px;
  height: 24px;
  background: url('sprite.svg#${config.prefix}${svg.name}') no-repeat;
}`
        )
        .join("\n");

      setGeneratedSprite(mockSprite);
      setGeneratedCSS(mockCSS);
      setGenerating(false);
    }, 2000);
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (content: string, type: "sprite" | "css") => {
    navigator.clipboard.writeText(content);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  // Dropzone setup
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const newSVG: UploadedSVG = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name.replace(".svg", ""),
          content,
          size: file.size,
          preview: `data:image/svg+xml;base64,${btoa(content)}`,
        };
        setSvgFiles((prev) => [...prev, newSVG]);
      };
      reader.readAsText(file);
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/svg+xml": [".svg"] },
    multiple: true,
  });

  return (
    <main className="min-h-screen pt-16 bg-background">
      {/* Simple Heading */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 mt-10 mb-4">
        <h1 className="text-2xl font-bold text-primary mb-2">
          SVG Sprite Generator
        </h1>
      </div>

      {/* Uploader - full width */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8">
        <Card className="p-0">
          <CardHeader className="border-b border-border py-3 px-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Upload className="w-5 h-5" />
              Upload SVG Files
            </CardTitle>
          </CardHeader>
          <CardContent className="py-6 px-2 sm:px-6">
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 bg-muted/60 cursor-pointer ${
                isDragActive
                  ? "border-primary bg-accent/20"
                  : "border-border hover:border-primary/60"
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    Drop SVG files here
                  </h3>
                  <p className="text-muted-foreground">
                    or click to browse and select multiple SVG files
                  </p>
                </div>
                <Button type="button" variant="outline">
                  Choose SVG Files
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Settings + Preview/Output grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Settings Card - multi-column */}
        <div className="space-y-8">
          <Card>
            <CardHeader className="border-b border-border py-3 px-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings className="w-5 h-5" />
                Advanced Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sprite Mode */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    Sprite Mode{" "}
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </Label>
                  <Select
                    value={config.mode}
                    onValueChange={(
                      value: "css" | "symbol" | "stack" | "defs"
                    ) => setConfig((prev) => ({ ...prev, mode: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="css">CSS Sprites</SelectItem>
                      <SelectItem value="symbol">Symbol Sprites</SelectItem>
                      <SelectItem value="stack">Stack Sprites</SelectItem>
                      <SelectItem value="defs">Defs Sprites</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Layout */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    Layout <Info className="w-4 h-4 text-muted-foreground" />
                  </Label>
                  <Select
                    value={config.layout}
                    onValueChange={(
                      value: "packed" | "horizontal" | "vertical" | "diagonal"
                    ) => setConfig((prev) => ({ ...prev, layout: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="packed">Packed</SelectItem>
                      <SelectItem value="horizontal">Horizontal</SelectItem>
                      <SelectItem value="vertical">Vertical</SelectItem>
                      <SelectItem value="diagonal">Diagonal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Padding */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    Padding <Info className="w-4 h-4 text-muted-foreground" />
                  </Label>
                  <Slider
                    value={[config.padding]}
                    onValueChange={([value]) =>
                      setConfig((prev) => ({ ...prev, padding: value }))
                    }
                    max={20}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
                {/* Prefix */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    Icon Prefix{" "}
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </Label>
                  <Input
                    value={config.prefix}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, prefix: e.target.value }))
                    }
                    placeholder="icon-"
                  />
                </div>
                {/* CSS Prefix */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    CSS Prefix{" "}
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </Label>
                  <Input
                    value={config.cssPrefix}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        cssPrefix: e.target.value,
                      }))
                    }
                    placeholder=".icon-"
                  />
                </div>
                {/* Output File Names */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    Sprite Output Name{" "}
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </Label>
                  <Input
                    value={config.sprite.dest}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        sprite: { ...prev.sprite, dest: e.target.value },
                      }))
                    }
                    placeholder="sprite.svg"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    CSS Output Name{" "}
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </Label>
                  <Input
                    value={config.css.dest}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        css: { ...prev.css, dest: e.target.value },
                      }))
                    }
                    placeholder="sprite.css"
                  />
                </div>
                {/* Advanced Options */}
                <div className="flex items-center gap-2">
                  <Switch
                    checked={config.dimensions}
                    onCheckedChange={(checked) =>
                      setConfig((prev) => ({ ...prev, dimensions: checked }))
                    }
                  />
                  <Label>Include Dimensions</Label>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2">
                  <Switch />
                  <Label>Include XML Declaration</Label>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2">
                  <Switch />
                  <Label>Include DOCTYPE</Label>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2">
                  <Switch />
                  <Label>Optimize SVGs (SVGO)</Label>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2">
                  <Switch />
                  <Label>Generate Example HTML</Label>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <Separator className="my-6" />
              <Button
                onClick={generateSprite}
                disabled={svgFiles.length === 0 || generating}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Generate Sprite
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Preview/Output Tabs */}
        <div className="space-y-8">
          {/* Uploaded Files Preview */}
          {svgFiles.length > 0 && (
            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Layers className="w-5 h-5" />
                    Uploaded SVGs ({svgFiles.length})
                  </span>
                  <Button
                    onClick={() => setSvgFiles([])}
                    variant="outline"
                    size="sm"
                  >
                    Clear All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  <AnimatePresence>
                    {svgFiles.map((svg) => (
                      <motion.div
                        key={svg.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative group bg-background rounded-lg p-4 hover:bg-accent/20 border border-border transition-colors"
                      >
                        <button
                          onClick={() => removeSVG(svg.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove SVG"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="aspect-square bg-muted rounded-md flex items-center justify-center mb-2 p-2">
                          <div
                            className="w-full h-full"
                            dangerouslySetInnerHTML={{ __html: svg.content }}
                          />
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-medium text-primary truncate">
                            {svg.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(svg.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Output Tabs */}
          {(generatedSprite || generatedCSS) && (
            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Generated Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="sprite" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="sprite">SVG Sprite</TabsTrigger>
                    <TabsTrigger value="css">CSS File</TabsTrigger>
                    <TabsTrigger value="html">Example HTML</TabsTrigger>
                  </TabsList>
                  <TabsContent value="sprite" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">sprite.svg</h4>
                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            copyToClipboard(generatedSprite, "sprite")
                          }
                          variant="outline"
                          size="sm"
                        >
                          {copied === "sprite" ? (
                            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 mr-1" />
                          )}
                          {copied === "sprite" ? "Copied!" : "Copy"}
                        </Button>
                        <Button
                          onClick={() =>
                            downloadFile(
                              generatedSprite,
                              "sprite.svg",
                              "image/svg+xml"
                            )
                          }
                          size="sm"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="bg-muted rounded-lg p-4 max-h-64 overflow-auto">
                      <pre className="text-sm text-muted-foreground">
                        <code>{generatedSprite}</code>
                      </pre>
                    </div>
                  </TabsContent>
                  <TabsContent value="css" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">sprite.css</h4>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyToClipboard(generatedCSS, "css")}
                          variant="outline"
                          size="sm"
                        >
                          {copied === "css" ? (
                            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 mr-1" />
                          )}
                          {copied === "css" ? "Copied!" : "Copy"}
                        </Button>
                        <Button
                          onClick={() =>
                            downloadFile(generatedCSS, "sprite.css", "text/css")
                          }
                          size="sm"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="bg-muted rounded-lg p-4 max-h-64 overflow-auto">
                      <pre className="text-sm text-muted-foreground">
                        <code>{generatedCSS}</code>
                      </pre>
                    </div>
                  </TabsContent>
                  <TabsContent value="html" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">example.html</h4>
                      <Button
                        onClick={() =>
                          downloadFile(
                            "<html>...</html>",
                            "example.html",
                            "text/html"
                          )
                        }
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                    <div className="bg-muted rounded-lg p-4 max-h-64 overflow-auto">
                      <pre className="text-sm text-muted-foreground">
                        <code>{"<!-- Example HTML output here -->"}</code>
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
