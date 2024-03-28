"use client";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { COMPARE, LEARN } from "@/data/Navigation";

const PATHS = {
  compare: COMPARE,
  learn: LEARN,
};
const Navigation = () => {
  const path = usePathname().slice(1);
  return (
    <Navbar
      collapseOnSelect
      expand="md"
      className="w-full flex items-center p-3 bg-gradient-to-r bg-power-gray fixed top-0 z-50"
    >
      <Navbar.Brand>
        <Link href="/">
          <div className="text-power-black text-2xl ml-10 font-bold">
            Barbell Metrics
          </div>
        </Link>
      </Navbar.Brand>
      <Nav className="ml-auto space-x-24 mr-10">
        {PATHS[path].map((item, index) => (
          <Nav.Link
            key={index}
            href={item.ref}
            className="text-2xl font-bold hover:opacity-75"
          >
            {item.name}
          </Nav.Link>
        ))}
      </Nav>
    </Navbar>
  );
};

export default Navigation;
