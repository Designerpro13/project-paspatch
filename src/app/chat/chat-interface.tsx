"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CornerDownLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { queryVulnerabilityInformation } from "@/ai/flows/query-vulnerability-information";
import { Logo } from "@/components/icons";

interface Message {
  role: "user" | "ai";
  content: string;
}

const chatSchema = z.object({
  query: z.string().min(1, "Query cannot be empty."),
});

type ChatFormData = z.infer<typeof chatSchema>;

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChatFormData>({
    resolver: zodResolver(chatSchema),
  });

  const onSubmit = async (data: ChatFormData) => {
    setIsLoading(true);
    const userMessage: Message = { role: "user", content: data.query };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const result = await queryVulnerabilityInformation({ query: data.query });
      if (result.response) {
        const aiMessage: Message = { role: "ai", content: result.response };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error("Received an empty response from the AI.");
      }
    } catch (error) {
      console.error("Error querying vulnerability information:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Failed to get a response. Please check the console for details.",
      });
      setMessages((prev) =>
        prev.filter((msg) => msg.content !== data.query)
      );
    } finally {
      setIsLoading(false);
      reset();
    }
  };

  return (
    <div className="relative flex h-full flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                message.role === "user" ? "justify-end" : ""
              }`}
            >
              {message.role === "ai" && (
                <Avatar className="h-8 w-8">
                  <Logo className="p-1"/>
                </Avatar>
              )}
              <div
                className={`prose prose-sm max-w-prose rounded-lg p-3 text-sm ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                 <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
              {message.role === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                 <Logo className="p-1"/>
              </Avatar>
              <div className="flex items-center space-x-2 rounded-lg bg-muted p-3">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t bg-background p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative overflow-hidden rounded-lg border focus-within:ring-1 focus-within:ring-ring"
        >
          <Label htmlFor="query" className="sr-only">
            Ask a question...
          </Label>
          <Input
            id="query"
            placeholder="Ask about a CVE, patch, or vulnerability..."
            className="min-h-[48px] resize-none border-0 p-3 shadow-none focus-visible:ring-0"
            {...register("query")}
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 right-0 flex items-center p-1">
            <Button
              type="submit"
              size="sm"
              className="h-8"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Send <CornerDownLeft className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
        {errors.query && (
          <p className="mt-1 text-xs text-destructive">{errors.query.message}</p>
        )}
      </div>
    </div>
  );
}
