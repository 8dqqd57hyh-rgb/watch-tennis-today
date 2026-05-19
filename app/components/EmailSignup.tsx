export default function EmailSignup() {
  return (
    <section className="mt-10 bg-gradient-to-br from-green-500 to-lime-400 text-black rounded-3xl p-6">
      <h2 className="text-3xl font-black mb-3">
        Get Tennis Schedule Updates
      </h2>

      <p className="font-semibold mb-5">
        Get notified about Grand Slam schedules, live tennis matches and where to watch them.
      </p>

      <form
  action="https://formspree.io/f/xeenwwbk"
  method="POST"
  className="flex flex-col md:flex-row gap-3"
>
    <input
  type="hidden"
  name="_redirect"
  value="https://watchtennistoday.com/newsletter-confirmation"
/>
  <input
    type="email"
    name="email"
    required
    placeholder="Your email"
    className="flex-1 rounded-2xl px-5 py-4 text-black"
  />

  <button
    type="submit"
    className="bg-black text-white px-6 py-4 rounded-2xl font-black"
  >
    Notify Me
  </button>
</form>
    </section>
  );
}
