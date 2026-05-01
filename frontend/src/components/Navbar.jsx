import { getName } from "../services/api";

function Navbar({ title = "Dashboard" }) {
  const name = getName() || "User";

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex justify-between items-center">
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Welcome,</span>
        <span className="font-medium text-gray-700">{name}</span>
      </div>
    </div>
  );
}

export default Navbar;
