import { Link } from "wouter";
import { Arrow } from "../components/Arrow";
import { Backdrop } from "../components/backdrop/Backdrop";
import { services } from "../site.config";

export default function NotFound() {
  return (
    <section className="sec nf-page fx-dark bg-host">
      <Backdrop kind="glyph" />
      <div className="wrap nf">
        <p className="nf-num" aria-hidden="true">404</p>
        <h1 className="d d-5">This page does not exist.</h1>
        <p className="lead" style={{ marginTop: 20 }}>It may have moved, or it never existed. Here is where most people were headed:</p>
        <div className="acts">
          <Link href="/" className="btn">Back to the homepage <Arrow /></Link>
          <Link href="/work" className="btn btn-ghost">See our work</Link>
          <Link href="/contact" className="lnk">Contact us</Link>
        </div>
        <p className="tags" style={{ marginTop: 36 }}>{services.slice(0, 5).map((s) => <Link key={s.href} href={s.href}><span>{s.label}</span></Link>)}</p>
      </div>
    </section>
  );
}
