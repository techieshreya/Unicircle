import { Button, Navbar } from "flowbite-react";
import { Link } from "react-router-dom";

export function MyNavbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href= '/';
  };
  return (
    <div className="drop-shadow-lg">
      <Navbar fluid rounded>
        <Navbar.Brand href="/">
          {/* <img src={unicircleLogo} className="mr-3 h-6 sm:h-14" alt="logo" /> */}
          <span className="self-center whitespace-nowrap text-3xl font-semibold font-josefin dark:text-white sm:mx-10">
            UniCircle
          </span>
        </Navbar.Brand>
        <div className="flex md:order-2 sm:mx-10 sm:space-x-2">
          {localStorage.getItem("token") ? (
            <Button color="failure" onClick={handleLogout}>Logout</Button>
          ) : (
            <>
              <Link to="/login">
                <Button>Log in</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign up</Button>
              </Link>
            </>
          )}

          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link>
            <Link to="/">Home</Link>
          </Navbar.Link>
          <Navbar.Link>
            <Link to="/about">About</Link>
          </Navbar.Link>
          <Navbar.Link>
            <Link to="/store/sell">Store</Link>
          </Navbar.Link>
          <Navbar.Link>
            <Link to="/contact">Contact</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}
