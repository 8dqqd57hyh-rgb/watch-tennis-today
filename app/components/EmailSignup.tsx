import EmailCapture from "@/components/EmailCapture";

type EmailSignupProps = {
  title?: string;
  description?: string;
  source?: string;
  buttonLabel?: string;
  compact?: boolean;
  dark?: boolean;
  context?: string;
};

function getContextType(source: string) {
  if (source.includes("stream")) return "streaming";
  if (source.includes("watch")) return "watch";
  if (source.includes("guide")) return "guide";
  if (source.includes("tournament")) return "tournament";
  if (source.includes("daily") || source.includes("newsletter")) return "daily";
  return "general";
}

export default function EmailSignup({
  title = "Get useful tennis alerts",
  description = "One optional email signup for match schedules, Grand Slam reminders and official viewing updates. No popups, no daily spam.",
  source = "email-signup",
  buttonLabel = "Notify me",
  compact = false,
  dark = true,
  context,
}: EmailSignupProps) {
  return (
    <EmailCapture
      title={title}
      description={description}
      buttonText={buttonLabel}
      contextType={getContextType(source)}
      contextValue={context || source}
      dark={dark}
      compact={compact}
    />
  );
}
