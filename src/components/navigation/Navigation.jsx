import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavbarBrand } from "react-bootstrap";
import Link from "next/link";

const Navigation = () => {
  return (
    <Navbar
      collapseOnSelect
      expand="md"
      className="w-full p-3 bg-gradient-to-r bg-power-gray"
    >
      <NavbarBrand>
        <Link href="/">
          <div className="text-power-black text-2xl ml-10">Barbell Metrics</div>
        </Link>
      </NavbarBrand>
    </Navbar>
  );
};

export default Navigation;
