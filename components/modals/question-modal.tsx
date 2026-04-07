"use client";

import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus, Upload, X, ImageIcon, Type } from "lucide-react";
import { API_URL } from "@/config";

interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface category {
  id: number;
  name: string;
}

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (questionData: any) => void;
  question?: any;
  mode: "add" | "edit";
}

export function QuestionModal({
  isOpen,
  onClose,
  onSave,
  question,
  mode,
}: QuestionModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<category[]>([]);

  // Loading state for async save
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get(API_URL + "/api/categories");
        setCategories(res.data.data || []);
      } catch {
        toast.error("Unable to fetch category list.");
      }
    }
    fetchCategories();
  }, []);

  // Form states
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [questionType, setQuestionType] = useState("multiple-choice");
  const [questionFormat, setQuestionFormat] = useState("text"); // "text" or "image"
  const [questionText, setQuestionText] = useState("");
  const [questionImage, setQuestionImage] = useState<{
    file: File | null;
    url: string;
    name: string;
  } | null>(null);
  const [points, setPoints] = useState(1);
  const [explanation, setExplanation] = useState("");
  const [options, setOptions] = useState<Option[]>([
    { id: 1, text: "", isCorrect: false },
    { id: 2, text: "", isCorrect: false },
    { id: 3, text: "", isCorrect: false },
    { id: 4, text: "", isCorrect: false },
  ]);

  useEffect(() => {
    if (question && mode === "edit") {
      setSelectedCategoryId(
        question.categoryId || question.category_id || null,
      );
      setQuestionType(question.type || "multiple-choice");
      setQuestionFormat(question.format || "text");
      setQuestionText(question.question || question.question_text || "");
      setQuestionImage(
        question.questionImage
          ? {
              file: null,
              url:
                typeof question.questionImage === "string"
                  ? question.questionImage
                  : question.questionImage.url || "",
              name:
                typeof question.questionImage === "string"
                  ? ""
                  : question.questionImage.name || "",
            }
          : null,
      );
      setPoints(question.points ?? 1);
      setExplanation(question.explanation || "");
      setOptions(
        question.options?.length > 0
          ? question.options.map((opt: any, idx: number) => ({
              id: opt.id || idx + 1,
              text: opt.text || opt.choice_text || "",
              isCorrect: !!(opt.isCorrect ?? opt.is_correct),
            }))
          : [
              { id: 1, text: "", isCorrect: false },
              { id: 2, text: "", isCorrect: false },
              { id: 3, text: "", isCorrect: false },
              { id: 4, text: "", isCorrect: false },
            ],
      );
    } else if (!question && mode === "add") {
      setSelectedCategoryId(null);
      setQuestionType("multiple-choice");
      setQuestionFormat("text");
      setQuestionText("");
      setQuestionImage(null);
      setPoints(1);
      setExplanation("");
      setOptions([
        { id: 1, text: "", isCorrect: false },
        { id: 2, text: "", isCorrect: false },
        { id: 3, text: "", isCorrect: false },
        { id: 4, text: "", isCorrect: false },
      ]);
    }
  }, [question, mode]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Please select an image smaller than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setQuestionImage({
          file,
          url: e.target?.result as string,
          name: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setQuestionImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleOptionTextChange = (id: number, text: string) => {
    setOptions((opts) =>
      opts.map((opt) => (opt.id === id ? { ...opt, text } : opt)),
    );
  };

  const handleCorrectOptionChange = (id: number, isCorrect: boolean) => {
    if (questionType === "single-choice" || questionType === "true-false") {
      setOptions((opts) =>
        opts.map((opt) => ({
          ...opt,
          isCorrect: opt.id === id ? isCorrect : false,
        })),
      );
    } else {
      setOptions((opts) =>
        opts.map((opt) => (opt.id === id ? { ...opt, isCorrect } : opt)),
      );
    }
  };

  const addOption = () => {
    if (options.length >= 8) {
      toast.error("You can't add more than 8 options.");
      return;
    }
    const newId =
      options.length > 0 ? Math.max(...options.map((o) => o.id)) + 1 : 1;
    setOptions((opts) => [...opts, { id: newId, text: "", isCorrect: false }]);
  };

  const removeOption = (id: number) => {
    if (options.length <= 2) {
      toast.error("You need at least 2 options for a question.");
      return;
    }
    setOptions((opts) => opts.filter((opt) => opt.id !== id));
  };

  const isFormValid = () => {
    if (!selectedCategoryId) return false;
    if (questionFormat === "text" && !questionText.trim()) return false;
    if (questionFormat === "image" && !questionImage) return false;
    if (options.some((opt) => !opt.text.trim())) return false;
    if (!options.some((opt) => opt.isCorrect)) return false;
    if (points < 0.5 || points > 100) return false;
    return true;
  };

  const pointOptions = [
    0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 40,
    50, 75, 100,
  ];

  const handleSave = async () => {
    if (!isFormValid()) {
      toast.error(
        "Please fill in all required fields and ensure at least one correct answer is selected.",
      );
      return;
    }
    setLoading(true);
    try {
      const payload: any = {
        category_id: selectedCategoryId,
        type: questionType,
        format: questionFormat,
        points,
        explanation,
        choices: options.map((opt) => ({
          choice_text: opt.text,
          is_correct: opt.isCorrect,
        })),
      };
      if (questionFormat === "text") payload.question_text = questionText;

      if (questionFormat === "image" && questionImage?.file) {
        const formDataToSend = new FormData();
        Object.entries(payload).forEach(([key, val]) => {
          if (key !== "choices") {
            formDataToSend.append(key, val as any);
          }
        });
        formDataToSend.append("question_image", questionImage.file);
        formDataToSend.append("choices", JSON.stringify(payload.choices));

        if (mode === "add") {
          await axios.post(API_URL + "/api/questions", formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else if (mode === "edit" && question?.id) {
          await axios.post(
            API_URL + `/api/questions/${question.id}`,
            formDataToSend,
            {
              headers: { "Content-Type": "multipart/form-data" },
              params: { _method: "PUT" },
            },
          );
        }
      } else {
        if (mode === "add") {
          await axios.post(API_URL + "/api/questions", payload);
        } else if (mode === "edit" && question?.id) {
          await axios.put(API_URL + `/api/questions/${question.id}`, payload);
        }
      }
      toast.success(
        mode === "add"
          ? "Question added successfully"
          : "Question updated successfully",
      );
      onSave(null);
      handleClose();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error.message || "Unknown error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedCategoryId(null);
    setQuestionType("multiple-choice");
    setQuestionFormat("text");
    setQuestionText("");
    setQuestionImage(null);
    setPoints(1);
    setExplanation("");
    setOptions([
      { id: 1, text: "", isCorrect: false },
      { id: 2, text: "", isCorrect: false },
      { id: 3, text: "", isCorrect: false },
      { id: 4, text: "", isCorrect: false },
    ]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto px-6 py-6">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Question" : "Edit Question"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Create a new question for the exam."
              : "Edit the question details."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Select Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-3">
              <Label htmlFor="category-select">Select Category</Label>
              <Select
                value={selectedCategoryId ? selectedCategoryId.toString() : ""}
                onValueChange={(val) => setSelectedCategoryId(Number(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((subj) => (
                    <SelectItem key={subj.id} value={subj.id.toString()}>
                      {subj.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Question Type, Format, Points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="question-type">Question Type</Label>
              <Select value={questionType} onValueChange={setQuestionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-choice">Single Choice</SelectItem>
                  <SelectItem value="multiple-choice">
                    Multiple Choice
                  </SelectItem>
                  <SelectItem value="true-false">True/False</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="question-format">Question Format</Label>
              <Select value={questionFormat} onValueChange={setQuestionFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Question</SelectItem>
                  <SelectItem value="image">Image Question</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="points">Points</Label>
              <Select
                value={points.toString()}
                onValueChange={(val) => setPoints(Number(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select points" />
                </SelectTrigger>
                <SelectContent>
                  {pointOptions.map((pt) => (
                    <SelectItem key={pt} value={pt.toString()}>
                      {pt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Question Content */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {questionFormat === "text" ? (
                <Type className="h-5 w-5" />
              ) : (
                <ImageIcon className="h-5 w-5" />
              )}
              <Label>Question Content</Label>
            </div>

            {questionFormat === "text" ? (
              <Textarea
                placeholder="Enter your question here..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="min-h-[100px]"
                required
              />
            ) : (
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {questionImage ? (
                  <Card>
                    <CardContent className="p-4 relative">
                      <img
                        src={questionImage.url}
                        alt="Question"
                        className="max-w-full h-auto max-h-64 mx-auto rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                        disabled={loading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2 text-center">
                        {questionImage.name}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card
                    className="border-dashed cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <CardContent className="p-8 text-center">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Upload an image for your question
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Choose Image
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        Maximum file size: 5MB
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Answer Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Answer Options</Label>
              <div className="text-sm text-muted-foreground">
                {questionType === "single-choice" ||
                questionType === "true-false"
                  ? "Select one correct answer"
                  : "Select one or more correct answers"}
              </div>
            </div>

            {questionType === "single-choice" ||
            questionType === "true-false" ? (
              <RadioGroup
                value={options.find((o) => o.isCorrect)?.id.toString() || ""}
                onValueChange={(val) =>
                  handleCorrectOptionChange(Number(val), true)
                }
                className="space-y-3"
              >
                {options.map((option, index) => {
                  const label = String.fromCharCode(65 + index); // 'A', 'B', 'C', ...
                  return (
                    <div
                      key={option.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg"
                    >
                      <RadioGroupItem
                        id={`option-${option.id}`}
                        value={option.id.toString()}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <Label
                          htmlFor={`option-${option.id}`}
                          className="text-sm font-medium mb-1 block truncate"
                        >
                          Option {label}
                          {option.isCorrect && (
                            <span className="ml-2 text-green-600 text-xs font-normal">
                              (Correct)
                            </span>
                          )}
                        </Label>
                        <Input
                          value={option.text}
                          onChange={(e) =>
                            handleOptionTextChange(option.id, e.target.value)
                          }
                          placeholder={`Enter option ${label}`}
                          required
                          disabled={loading}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(option.id)}
                        disabled={options.length <= 2 || loading}
                        aria-label={`Remove option ${label}`}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </RadioGroup>
            ) : (
              <div className="space-y-3">
                {options.map((option, index) => {
                  const label = String.fromCharCode(65 + index); // 'A', 'B', 'C', ...
                  return (
                    <div
                      key={option.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg"
                    >
                      <Checkbox
                        id={`option-${option.id}`}
                        checked={option.isCorrect}
                        onCheckedChange={(checked) =>
                          handleCorrectOptionChange(
                            option.id,
                            checked as boolean,
                          )
                        }
                        className="mt-1"
                        disabled={loading}
                      />
                      <div className="flex-1 min-w-0">
                        <Label
                          htmlFor={`option-${option.id}`}
                          className="text-sm font-medium mb-1 block truncate"
                        >
                          Option {label}
                          {option.isCorrect && (
                            <span className="ml-2 text-green-600 text-xs font-normal">
                              (Correct)
                            </span>
                          )}
                        </Label>
                        <Input
                          value={option.text}
                          onChange={(e) =>
                            handleOptionTextChange(option.id, e.target.value)
                          }
                          placeholder={`Enter option ${label}`}
                          required
                          disabled={loading}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(option.id)}
                        disabled={options.length <= 2 || loading}
                        aria-label={`Remove option ${label}`}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOption}
              disabled={options.length >= 8 || loading}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Option
            </Button>
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <Label htmlFor="explanation">Explanation (Optional)</Label>
            <Textarea
              id="explanation"
              placeholder="Provide an explanation for the correct answer(s)..."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="min-h-[80px]"
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid() || loading}>
            {loading
              ? mode === "add"
                ? "Adding..."
                : "Saving..."
              : mode === "add"
                ? "Add Question"
                : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
