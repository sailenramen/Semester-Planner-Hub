import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileText,
  FileIcon,
  Loader2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Download,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface GeneratedQuestion {
  id: string;
  type: "multiple_choice" | "short_answer" | "extended_response";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

interface GeneratedQuestionsData {
  questions: GeneratedQuestion[];
  fileName: string;
  topic: string;
  generatedAt: string;
  extractedText?: string;
}

interface FileUploadQuestionsProps {
  taskId: string;
  subject: string;
  topic: string;
}

const STORAGE_KEY_PREFIX = "study-planner-generated-questions-";

export default function FileUploadQuestions({ taskId, subject, topic }: FileUploadQuestionsProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [generatedData, setGeneratedData] = useState<GeneratedQuestionsData | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_PREFIX + taskId);
    return stored ? JSON.parse(stored) : null;
  });
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [showAllAnswers, setShowAllAnswers] = useState(false);

  const saveToStorage = useCallback((data: GeneratedQuestionsData) => {
    localStorage.setItem(STORAGE_KEY_PREFIX + taskId, JSON.stringify(data));
    setGeneratedData(data);
  }, [taskId]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size exceeds 10MB limit");
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Only PDF, PPTX, and DOCX files are allowed.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setFileName(file.name);
    setUploadProgress(10);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject", subject);
    formData.append("topic", topic);

    try {
      setUploadProgress(30);
      
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(70);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate questions");
      }

      const data = await response.json();
      setUploadProgress(100);
      
      const fullData: GeneratedQuestionsData = {
        ...data,
        extractedText: data.extractedText,
      };
      
      saveToStorage(fullData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate questions");
    } finally {
      setIsUploading(false);
    }
  };

  const regenerateQuestions = async () => {
    if (!generatedData?.extractedText) {
      setError("No file content available. Please upload a file again.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(30);

    try {
      const response = await fetch("/api/regenerate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          extractedText: generatedData.extractedText,
          subject,
          topic,
        }),
      });

      setUploadProgress(70);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to regenerate questions");
      }

      const data = await response.json();
      setUploadProgress(100);

      const fullData: GeneratedQuestionsData = {
        ...data,
        fileName: generatedData.fileName,
        extractedText: generatedData.extractedText,
      };

      saveToStorage(fullData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to regenerate questions");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteQuestions = () => {
    localStorage.removeItem(STORAGE_KEY_PREFIX + taskId);
    setGeneratedData(null);
    setFileName(null);
  };

  const toggleQuestion = (id: string) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const exportToPDF = () => {
    if (!generatedData) return;
    
    let content = `Study Questions - ${topic}\n`;
    content += `Subject: ${subject}\n`;
    content += `Generated: ${new Date(generatedData.generatedAt).toLocaleDateString()}\n\n`;
    content += "=".repeat(50) + "\n\n";

    generatedData.questions.forEach((q, idx) => {
      content += `Question ${idx + 1} (${q.type.replace("_", " ")})\n`;
      content += `-`.repeat(30) + "\n";
      content += `${q.question}\n\n`;
      
      if (q.options) {
        q.options.forEach(opt => {
          content += `  ${opt}\n`;
        });
        content += "\n";
      }
      
      content += `Answer: ${q.correctAnswer}\n`;
      if (q.explanation) {
        content += `Explanation: ${q.explanation}\n`;
      }
      content += "\n\n";
    });

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `study-questions-${topic.toLowerCase().replace(/\s+/g, "-")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getQuestionTypeBadge = (type: string) => {
    switch (type) {
      case "multiple_choice":
        return <Badge variant="secondary" className="text-xs">Multiple Choice</Badge>;
      case "short_answer":
        return <Badge variant="outline" className="text-xs">Short Answer</Badge>;
      case "extended_response":
        return <Badge className="text-xs bg-primary/20 text-primary border-primary/30">Extended Response</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-Generated Questions
          </CardTitle>
          {generatedData && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllAnswers(!showAllAnswers)}
                data-testid="button-toggle-answers"
              >
                {showAllAnswers ? "Hide Answers" : "Show All Answers"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={regenerateQuestions}
                disabled={isUploading}
                data-testid="button-regenerate"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isUploading ? "animate-spin" : ""}`} />
                Regenerate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToPDF}
                data-testid="button-export"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={deleteQuestions}
                className="text-destructive hover:text-destructive"
                data-testid="button-delete-questions"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!generatedData ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            data-testid="upload-dropzone"
          >
            {isUploading ? (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin" />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {uploadProgress < 30
                      ? "Uploading file..."
                      : uploadProgress < 70
                      ? "Extracting content..."
                      : "Generating questions..."}
                  </p>
                  <Progress value={uploadProgress} className="h-2 max-w-xs mx-auto" />
                </div>
                {fileName && (
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <FileText className="h-3 w-3" />
                    {fileName}
                  </p>
                )}
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Upload Study Material</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop a PDF, PPTX, or DOCX file here, or click to browse
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-4">
                  <Badge variant="outline" className="gap-1">
                    <FileIcon className="h-3 w-3" />
                    PDF
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <FileIcon className="h-3 w-3" />
                    PPTX
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <FileIcon className="h-3 w-3" />
                    DOCX
                  </Badge>
                </div>
                <input
                  type="file"
                  accept=".pdf,.pptx,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  data-testid="input-file"
                />
                <label htmlFor="file-upload">
                  <Button asChild>
                    <span data-testid="button-upload">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </span>
                  </Button>
                </label>
                <p className="text-xs text-muted-foreground mt-3">Max file size: 10MB</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">{generatedData.fileName}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {generatedData.questions.length} questions generated
              </span>
            </div>

            <div className="space-y-3">
              {generatedData.questions.map((question, idx) => (
                <div
                  key={question.id}
                  className="border rounded-lg overflow-hidden"
                  data-testid={`generated-question-${idx}`}
                >
                  <button
                    className="w-full p-4 text-left flex items-start justify-between gap-3 hover-elevate"
                    onClick={() => toggleQuestion(question.id)}
                    data-testid={`toggle-question-${idx}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          Q{idx + 1}
                        </span>
                        {getQuestionTypeBadge(question.type)}
                      </div>
                      <p className="font-medium">{question.question}</p>
                    </div>
                    {expandedQuestions.has(question.id) || showAllAnswers ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>

                  {(expandedQuestions.has(question.id) || showAllAnswers) && (
                    <div className="px-4 pb-4 space-y-3 border-t bg-muted/30">
                      {question.options && (
                        <div className="pt-3 space-y-2">
                          {question.options.map((opt, optIdx) => (
                            <div
                              key={optIdx}
                              className={`p-2 rounded text-sm ${
                                opt === question.correctAnswer
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium"
                                  : "bg-background"
                              }`}
                            >
                              {opt}
                              {opt === question.correctAnswer && (
                                <CheckCircle2 className="h-4 w-4 inline ml-2" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="pt-3">
                        <p className="text-sm font-medium text-primary mb-1">Answer:</p>
                        <p className="text-sm">{question.correctAnswer}</p>
                      </div>

                      {question.explanation && (
                        <div className="pt-2">
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            Explanation:
                          </p>
                          <p className="text-sm text-muted-foreground">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="ml-auto"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
