export const metadata = {
  title: "Contact | Watch Tennis Today",
  description:
    "Contact Watch Tennis Today for questions, feedback and website inquiries.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black mb-6">
          Contact
        </h1>

        <div className="space-y-5 text-zinc-300 leading-relaxed">
          <p>
            Have a question, correction or feedback about Watch Tennis Today?
          </p>

          <p>
            You can contact us by email:
          </p>

          <a
            href="mailto:anzhalika_sokalava@icloud.com"
            className="inline-block bg-green-500 text-black font-black px-5 py-3 rounded-2xl hover:bg-green-400 transition-all"
          >
            anzhalika_sokalava@icloud.com
          </a>

          <p className="text-zinc-500 text-sm">
            We do not host or stream tennis matches directly. For streaming
            access, please contact the official broadcaster or platform.
          </p>
        </div>
      </div>
    </main>
  );
}
