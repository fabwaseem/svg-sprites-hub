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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  Copy,
  Download,
  FileText,
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
  mode: "css" | "symbol";
  layout: "packed" | "horizontal" | "vertical";
  padding: number;
  prefix: string;
  cssPrefix: string;
  sprite: {
    dest: string;
  };
  css: {
    dest: string;
  };
}

export default function GeneratorPage() {
  const [svgFiles, setSvgFiles] = useState<UploadedSVG[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generatedSprite, setGeneratedSprite] = useState<string>("");
  const [generatedCSS, setGeneratedCSS] = useState<string>("");
  const [generatedHTML, setGeneratedHTML] = useState<string>("");
  const [copied, setCopied] = useState<"sprite" | "css" | "html" | null>(null);

  const [config, setConfig] = useState<SpriteConfig>({
    mode: "symbol",
    layout: "packed",
    padding: 2,
    prefix: "icon-",
    cssPrefix: ".icon-",
    sprite: {
      dest: "sprite.svg",
    },
    css: {
      dest: "sprite.css",
    },
  });

  // Extract SVGs from sprite file if it contains symbols
  const extractSVGsFromSprite = (content: string, fileName: string): UploadedSVG[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'image/svg+xml');
    const symbols = doc.querySelectorAll('symbol');

    if (symbols.length > 0) {
      // This is a sprite file, extract individual SVGs from symbols
      return Array.from(symbols).map((symbol, index) => {
        const id = symbol.getAttribute('id') || `symbol-${index}`;
        const viewBox = symbol.getAttribute('viewBox') || '0 0 24 24';
        const innerHTML = symbol.innerHTML;

        // Create individual SVG from symbol
        const individualSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${innerHTML}</svg>`;

        return {
          id: Math.random().toString(36).substr(2, 9),
          name: id.replace(/^(icon-|ico-)/i, ''), // Remove common prefixes
          content: individualSVG,
          size: individualSVG.length,
          preview: `data:image/svg+xml;base64,${btoa(individualSVG)}`,
        };
      });
    }

    // Regular SVG file
    return [{
      id: Math.random().toString(36).substr(2, 9),
      name: fileName.replace(/\.svg$/i, ""),
      content,
      size: content.length,
      preview: `data:image/svg+xml;base64,${btoa(content)}`,
    }];
  };

  const extractSVGContent = (svgString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');

    if (!svgElement) return { innerHTML: '', viewBox: '0 0 24 24' };

    // Get viewBox or create one from width/height
    let viewBox = svgElement.getAttribute('viewBox');
    if (!viewBox) {
      const width = svgElement.getAttribute('width') || '24';
      const height = svgElement.getAttribute('height') || '24';
      viewBox = `0 0 ${width} ${height}`;
    }

    // Get inner content
    const innerHTML = svgElement.innerHTML;

    return { innerHTML, viewBox };
  };

  const removeSVG = (id: string) => {
    setSvgFiles((prev) => prev.filter((svg) => svg.id !== id));
  };

  const generateSprite = async () => {
    if (svgFiles.length === 0) return;

    setGenerating(true);

    setTimeout(() => {
      if (config.mode === "symbol") {
        // Generate symbol-based sprite
        const symbols = svgFiles.map((svg) => {
          const { innerHTML, viewBox } = extractSVGContent(svg.content);
          return `    <symbol id="${config.prefix}${svg.name}" viewBox="${viewBox}">
      ${innerHTML}
    </symbol>`;
        }).join('\n');

        const sprite = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
${symbols}
  </defs>
</svg>`;

        const css = svgFiles.map((svg) => {
          return `${config.cssPrefix}${svg.name} {
  width: 1em;
  height: 1em;
  fill: currentColor;
}`;
        }).join('\n\n');

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SVG Sprite Example</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 2rem; }
    .icon-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem; margin-top: 2rem; }
    .icon-item { text-align: center; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 8px; }
    .icon { width: 24px; height: 24px; margin: 0 auto 0.5rem; }
    ${css}
  </style>
</head>
<body>
  <!-- Include the sprite at the beginning of your HTML -->
  ${sprite}

  <h1>SVG Sprite Icons</h1>
  <p>Usage: &lt;svg class="icon"&gt;&lt;use href="#${config.prefix}icon-name"&gt;&lt;/use&gt;&lt;/svg&gt;</p>

  <div class="icon-grid">
${svgFiles.map((svg) => `    <div class="icon-item">
      <svg class="icon ${config.cssPrefix.replace('.', '')}${svg.name}">
        <use href="#${config.prefix}${svg.name}"></use>
      </svg>
      <div>${svg.name}</div>
    </div>`).join('\n')}
  </div>
</body>
</html>`;

        setGeneratedSprite(sprite);
        setGeneratedCSS(css);
        setGeneratedHTML(html);
      } else {
        // Generate CSS sprite (background-image based)
        let spriteWidth = 0;
        let spriteHeight = 24;

        if (config.layout === "horizontal") {
          spriteWidth = svgFiles.length * 24;
          spriteHeight = 24;
        } else if (config.layout === "vertical") {
          spriteWidth = 24;
          spriteHeight = svgFiles.length * 24;
        } else {
          // Packed layout - simple grid
          const cols = Math.ceil(Math.sqrt(svgFiles.length));
          spriteWidth = cols * 24;
          spriteHeight = Math.ceil(svgFiles.length / cols) * 24;
        }

        const sprite = `<svg xmlns="http://www.w3.org/2000/svg" width="${spriteWidth}" height="${spriteHeight}">
${svgFiles.map((svg, index) => {
          const { innerHTML } = extractSVGContent(svg.content);
          let x = 0, y = 0;

          if (config.layout === "horizontal") {
            x = index * 24;
            y = 0;
          } else if (config.layout === "vertical") {
            x = 0;
            y = index * 24;
          } else {
            // Packed layout
            const cols = Math.ceil(Math.sqrt(svgFiles.length));
            x = (index % cols) * 24;
            y = Math.floor(index / cols) * 24;
          }

          return `  <g transform="translate(${x}, ${y})">
    ${innerHTML}
  </g>`;
        }).join('\n')}
</svg>`;

        const css = svgFiles.map((svg, index) => {
          let x = 0, y = 0;

          if (config.layout === "horizontal") {
            x = index * 24;
            y = 0;
          } else if (config.layout === "vertical") {
            x = 0;
            y = index * 24;
          } else {
            const cols = Math.ceil(Math.sqrt(svgFiles.length));
            x = (index % cols) * 24;
            y = Math.floor(index / cols) * 24;
          }

          return `${config.cssPrefix}${svg.name} {
  width: 24px;
  height: 24px;
  background: url('${config.sprite.dest}') -${x}px -${y}px no-repeat;
  display: inline-block;
}`;
        }).join('\n\n');

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSS Sprite Example</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 2rem; }
    .icon-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem; margin-top: 2rem; }
    .icon-item { text-align: center; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 8px; }
    ${css}
  </style>
</head>
<body>
  <h1>CSS Sprite Icons</h1>
  <p>Usage: &lt;span class="${config.cssPrefix.replace('.', '')}icon-name"&gt;&lt;/span&gt;</p>

  <div class="icon-grid">
${svgFiles.map((svg) => `    <div class="icon-item">
      <span class="${config.cssPrefix.replace('.', '')}${svg.name}"></span>
      <div>${svg.name}</div>
    </div>`).join('\n')}
  </div>
</body>
</html>`;

        setGeneratedSprite(sprite);
        setGeneratedCSS(css);
        setGeneratedHTML(html);
      }

      setGenerating(false);
    }, 1500);
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

  const copyToClipboard = (content: string, type: "sprite" | "css" | "html") => {
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

        // Check if this is a sprite file or individual SVG
        const extractedSVGs = extractSVGsFromSprite(content, file.name);
        setSvgFiles((prev) => [...prev, ...extractedSVGs]);
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
        <p className="text-muted-foreground">
          Upload individual SVGs or existing sprite files. If you upload a
          sprite, we&apos;ll extract the symbols automatically.
        </p>
      </div>

      {/* Uploader - full width */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8">
        <Card className="p-0">
          <CardHeader className="border-b border-border py-3 px-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Upload className="w-5 h-5" />
              Upload SVG Files or Sprite Files
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
                    Upload individual SVG files or existing sprite files with
                    symbols
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
        {/* Settings Card */}
        <div className="space-y-8">
          <Card>
            <CardHeader className="border-b border-border py-3 px-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings className="w-5 h-5" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Sprite Mode */}
                <div className="space-y-2">
                  <Label>Sprite Mode</Label>
                  <Select
                    value={config.mode}
                    onValueChange={(value: "css" | "symbol") =>
                      setConfig((prev) => ({ ...prev, mode: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="symbol">
                        Symbol Sprites (Recommended)
                      </SelectItem>
                      <SelectItem value="css">
                        CSS Background Sprites
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Layout (only for CSS mode) */}
                {config.mode === "css" && (
                  <div className="space-y-2">
                    <Label>Layout</Label>
                    <Select
                      value={config.layout}
                      onValueChange={(
                        value: "packed" | "horizontal" | "vertical"
                      ) => setConfig((prev) => ({ ...prev, layout: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="packed">Packed Grid</SelectItem>
                        <SelectItem value="horizontal">Horizontal</SelectItem>
                        <SelectItem value="vertical">Vertical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Padding */}
                <div className="space-y-2">
                  <Label>Padding: {config.padding}px</Label>
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
                  <Label>Icon Prefix</Label>
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
                  <Label>CSS Class Prefix</Label>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sprite File Name</Label>
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
                    <Label>CSS File Name</Label>
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
                </div>
              </div>

              <Separator className="my-6" />

              <Button
                onClick={generateSprite}
                disabled={svgFiles.length === 0 || generating}
                className="w-full"
                size="lg"
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Generate Sprite ({svgFiles.length} icons)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Preview/Output */}
        <div className="space-y-8">
          {/* Uploaded Files Preview */}
          {svgFiles.length > 0 && (
            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Layers className="w-5 h-5" />
                    SVG Icons ({svgFiles.length})
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
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-64 overflow-y-auto">
                  <AnimatePresence>
                    {svgFiles.map((svg) => (
                      <motion.div
                        key={svg.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative group bg-muted/50 rounded-lg p-3 hover:bg-muted transition-colors"
                      >
                        <button
                          onClick={() => removeSVG(svg.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove SVG"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="aspect-square bg-background rounded-md flex items-center justify-center mb-2 p-2">
                          <div
                            className="w-full h-full max-w-6 max-h-6"
                            dangerouslySetInnerHTML={{ __html: svg.content }}
                          />
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-medium text-foreground truncate">
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
          {(generatedSprite || generatedCSS || generatedHTML) && (
            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Generated Files
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <Tabs defaultValue="sprite" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="sprite">SVG Sprite</TabsTrigger>
                    <TabsTrigger value="css">CSS File</TabsTrigger>
                    <TabsTrigger value="html">Example HTML</TabsTrigger>
                  </TabsList>

                  <TabsContent value="sprite" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{config.sprite.dest}</h4>
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
                              config.sprite.dest,
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
                      <h4 className="font-semibold">{config.css.dest}</h4>
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
                            downloadFile(
                              generatedCSS,
                              config.css.dest,
                              "text/css"
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
                        <code>{generatedCSS}</code>
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="html" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">example.html</h4>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyToClipboard(generatedHTML, "html")}
                          variant="outline"
                          size="sm"
                        >
                          {copied === "html" ? (
                            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 mr-1" />
                          )}
                          {copied === "html" ? "Copied!" : "Copy"}
                        </Button>
                        <Button
                          onClick={() =>
                            downloadFile(
                              generatedHTML,
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
                    </div>
                    <div className="bg-muted rounded-lg p-4 max-h-64 overflow-auto">
                      <pre className="text-sm text-muted-foreground">
                        <code>{generatedHTML}</code>
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