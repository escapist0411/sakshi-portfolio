import { ArrowUpRight } from "lucide-react";
import { portfolio } from "@/data/portfolio";

export default function Services() {
  return (
    <section id="services" className="section services" aria-labelledby="services-title">
      <p className="eyebrow">EXPERTISE / CAPABILITIES</p>
      <h2 id="services-title" className="display services-heading">WHAT I<br />CAN DO<span className="accent">.</span></h2>
      <ol className="service-list" role="list">
        {portfolio.services.map((service, index) => (
          <li className="service-row" key={service}>
            <span className="technical service-number" aria-hidden="true">0{index + 1}</span>
            <h3>{service}</h3>
            <ArrowUpRight aria-hidden="true" />
          </li>
        ))}
      </ol>
    </section>
  );
}
