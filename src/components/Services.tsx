import { ArrowUpRight } from "lucide-react";
import { portfolio } from "@/data/portfolio";
export default function Services() {
  return <section id="services" className="section services"><p className="eyebrow">EXPERTISE / CAPABILITIES</p><h2 className="display services-heading">WHAT I<br />CAN DO<span className="accent">.</span></h2><ol className="service-list">{portfolio.services.map((service, index) => <li className="service-row" key={service}><span className="technical service-number">0{index + 1}</span><h3>{service}</h3><ArrowUpRight aria-hidden="true" /></li>)}</ol></section>;
}
