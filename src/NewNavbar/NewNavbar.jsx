import * as React from "react";
import { useContext, useState } from "react";
import { GridContext } from "../Contexts";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { BsDoorOpenFill } from "react-icons/bs";
import { MdMeetingRoom } from "react-icons/md";
import { SlLogout } from "react-icons/sl";
import "./NewNavbar.css";
import { Link, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ButtonSound1 from "./ButtonSound/buttons.mp3";
import ButtonSound2 from "./ButtonSound/button1.mp3";
import background from "../background.jpg";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@mui/material";
import clipboardCopy from "clipboard-copy";
import { doc, setDoc, deleteDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import MuiDrawer from "@mui/material/Drawer";

//new drawer functions

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(5)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(6)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

function NewNavbar() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const audio1 = new Audio(ButtonSound1);
  const audio2 = new Audio(ButtonSound2);

  const navigate = useNavigate();
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const { state, dispatch, updateDocState, checkDocs } =
    useContext(GridContext);

  const navItems = [
    { title: "Home", icon: <HomeIcon /> },
    { title: "New Game", icon: <SportsEsportsIcon /> },
    { title: "How to Play?", icon: <LightbulbIcon /> },
    { title: "SignIn", icon: <LogoutIcon /> },
    { title: "SignOut", icon: <SlLogout /> },
    { title: "Options", icon: <SettingsIcon /> },
    { title: "Create Room", icon: <BsDoorOpenFill /> },
    { title: "Enter Room", icon: <MdMeetingRoom /> },
    { title: "Exit Online Room", icon: <SlLogout /> },
  ];

  const handleNavClicks = (title) => {
    if (title === "New Game" && state.sel !== "Select size here") {
      if (
        (state.roomId || state.enterRoomId) &&
        state.playerRequesting !== state.playerFixed
      ) {
        console.log("new game clicked", "line 122");
        const temp = async () => {
          await deleteDoc(
            doc(db, "users", state.roomId || state.enterRoomId)
          ).then(() => {
            console.log("docDeleted", "line 126");
            dispatch({
              type: "SetStates",
              payload: {
                row: 0,
                col: 0,
                won: "",
                sel: "Select size here",
                player1Live: false,
                playerEnteredRoom: false,
                roomId: "",
                enterRoomId: "",
                enterRoom: false,
                horizontalButtons: [],
                verticalButtons: [],
                squaresColors: [],
                numberOfSquares: 0,
                player1Score: 0,
                player2Score: 0,
                player: "1",
                playerFixed: "1",
                changesAdded: false,
                playerRequesting: "",
                player1Id:"",
                player2Id:""
              },
            });
          });
        };
        temp();
      } else if (!state.roomId && !state.enterRoomId) {
        dispatch({
          type: "SetStates",
          payload: {
            won: "",
            sel: "Select size here",
            playerEnteredRoom: false,
            roomId: "",
            enterRoomId: "",
            enterRoom: false,
            horizontalButtons: [],
            verticalButtons: [],
            squaresColors: [],
            numberOfSquares: 0,
            player1Score: 0,
            player2Score: 0,
            player: "1",
            playerFixed: "1",
            changesAdded: false,
          },
        });
      }
    } else if (title === "New Game" && state.sel === "Select size here") {
      alert("Select size or Start Game");
    } else if (title === "SignIn") {
      navigate("/signIn");
      dispatch({
        type: "SetStates",
        payload: { Routed: true },
      });
    } else if (title === "SignOut") {
      dispatch({
        type: "SetStates",
        payload: { playerSignedIn:"" },
      });
      alert("Signed Out!")
    } else if (title === "Home") {
      navigate("/");
    } else if (title === "Exit Online Room") {
      if (state.playerEnteredRoom) {
        const temp = async () => {
          await updateDocState({
            [state.playerFixed === "2"
              ? "playerEnteredRoom"
              : "player1Live"]: false,
            playerRequesting: state.playerFixed,
          }).then(() => {
            console.log("line 209", "exited from game");
            dispatch({
              type: "SetStates",
              payload: {
                won: "",
                sel: "Select size here",
                player1Live: false,
                playerEnteredRoom: false,
                roomId: "",
                enterRoomId: "",
                enterRoom: false,
                horizontalButtons: [],
                verticalButtons: [],
                squaresColors: [],
                numberOfSquares: 0,
                player1Score: 0,
                player2Score: 0,
                player: "1",
                playerFixed: "1",
                changesAdded: false,
                playerRequesting: "",
                player1Id:"",
                player2Id:""
              },
            });
          });
        };
        temp();
      }
    } else if (title === "Options") {
      dispatch({ type: "SetStates", payload: { modalShow: true } });
    } else if (title === "Create Room") {
      const enterRoomId = uuidv4();
      checkDocs(enterRoomId).then((create) => {
        if (create) {
          dispatch({
            type: "SetStates",
            payload: { start: true, roomId: enterRoomId, modalShow: true },
          });
        }
      });
      alert("Select size to start creating room");
      audio2.play();
    } else if (title === "Enter Room") {
      const canEnterRoom = async () => {
        const docSnap = await getDoc(doc(db, "games", "XhxrYcgKoKl9eLoCVFl2"));

        if (docSnap.exists()) {
          const data = docSnap.data();
          // const dataFromLocal =
          //   typeof window !== "undefined" && window.localStorage
          //     ? localStorage.getItem("player")
          //     : null;
          const playerInfo = state?.playerSignedIn;
          if (playerInfo && data?.players[playerInfo] === 11) {
            alert("Per day Limit reached!");
            dispatch({
              type: "SetStates",
              payload: { playerFixed: "2" },
            });
            updateDocState({ playerRequesting: "2" });
            return;
          } else if (!playerInfo) {
            alert("Please signIn");
            return;
          }
          if (Object.keys(data?.players).length < 12) {
            dispatch({
              type: "SetStates",
              payload: { enterRoom: true, sel: "Select size here" },
            });
          } else {
            alert(
              "Visit next day as max games played/day or number of players/day limit exceeded!"
            );
          }
          // console.log("Document data:", docSnap.data());
        }
      };
      canEnterRoom();

      audio2.play();
    } else {
      let alertForHome = setTimeout(() => {
        alert("Return to home, waiting for you!");
      }, [10000]);
      dispatch({
        type: "SetStates",
        payload: { Routed: true, alertForHome: alertForHome },
      });
      navigate("/aboutgame");
    }
  };

  const createRoom = async (enterRoomId, tempObj) => {
    // console.log("line 173", "room created");
    let playerInfo;
    if (!state.player1Id) {
      // const dataFromLocal =
      //   typeof window !== "undefined" && window.localStorage
      //     ? localStorage.getItem("player")
      //     : null;
      playerInfo = state?.playerSignedIn;
    }
    await setDoc(doc(db, "users", enterRoomId), {
      ...tempObj,
      numberOfSquares: 0,
      player1Score: 0,
      player2Score: 0,
      player: "1",
      player2Name: "Player 2",
      won: "",
      playerEnteredRoom: false,
      player1Live: true,
      player1Name: state.player1Name,
      player1Id: playerInfo || state.player1Id,
    }).then(() => {
      const updateAnotherDocState = async () => {
        // const dataFromLocal =
        //   typeof window !== "undefined" && window.localStorage
        //     ? localStorage.getItem("player")
        //     : null;
        const playerInfo = state?.playerSignedIn;
        const docSnap = await getDoc(doc(db, "games", "XhxrYcgKoKl9eLoCVFl2"));

        if (docSnap.exists()) {
          const data = docSnap.data();
          updateDoc(doc(db, "games", "XhxrYcgKoKl9eLoCVFl2"), {
            players: {
              ...data.players,
              [playerInfo]:
                (data?.players[playerInfo] ? data?.players[playerInfo] : 0) + 1,
            },
          });
        }
      };
      updateAnotherDocState();
      // setRoomCreated(true);
    });
  };

  const setStatesAfterSel = (row, col) => {
    let arr = [];
    let horizontal = [];
    let vertical = [];
    let squares = [];
    for (let i = 0; i <= row * col + row + col; i++) {
      arr.push(i);
    }

    for (let i = 0; i < row * col + col; i++) {
      horizontal.push({
        key: i,
        type: "horizontal",
        isClicked: false,
        btncolor: "#2196f3",
        active: false,
      });
    }

    for (let i = 0; i < row * col + row; i++) {
      vertical.push({
        key: i,
        type: "vertical",
        isClicked: false,
        btncolor: "#2196f3",
        active: false,
      });
    }

    for (let i = 0; i < row * col; i++) {
      squares.push({
        allClicked: false,
        squarecolor: "lightgrey",
        active: false,
      });
    }
    return {
      horizontalButtons: horizontal,
      verticalButtons: vertical,
      squaresColors: squares,
      Box: arr,
    };
  };

  return (
    <Box sx={{ display: "flex", minWidth: "100vw", height: "56px" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ backgroundColor: "#4A00E0" }} open={open}>
        <Toolbar>
          {/* //dot and box code here  */}

          <div className="cont" onClick={() => navigate("/")}>
            <img
              width="50"
              height="40"
              src="https://media.giphy.com/avatars/jaaaamesperrett/Dx0SbsMf7gjn.gif"
            />
          </div>

          <Typography
            component="div"
            sx={{ alignItems: "right", display: "flex", gap: "20px" }}
          >
            {state.player1Live &&
            state.playerEnteredRoom &&
            !state.won ? null : (
              <>
                <Typography
                  sx={{
                    display: { xs: "none", sm: "block" },
                    overflow: "visible",
                  }}
                  className="Navbartxt"
                  variant="h6"
                  noWrap
                  component="div"
                  title="New Game"
                  onClick={(e) => {
                    audio2.play();
                    handleNavClicks(e.target.title);
                  }}
                >
                  New Game
                </Typography>
                {state.start ? (
                  <select
                    value={state.sel}
                    onChange={(e) => {
                      console.log("line 270 ", state.sel);
                      const selectValue = e.target.value;
                      const row = selectValue.split("*").map(Number)[0];
                      const col = selectValue.split("*").map(Number)[1];
                      let obj = setStatesAfterSel(row, col);
                      console.log("line 275", row, col, obj);
                      if (row && col && Object.keys(obj).length > 0) {
                        dispatch({
                          type: "SetStates",
                          payload: {
                            Box: [],
                            start: false,
                            row: row,
                            col: col,
                            ...obj,
                            sel: selectValue,
                            gridWidth: 55 * (col + 1),
                            gridHeight: 55 * (row + 1),
                            player1Score: 0,
                            player2Score: 0,
                            numberOfSquares: 0
                          },
                        });
                        if (state.roomId) {
                          createRoom(state.roomId, {
                            row: row,
                            col: col,
                            ...obj,
                            sel: selectValue,
                            gridWidth: 80 * (col + 1),
                            gridHeight: 80 * (row + 1),
                          });
                        }
                      }
                    }}
                    style={{
                      color: "white",
                      border: "none",
                      background: "#4A00E0",
                    }}
                  >
                    <option value="Select size here">Select Size</option>
                    <option value="2*3">2 x 3</option>
                    <option value="3*4">3 x 4</option>
                    <option value="4*5">4 x 5</option>
                    <option value="5*6">5 x 6</option>
                    <option value="6*7">6 x 7</option>
                    <option value="7*8">7 x 8</option>
                  </select>
                ) : (
                  <Typography
                    sx={{
                      display: { xs: "block", sm: "block" },
                      overflow: "visible",
                    }}
                    className="Navbartxt"
                    variant="h6"
                    noWrap
                    component="div"
                    title="Start Game"
                    onClick={() => {
                      if (state.playerEnteredRoom) {
                        alert(
                          "Either click on new game or exit, cannot change size in between!"
                        );
                        return;
                      }
                      dispatch({ type: "SetStates", payload: { start: true } });
                    }}
                  >
                    Start Game
                  </Typography>
                )}
              </>
            )}
            {state.roomId ? (
              state.sel !== "Select size here" ? (
                <div>
                  {/* <span>{roomId} </span> */}
                  <Button
                    variant="contained"
                    onClick={() => {
                      clipboardCopy(state.roomId);
                    }}
                  >
                    CopyId
                  </Button>
                </div>
              ) : null
            ) : state.enterRoom ? null : (
              <Typography
                sx={{
                  display: { xs: "none", sm: "block" },
                  overflow: "visible",
                }}
                className="Navbartxt"
                variant="h6"
                noWrap
                component="div"
                title="Create Room"
                onClick={(e) => {
                  const enterRoomId = uuidv4();
                  checkDocs(enterRoomId).then((create) => {
                    if (create) {
                      dispatch({
                        type: "SetStates",
                        payload: {
                          start: true,
                          roomId: enterRoomId,
                          modalShow: true,
                        },
                      });
                    }
                  });
                  alert("Select size to start creating room");
                  audio2.play();
                }}
              >
                Create Room
              </Typography>
            )}
            {state.roomId ? null : state.enterRoom ? null : (
              <Typography
                sx={{
                  display: { xs: "none", sm: "block" },
                  overflow: "visible",
                }}
                className="Navbartxt"
                variant="h6"
                noWrap
                component="div"
                title="Enter Room"
                onClick={(e) => {
                  const canEnterRoom = async () => {
                    const docSnap = await getDoc(
                      doc(db, "games", "XhxrYcgKoKl9eLoCVFl2")
                    );

                    if (docSnap.exists()) {
                      const data = docSnap.data();
                      // const dataFromLocal =
                      //   typeof window !== "undefined" && window.localStorage
                      //     ? localStorage.getItem("player")
                      //     : null;
                      const playerInfo = state?.playerSignedIn;
                      if (playerInfo && data?.players[playerInfo] === 11) {
                        alert("Per day Limit reached!");
                        dispatch({
                          type: "SetStates",
                          payload: { playerFixed: "2" },
                        });
                        updateDocState({ playerRequesting: "2" });
                        return;
                      } else if (!playerInfo) {
                        alert("Please signIn");
                        return;
                      }
                      if (Object.keys(data?.players).length < 12) {
                        dispatch({
                          type: "SetStates",
                          payload: { enterRoom: true, sel: "Select size here" },
                        });
                      } else {
                        alert(
                          "Visit next day as max games played/day or number of players/day limit exceeded!"
                        );
                      }
                      // console.log("Document data:", docSnap.data());
                    }
                  };
                  canEnterRoom();
                  audio2.play();
                }}
              >
                Enter Room
              </Typography>
            )}
            <Typography
              sx={{ display: { xs: "none", sm: "block" }, overflow: "visible" }}
              className="Navbartxt"
              variant="h6"
              noWrap
              component="div"
              title="How to play?"
              onClick={(e) => {
                handleNavClicks(e.target.title);
                audio2.play();
              }}
            >
              <Link to="/aboutgame">About Game</Link>
            </Typography>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        onMouseEnter={handleDrawerOpen}
        onMouseLeave={handleDrawerClose}
      >
        <img
          src={background}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            zIndex: "-10",
            top: "0",
            bottom: "0",
            left: "0",
            right: "0",
            opacity: "0.85",
          }}
        />
        <DrawerHeader></DrawerHeader>
        <List sx={{ color: "white" }}>
          {navItems.map((ele) => (
            <div key={ele.title}>
              {(state.player1Live &&
                state.playerEnteredRoom &&
                !state.won &&
                (ele.title === "New Game" || ele.title === "SignIn" ||  ele.title === "SignOut")) ||
              ((state.enterRoom || state.roomId) &&
                (ele.title === "Create Room" ||
                  ele.title === "Enter Room")) ? null : ele.title ===
                "SignIn" ? (
                state?.playerSignedIn ? null : (
                  <ListItem key={ele.title} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        handleNavClicks(ele.title);
                        audio1.play();
                      }}
                    >
                      <ListItemIcon sx={{ color: "white" }}>
                        {ele.icon}
                      </ListItemIcon>
                      <ListItemText primary={ele.title} />
                    </ListItemButton>
                  </ListItem>
                )
              ) : ele.title === "SignOut" ? (
                state?.playerSignedIn ? (
                  <ListItem key={ele.title} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        handleNavClicks(ele.title);
                        audio1.play();
                      }}
                    >
                      <ListItemIcon sx={{ color: "white" }}>
                        {ele.icon}
                      </ListItemIcon>
                      <ListItemText primary={ele.title} />
                    </ListItemButton>
                  </ListItem>
                ) : null
              ) : (
                <ListItem key={ele.title} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      handleNavClicks(ele.title);
                      audio1.play();
                    }}
                  >
                    <ListItemIcon sx={{ color: "white" }}>
                      {ele.icon}
                    </ListItemIcon>
                    <ListItemText primary={ele.title} />
                  </ListItemButton>
                </ListItem>
              )}
            </div>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}

export default NewNavbar;
