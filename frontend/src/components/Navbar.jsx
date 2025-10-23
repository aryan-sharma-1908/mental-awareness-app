import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { Menu as MenuIcon, X } from "lucide-react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Logout from "@mui/icons-material/Logout";
import { ToastContainer, toast } from "react-toastify";
import { AuthContext } from "./AuthContext";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5143";

export function Navbar() {
  const { isAuthenticated, selectedAvatar, setIsAuthenticated, setSelectedAvatar, setUser, setUsername, handleLogOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  }  

  const location = useLocation();

  const isAuthPage =
  location.pathname === "/login" || location.pathname === "/signup";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  if (isAuthPage) return null;

  return (
    <header className="bg-white shadow-sm">
      <ToastContainer/>
      <nav className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-auto" />
            <span className="text-xl font-semibold text-gray-800">
              TogetEase
            </span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <MenuIcon className="h-6 w-6 text-gray-600" />
            )}
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/exercises"
              className="text-gray-600 hover:text-purple-600"
            >
              Exercises
            </Link>
            <Link
              to="/community"
              className="text-gray-600 hover:text-purple-600"
            >
              Community
            </Link>
            
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                Login
              </Link>
            ) : (
              <>
                <Tooltip title="Profile" placement="bottom-end">
                  <Button 
                    className="!w-[32px] !h-[32px] !min-w-[32px] !rounded-full !p-0  !shadow-md !overflow-hidden"
                    onClick={handleClick}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    <img
                      src={selectedAvatar}
                      alt="Profile"
                      className="w-full h-full"
                    />
                  </Button>
                </Tooltip>
                
                {/* Menu - Outside Tooltip */}
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&::before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={() => {handleClose(); handleProfileClick();}}>
                    <Avatar /> Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => {handleClose(); handleLogOut();}}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/exercises"
                className="text-gray-600 hover:text-purple-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Exercises
              </Link>
              <Link
                to="/community"
                className="text-gray-600 hover:text-purple-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Community
              </Link>
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              ) : (
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-center"
                  onClick={() => {
                    setIsMenuOpen(false);
                    // Add logout functionality here
                  }}
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}