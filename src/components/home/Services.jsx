
const services = [
  {
    id: 1,
    name: "Hair Styling",
    description: "Professional haircuts, styling, and treatments to refresh your look.",
    price: "৳800+",
    icon: "✂",
  },
  {
    id: 2,
    name: "Facial & Skincare",
    description: "Relaxing facial treatments for healthy and refreshed skin.",
    price: "৳1,500+",
    icon: "✿",
  },
  {
    id: 3,
    name: "Manicure & Pedicure",
    description: "Give your hands and feet the care and attention they deserve.",
    price: "৳800+",
    icon: "💅",
  },
  {
    id: 4,
    name: "Bridal Makeup",
    description: "Professional makeup services for your special occasions.",
    price: "৳2,000+",
    icon: "♡",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-white px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-600">
            WHAT WE OFFER
          </p>

          <h2 className="mt-4 text-3xl font-bold text-[#321b2b] sm:text-4xl">
            Our Beauty Services
          </h2>

          <p className="mt-5 leading-7 text-[#806b78]">
            Explore our range of professional beauty treatments,
            thoughtfully designed to help you look and feel your best.
          </p>
        </div>

        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="group rounded-2xl border border-pink-100 bg-[#fffafd] p-7 transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-pink-100"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-3xl text-pink-600 transition group-hover:bg-pink-600 group-hover:text-white">
                {service.icon}
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#321b2b]">
                {service.name}
              </h3>

              <p className="mt-3 min-h-20 text-sm leading-6 text-[#806b78]">
                {service.description}
              </p>

              <div className="mt-5 border-t border-pink-100 pt-5">
                <span className="text-sm text-[#806b78]">Starting from</span>
                <p className="mt-1 text-xl font-bold text-pink-600">
                  {service.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
