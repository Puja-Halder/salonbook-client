
const benefits = [
  {
    id: 1,
    icon: "✿",
    title: "Expert Professionals",
    description:
      "Our experienced beauty professionals provide attentive and personalized care.",
  },
  {
    id: 2,
    icon: "♡",
    title: "Personalized Experience",
    description:
      "Every appointment is designed around your preferences and beauty needs.",
  },
  {
    id: 3,
    icon: "✧",
    title: "Comfort & Hygiene",
    description:
      "Enjoy a welcoming environment with cleanliness and comfort as priorities.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="about" className="bg-[#fff0f5] px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-600">
            WHY SALONBOOK
          </p>

          <h2 className="mt-4 text-3xl font-bold text-[#321b2b] sm:text-4xl">
            Beauty Care You Can Trust
          </h2>

          <p className="mt-5 leading-7 text-[#806b78]">
            We believe every visit should feel special. Our focus is on
            quality service, personal attention, and your comfort.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className="rounded-2xl bg-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-pink-100"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-3xl text-pink-600">
                {benefit.icon}
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#321b2b]">
                {benefit.title}
              </h3>

              <p className="mt-3 leading-7 text-[#806b78]">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
