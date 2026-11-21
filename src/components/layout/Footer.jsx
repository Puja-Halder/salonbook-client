
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-[#321b2b] px-6 pb-8 pt-14 text-white lg:px-10"
    >
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="text-2xl font-bold">
            Salon<span className="text-pink-400">Book.</span>
          </Link>

          <p className="mt-5 max-w-xs text-sm leading-7 text-pink-100/70">
            Your beauty, your time. Discover professional salon services
            and enjoy a convenient appointment booking experience.
          </p>

          <div className="mt-5 flex gap-4 text-sm text-pink-100/70">
            <a
              href="https://www.facebook.com/your-salon-page"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-pink-300"
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com/your-salon-page"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-pink-300"
            >
              Instagram
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Quick Links</h3>

          <div className="mt-5 flex flex-col gap-3 text-sm text-pink-100/70">
            <Link href="/" className="transition hover:text-pink-300">
              Home
            </Link>
            <Link href="/#services" className="transition hover:text-pink-300">
              Services
            </Link>
            <Link href="/#about" className="transition hover:text-pink-300">
              About Us
            </Link>
            <Link href="/#contact" className="transition hover:text-pink-300">
              Contact
            </Link>
          </div>
        </div>

        
<div>
  <h3 className="font-semibold">Our Services</h3>

  <div className="mt-5 flex flex-col gap-3 text-sm text-pink-100/70">
    <Link
      href="/services?category=haircut-styling"
      className="transition hover:text-pink-300"
    >
      Hair Styling
    </Link>

    <Link
      href="/services?category=facial-skincare"
      className="transition hover:text-pink-300"
    >
      Facial & Skincare
    </Link>

    <Link
  href="/services?category=manicure-pedicure"
  className="transition hover:text-pink-300"
>
  Manicure & Pedicure
</Link>

    <Link
      href="/services?category=makeup"
      className="transition hover:text-pink-300"
    >
      Bridal Makeup
    </Link>
  </div>
</div>


        <div>
          <h3 className="font-semibold">Get in Touch</h3>

          <div className="mt-5 flex flex-col gap-3 text-sm text-pink-100/70">
            <p>Email: info@salonbook.com</p>
            <p>Phone: +880 1XXXXXXXXX</p>
            <p>
              Address: Your salon's full address, Bangladesh
            </p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold">Opening Hours</h3>
            <div className="mt-3 flex flex-col gap-2 text-sm text-pink-100/70">
              <p>Saturday – Thursday: 10:00 AM – 9:00 PM</p>
              <p>Friday: Closed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-center text-sm text-pink-100/60">
        © 2026 SalonBook. All rights reserved.
      </div>
    </footer>
  );
}
