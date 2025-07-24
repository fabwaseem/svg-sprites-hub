"use client";

import SvgPreview from "@/components/sprite/SvgPreview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { usePopularTags } from "@/hooks/usePopularTags";
import { useSpriteMutation } from "@/hooks/useSpriteMutation";
import { formatBytes, getUniqueSvgFiles } from "@/lib/utils";
import isSvg from "is-svg";
import { ImageIcon, Plus, Tag, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

const categories = [
  "Icons",
  "Logos",
  "Illustrations",
  "UI Elements",
  "Social",
  "Technology",
  "Business",
  "Other",
];

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    tags: [] as string[],
    license: "free",
  });
  const [customTag, setCustomTag] = useState("");
  const [step, setStep] = useState(1);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    mainRef.current?.focus();
  }, []);

  const {
    data: popularTags,
    isLoading: loadingTags,
    error: tagsError,
  } = usePopularTags();

  const spriteMutation = useSpriteMutation();

  // Dropzone handler
  const onDrop = async (acceptedFiles: File[]) => {
    const svgFiles = acceptedFiles.filter(
      (file) => file.type === "image/svg+xml"
    );
    for (const file of svgFiles) {
      const filesToAdd = await getUniqueSvgFiles(
        files,
        file,
        file.name.replace(/\.svg$/, "")
      );
      if (filesToAdd.length > 0) {
        setFiles((prev) => [...prev, ...filesToAdd]);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/svg+xml": [".svg"] },
    multiple: true,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const addCustomTag = () => {
    if (customTag.trim()) {
      addTag(customTag.trim().toLowerCase());
      setCustomTag("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || spriteMutation.status === "pending") return;
    // Read SVG code from files
    const icons = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        svg: await file.text(),
      }))
    );
    const payload = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      tags: formData.tags,
      icons,
    };
    spriteMutation.mutate(payload, {
      onSuccess: () => {
        toast({
          title: "Sprite uploaded successfully!",
          description: "Your sprite has been uploaded successfully.",
        });
        setFiles([]);
        setFormData({
          name: "",
          description: "",
          category: "",
          tags: [],
          license: "free",
        });
        setStep(1);
      },
    });
  };

  // Handle paste SVG
  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const text = e.clipboardData.getData("text/plain");
    console.log(text);
    if (text && isSvg(text)) {
      // Create a File from pasted SVG code
      const blob = new Blob([text], { type: "image/svg+xml" });
      const file = new File([blob], `pasted-${Date.now()}.svg`, {
        type: "image/svg+xml",
      });
      const filesToAdd = await getUniqueSvgFiles(files, file, "pasted");
      if (filesToAdd.length > 0) {
        setFiles((prev) => [...prev, ...filesToAdd]);
      }
    }
  };

  // Step validation
  const canProceedToDetails = files.length > 0;
  const canProceedToTags =
    formData.name && formData.description && formData.category;
  const canSubmit = canProceedToTags && formData.tags.length > 0;

  return (
    <main
      ref={mainRef}
      tabIndex={0}
      className="min-h-screen pt-16 bg-background"
      onPaste={handlePaste}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-8 mt-10 mb-4">
        <h1 className="text-2xl font-bold text-primary mb-2 text-center">
          Upload SVG Sprite
        </h1>
        {/* Stepper */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div
            className={`flex items-center gap-2 ${
              step === 1 ? "font-bold text-primary" : "text-muted-foreground"
            }`}
          >
            1 <span className="hidden sm:inline">Upload</span>
          </div>
          <span className="w-6 h-0.5 bg-border rounded" />
          <div
            className={`flex items-center gap-2 ${
              step === 2 ? "font-bold text-primary" : "text-muted-foreground"
            }`}
          >
            2 <span className="hidden sm:inline">Details</span>
          </div>
          <span className="w-6 h-0.5 bg-border rounded" />
          <div
            className={`flex items-center gap-2 ${
              step === 3 ? "font-bold text-primary" : "text-muted-foreground"
            }`}
          >
            3 <span className="hidden sm:inline">Tags</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Upload */}
        {step === 1 && (
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
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 bg-muted/60 focus-within:border-primary focus-within:bg-accent/10 ${
                    isDragActive
                      ? "border-primary bg-accent/20"
                      : "border-border hover:border-primary/60"
                  }`}
                  tabIndex={0}
                >
                  <input {...getInputProps()} />
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-2">
                        Drop your SVG files here
                      </h3>
                      <p className="text-muted-foreground">
                        or click to browse and select files from your computer
                        <br />
                        <span className="text-xs text-muted-foreground">
                          or paste SVG code here
                        </span>
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        (
                          document.querySelector(
                            'input[type="file"]'
                          ) as HTMLInputElement
                        )?.click()
                      }
                    >
                      Choose Files
                    </Button>
                  </div>
                </div>
                {/* File List */}
                {files.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <h4 className="font-semibold text-primary">
                      Selected Files ({files.length})
                    </h4>
                    <ScrollArea className="h-40 overflow-y-auto">
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-background border border-border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {/* SVG Preview */}
                              {file.type === "image/svg+xml" && (
                                <span className="ml-2 w-8 h-8 flex items-center justify-center bg-muted rounded">
                                  <SvgPreview file={file} />
                                </span>
                              )}
                              <span className="text-sm font-medium text-primary">
                                {file.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ({formatBytes(file.size)})
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
                <div className="flex justify-end mt-8">
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!canProceedToDetails}
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="max-w-4xl mx-auto px-4 sm:px-8">
            <Card className="w-full">
              <CardHeader className="border-b border-border py-3 px-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ImageIcon className="w-5 h-5" />
                  Sprite Collection Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Collection Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Essential UI Icons"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                </div>
                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your sprite collection and its intended use..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={4}
                    required
                  />
                </div>
                {/* Category */}
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge
                        key={category}
                        variant={
                          formData.category === category ? "default" : "outline"
                        }
                        className={`cursor-pointer transition-all duration-200 rounded-lg px-4 py-2 text-base font-medium border border-border ${
                          formData.category === category
                            ? "bg-primary text-primary-foreground shadow"
                            : "hover:bg-accent/40 hover:text-primary"
                        }`}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, category }))
                        }
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex flex-col md:flex-row justify-center gap-4 mt-8 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="w-full md:w-1/2"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={() => setStep(3)}
                disabled={!canProceedToTags}
                className="w-full md:w-1/2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Tags */}
        {step === 3 && (
          <div className="max-w-4xl mx-auto px-4 sm:px-8">
            <Card className="w-full">
              <CardHeader className="border-b border-border py-3 px-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Tag className="w-5 h-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Selected Tags */}
                {formData.tags.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Tags ({formData.tags.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="default"
                          className="bg-primary text-primary-foreground cursor-pointer"
                          onClick={() => removeTag(tag)}
                        >
                          {tag}
                          <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {/* Popular Tags */}
                <div className="space-y-2">
                  <Label>Popular Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {loadingTags ? (
                      <span className="text-muted-foreground">
                        Loading tags...
                      </span>
                    ) : tagsError ? (
                      <span className="text-destructive">
                        Failed to load tags
                      </span>
                    ) : (
                      popularTags?.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className={`cursor-pointer transition-all duration-200 rounded-lg px-4 py-2 text-base font-medium border border-border ${
                            formData.tags.includes(tag)
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-accent/40 hover:text-primary"
                          }`}
                          onClick={() =>
                            !formData.tags.includes(tag) && addTag(tag)
                          }
                        >
                          {formData.tags.includes(tag) ? (
                            <>
                              {tag} <X className="w-3 h-3 ml-1" />
                            </>
                          ) : (
                            <>
                              {tag} <Plus className="w-3 h-3 ml-1" />
                            </>
                          )}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
                {/* Custom Tag */}
                <div className="space-y-2">
                  <Label>Add Custom Tag</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter custom tag..."
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addCustomTag())
                      }
                    />
                    <Button
                      type="button"
                      onClick={addCustomTag}
                      disabled={!customTag.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex flex-col md:flex-row justify-center gap-4 mt-8 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(2)}
                className="w-full md:w-1/2"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="w-full md:w-1/2 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!canSubmit || spriteMutation.status === "pending"}
              >
                {spriteMutation.status === "pending"
                  ? "Uploading..."
                  : "Upload Sprites"}
              </Button>
            </div>
            {spriteMutation.status === "error" && (
              <div className="text-destructive mt-2 text-center">
                {spriteMutation.error instanceof Error
                  ? spriteMutation.error.message
                  : "Failed to upload. Please try again."}
              </div>
            )}
            {spriteMutation.status === "success" && (
              <div className="text-success mt-2 text-center">
                Sprite uploaded successfully!
              </div>
            )}
          </div>
        )}
      </form>
    </main>
  );
}
