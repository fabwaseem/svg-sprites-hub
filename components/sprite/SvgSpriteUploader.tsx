"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileImage, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import isSvg from "is-svg";

interface SvgSpriteUploaderProps {
  onUpload: (file: File, content: string) => void;
}

export function SvgSpriteUploader({ onUpload }: SvgSpriteUploaderProps) {
  const [error, setError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError("");

    try {
      // Check file type
      if (!file.type.includes("svg") && !file.name.endsWith(".svg")) {
        throw new Error("Please upload an SVG file");
      }

      // Read file content
      const content = await file.text();

      // Validate SVG content
      if (!isSvg(content)) {
        throw new Error("Invalid SVG file format");
      }

      // Check if it's likely a sprite (contains multiple symbols or groups)
      const hasSymbols = content.includes("<symbol") || content.includes("<g");
      const hasMultipleElements = (content.match(/<(path|circle|rect|polygon|polyline|ellipse|line)/g) || []).length > 1;

      if (!hasSymbols && !hasMultipleElements) {
        throw new Error("This appears to be a single SVG icon, not a sprite. Please upload an SVG sprite file.");
      }

      onUpload(file, content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process file");
    } finally {
      setIsProcessing(false);
    }
  }, [onUpload]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/svg+xml': ['.svg'],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-2 border-dashed transition-all duration-300 hover:border-primary/50">
          <CardContent className="p-12">
            <div
              {...getRootProps()}
              className={`
                relative cursor-pointer rounded-xl p-8 text-center transition-all duration-300
                ${isDragActive && !isDragReject
                  ? "bg-primary/10 border-primary scale-105"
                  : "bg-muted/30 hover:bg-muted/50"
                }
                ${isDragReject ? "bg-destructive/10 border-destructive" : ""}
                ${isProcessing ? "pointer-events-none opacity-50" : ""}
              `}
            >
              <input {...getInputProps()} />

              <AnimatePresence mode="wait">
                {isProcessing ? (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="p-4 bg-primary/10 rounded-full">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-2">
                        Processing SVG Sprite...
                      </h3>
                      <p className="text-muted-foreground">
                        Analyzing your sprite file
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center gap-6"
                  >
                    <div className={`
                      p-6 rounded-full transition-all duration-300
                      ${isDragActive && !isDragReject
                        ? "bg-primary text-primary-foreground scale-110"
                        : "bg-primary/10 text-primary"
                      }
                      ${isDragReject ? "bg-destructive/10 text-destructive" : ""}
                    `}>
                      {isDragReject ? (
                        <AlertCircle className="w-12 h-12" />
                      ) : isDragActive ? (
                        <CheckCircle2 className="w-12 h-12" />
                      ) : (
                        <FileImage className="w-12 h-12" />
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-primary mb-2">
                          {isDragActive && !isDragReject
                            ? "Drop your SVG sprite here"
                            : isDragReject
                              ? "Invalid file type"
                              : "Upload SVG Sprite"
                          }
                        </h3>
                        <p className="text-muted-foreground">
                          {isDragReject
                            ? "Please upload an SVG file"
                            : "Drag and drop your SVG sprite file here, or click to browse"
                          }
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        size="lg"
                        className="gap-2"
                        disabled={isProcessing}
                      >
                        <Upload className="w-4 h-4" />
                        Choose File
                      </Button>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• Supports SVG sprite files with multiple icons</p>
                      <p>• Maximum file size: 10MB</p>
                      <p>• Files are processed locally in your browser</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6"
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 text-center"
        >
          <h3 className="text-lg font-semibold text-primary mb-4">
            What is an SVG Sprite?
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-muted-foreground">
            <div className="space-y-2">
              <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto">
                <FileImage className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium text-foreground">Multiple Icons</h4>
              <p>A single SVG file containing multiple icon definitions using symbols or groups</p>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium text-foreground">Easy Upload</h4>
              <p>Simply drag and drop your sprite file or click to browse and select</p>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium text-foreground">Instant Preview</h4>
              <p>View all icons in the sprite and interact with them individually</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}