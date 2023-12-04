import React, { useState } from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { BsDoorOpenFill } from "react-icons/bs";
import { SlLogout } from "react-icons/sl";
import HomeIcon from "@mui/icons-material/Home";

const navItems = [
    { title: "New Game", icon: <SportsEsportsIcon /> },
    { title: "SignIn", icon: <LogoutIcon /> },
    { title: "Create Room", icon: <BsDoorOpenFill /> },
    { title: "Enter Room", icon: <BsDoorOpenFill /> },
    { title: "Exit Online Room", icon: <SlLogout /> },
  ];
export default function SimpleBottomNavigation() {

  const [value, setValue] = useState(0);
  return (
    <Box sx={{ display : {md:"none"}, width: "100vw",position: 'fixed', bottom: 0, left: 0, right: 0}} elevation={3} >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        {navItems.map((item)=>{
            return <BottomNavigationAction label={item.title} icon={item.icon} key={item.title} sx={{  color:"black" }}/>
        })}
       
      </BottomNavigation>
    </Box>
  );
}