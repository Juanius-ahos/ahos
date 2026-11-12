import { Link } from "wouter";
import { Arrow } from "../components/Arrow";

export default function NotFound() {
  return (
    <section className="sec">
      <div className="wrap nf">
        <p className="dim">404</p>
        <h1 className="d d-7">This page does not exist.</h1>
        <p className="lead">It may have moved, or it never existed.</p>
        <div className="acts"><Link href="/" className="btn">Back to the homepage <Arrow /></Link><Link href="/contact" className="lnk">Contact us</Link></div>
      </div>
    </section>
  );
}
