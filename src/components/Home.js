import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
  Tooltip,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { FaHome, FaUserFriends, FaUsers, FaBell, FaBrain } from "react-icons/fa";

function Home({ setUser }) {
  const navigate = useNavigate();

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Navbar */}
      <div className="bg-blue-600/90 backdrop-blur-md text-white shadow-lg flex items-center px-6 py-3">
        <h1 className="text-2xl font-bold tracking-wide">🌊 Ocean App</h1>

        <div className="ml-auto flex items-center gap-6">
          {/* Botones con tooltip */}
          <Tooltip content="Test de Personalidad" placement="bottom">
            <button
              onClick={() => navigate("/test")}
              className="hover:bg-blue-700 p-3 rounded-full transition transform hover:scale-110"
            >
              <FaBrain className="text-2xl" />
            </button>
          </Tooltip>

          <Tooltip content="Inicio" placement="bottom">
            <button className="hover:bg-blue-700 p-3 rounded-full transition transform hover:scale-110">
              <FaHome className="text-2xl" />
            </button>
          </Tooltip>

          <Tooltip content="Amigos" placement="bottom">
            <button className="hover:bg-blue-700 p-3 rounded-full transition transform hover:scale-110">
              <FaUserFriends className="text-2xl" />
            </button>
          </Tooltip>

          <Tooltip content="Grupos" placement="bottom">
            <button className="hover:bg-blue-700 p-3 rounded-full transition transform hover:scale-110">
              <FaUsers className="text-2xl" />
            </button>
          </Tooltip>

          <Tooltip content="Notificaciones" placement="bottom">
            <button className="hover:bg-blue-700 p-3 rounded-full transition transform hover:scale-110">
              <FaBell className="text-2xl" />
            </button>
          </Tooltip>

          {/* Menú de usuario */}
          <Menu placement="bottom-end">
            <MenuHandler>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-blue-700 px-3 py-1 rounded-full transition">
                <Avatar
                  variant="circular"
                  size="sm"
                  alt="Usuario"
                  src="https://randomuser.me/api/portraits/women/72.jpg"
                  className="border-2 border-white"
                />
                <ChevronDownIcon className="h-5 w-5 text-white" />
              </div>
            </MenuHandler>
            <MenuList>
              <MenuItem onClick={() => navigate("/profile")}>
                <Typography variant="small" className="font-normal">
                  Mi Perfil
                </Typography>
              </MenuItem>
              <MenuItem onClick={() => navigate("/settings")}>
                <Typography variant="small" className="font-normal">
                  Configuración
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography
                  variant="small"
                  className="font-normal text-red-500"
                >
                  Cerrar sesión
                </Typography>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-col md:flex-row gap-8 p-6 flex-1">
        {/* Sidebar */}
        <div className="bg-white p-6 rounded-2xl shadow-md w-full md:w-1/4">
          <h2 className="font-semibold text-lg mb-4 text-gray-800">
            Accesos Rápidos
          </h2>
          <ul className="space-y-3">
            <li className="py-2 px-4 hover:bg-blue-50 rounded-lg cursor-pointer transition">
              Inicio
            </li>
            <li className="py-2 px-4 hover:bg-blue-50 rounded-lg cursor-pointer transition">
              Amigos
            </li>
            <li className="py-2 px-4 hover:bg-blue-50 rounded-lg cursor-pointer transition">
              Grupos
            </li>
            <li className="py-2 px-4 hover:bg-blue-50 rounded-lg cursor-pointer transition">
              Notificaciones
            </li>
          </ul>
        </div>

        {/* Feed */}
        <div className="flex-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="font-semibold text-xl mb-4">Publicaciones</h2>
            {/* Ejemplo de posts */}
            <div className="bg-gray-100 p-4 rounded-xl mb-4 hover:shadow-md transition">
              <p className="font-medium">Publicación 1</p>
              <p className="text-gray-700">Contenido de la publicación...</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-xl hover:shadow-md transition">
              <p className="font-medium">Publicación 2</p>
              <p className="text-gray-700">Contenido de la publicación...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
