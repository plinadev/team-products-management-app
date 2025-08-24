import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";
import Avatar from "./Avatar";
import { useTeam } from "@/hooks/useTeam";
function Navbar() {
  const { pathname } = useLocation();
  const { team, isFetching } = useTeam();
  const menuItems = [
    { title: "Dashboard", to: "/" },
    { title: "Products", to: "/products" },
    { title: "Team", to: `/team` },
    { title: "Create", to: "/create" },
  ];
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <img src={logo} alt="lightning" width={50} />
        {!isFetching && (
          <p className="text-2xl font-bold text-yellow-700">
            {team?.team.name}
          </p>
        )}
      </div>
      <div className="flex gap-3">
        <ul className="flex gap-6  text-stone-400 items-center">
          {menuItems.map(({ title, to }, idx) => {
            const isActive = pathname === to;
            return (
              <li
                key={idx}
                className={`p-3 rounded-lg transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? "text-yellow-700 font-semibold"
                    : "hover:bg-stone-200 hover:text-yellow-700"
                }`}
              >
                <Link to={to}>{title.toLocaleUpperCase()}</Link>
              </li>
            );
          })}
        </ul>
        <Avatar />
      </div>
    </div>
  );
}

export default Navbar;
