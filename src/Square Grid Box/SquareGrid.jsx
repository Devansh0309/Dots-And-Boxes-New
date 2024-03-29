import React, { useContext, useEffect, useRef } from "react";
import "./SquareGrid.css";
import { GridContext } from "../Contexts";
import GridComponent from "./GridComponent";
import {
  collection,
  doc,
  onSnapshot,
  query,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MovingText from "react-moving-text";

function SquareGrid() {
  const typeOfChange = useRef("");
  const { state, dispatch, updateDocState, setStatesAfterSel } =
    useContext(GridContext);

  const InitialRender1 = useRef(true); //Initial Render 1 for initial render of first useEffect and so on for others useEffect
  const InitialRender2 = useRef(true);
  const InitialRender0 = useRef(true);
  const InitialRender3 = useRef(true);
  const dataFetched = useRef(false);
  const navigate = useNavigate();
  let timeOut;

  // const audio2 = new Audio(ButtonSound2);

  useEffect(() => {
    console.log("0");
    // let interval;
    if (!state.Routed && InitialRender0.current) {
      InitialRender0.current = false;
    } else if (!state.Routed && !InitialRender0.current) {
      if (state.roomId || state.playerEnteredRoom) {
        console.log("on line 88 for fetching real-time data");
        // interval = setTimeout(() => {
        let changes = [];
        const q = query(collection(db, "users"));
        // unsub=
        onSnapshot(
          //unsub = onSnapshot
          q,
          (querySnapshot) => {
            changes = querySnapshot //changes is array of docs added or modified in collection
              .docChanges();
            let targetDoc;
            for (let i = 0; i < changes.length; i++) {
              // const idArr=changes[i]?.doc["_key"]?.path?.segments
              const id = changes[i].doc.id;
              if (id === (state.roomId || state.enterRoomId)) {
                targetDoc = changes[i].doc.data();
                typeOfChange.current = changes[i].type;
                // setTypeOfChange(changes[i].type)
                break;
              }
            }
            console.log("line 109 changes added= ", state.changesAdded);
            if (
              !state.changesAdded &&
              targetDoc &&
              !targetDoc.playerRequesting
            ) {
              console.log("line 111", targetDoc, typeof targetDoc);
              dispatch({
                type: "SetStates",
                changesAdded: true,
                payload: { ...targetDoc, changesAdded: true },
              });
            } else if (typeOfChange.current === "modified") {
              console.log("line 119", targetDoc, typeof targetDoc);
              // setTypeOfChange("")
              typeOfChange.current = "";
              dispatch({ type: "SetStates", payload: targetDoc });
              dataFetched.current = true;
            }

            // console.log("line 124", changes[0]);
            // console.log("changes", changes[0].doc.data());
          },
          (error) => {
            console.log(error);
          }
        );
        // }, [2000]);
      }
    }
  }, [state.horizontalButtons, state.verticalButtons, state.playerEnteredRoom]);

  useEffect(() => {
    let playerInfo;
    const updateAnotherDocState = async () => {
      // console.log("line 270, inside updateAnotherDocState()");
      if (!state.player2Id) {
        // const dataFromLocal =
        //   typeof window !== "undefined" && window.localStorage
        //     ? localStorage.getItem("player")
        //     : null;
        playerInfo = state?.playerSignedIn;
        // console.log("line 278", playerInfo, state.player1Id);
        if (playerInfo === state.player1Id) {
          // console.log("line 279", "Cannot playwith oneself!");
          alert("Cannot playwith oneself!");
          // console.log("line 281", "updated playerEnteredRoom in db");
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
              player1Id: "",
              player2Id: "",
            },
          });
          navigate("/signIn");
          return false;
        }
        dispatch({
          type: "SetStates",
          payload: {
            player2Id: playerInfo,
          },
        });
      } else if (state.player2Id && state.player2Id === state.player1Id) {
        // console.log("line 319", "Cannot playwith oneself!");
        alert("Cannot playwith oneself!");
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
            player1Id: "",
            player2Id: "",
          },
        });
        navigate("/signIn");
        return false;
      }
      const docSnap = await getDoc(doc(db, "games", "XhxrYcgKoKl9eLoCVFl2"));

      if (docSnap.exists()) {
        const data = docSnap.data();
        updateDoc(doc(db, "games", "XhxrYcgKoKl9eLoCVFl2"), {
          number_of_games_played_per_day:
            data.number_of_games_played_per_day + 1,
          players: {
            ...data.players,
            [playerInfo]:
              (data?.players[playerInfo] ? data?.players[playerInfo] : 0) + 1,
          },
        });
      }
      return true;
    };
    if (!state.Routed && InitialRender1.current) {
      InitialRender1.current = false;
    } else if (!state.Routed && !InitialRender1.current) {
      if (
        state.playerEnteredRoom &&
        state.player1Id &&
        state.playerFixed === "2"
      ) {
        console.log("line 369");
        updateAnotherDocState().then((res) => {
          console.log("line 373", res);
          if (res) {
            updateDocState({
              player2Id: state.player2Id ? state.player2Id : playerInfo,
            }).then(() => {
              dispatch({
                type: "SetStates",
                payload: {
                  modalShow: true,
                },
              });
            });
          }
        });
      }
    }
  }, [state.playerEnteredRoom, state.player1Id]);

  useEffect(() => {
    if (
      (state.roomId || state.enterRoomId) &&
      state.playerRequesting !== state.playerFixed
    ) {
      // let changeGame=confirm("Requesting for game change?")
      // updateDocState({changeGame:changeGame})
      alert(
        `Player ${state.playerRequesting} exited game or has played max games allowed/day or players loby full. Please send this code to another friend.`
      );
    }
  }, [state.playerRequesting]);

  useEffect(() => {
    console.log(3);
    console.log("line 229: state.sel", state.sel);
    if (!state.Routed && InitialRender2.current) {
      InitialRender2.current = false;
    } else if (
      !state.Routed &&
      !InitialRender2.current &&
      state.numberOfSquares > 0 &&
      state.numberOfSquares === state.row * state.col
    ) {
      if (state.playerEnteredRoom) {
        console.log("line 239", "doc updated");
        updateDocState({
          sel: "Select size here",
          won:
            state.player1Score > 0 || state.player2Score > 0
              ? `${
                  state.player1Score > state.player2Score
                    ? state.player1Name
                    : state.player1Score === state.player2Score &&
                      state.player1Score > 0
                    ? " Tied and no one"
                    : state.player2Name
                } won!`
              : "",
        });
      } else {
        console.log("dispatching on line 256");
        dispatch({
          type: "SetStates",
          payload: {
            sel: "Select size here",
            won:
              state.player1Score > 0 || state.player2Score > 0
                ? `${
                    state.player1Score > state.player2Score
                      ? state.player1Name
                      : state.player1Score === state.player2Score &&
                        state.player1Score > 0
                      ? " Tied and no one"
                      : state.player2Name
                  } won!`
                : "",
          },
        });
      }
    }
  }, [state.numberOfSquares]);

  useEffect(() => {
    console.log(4);
    if (!state.Routed && InitialRender3.current) {
      InitialRender3.current = false;
    } else if (state.Routed && InitialRender3.current) {
      dispatch({ type: "SetStates", payload: { Routed: false } });
      InitialRender0.current = false;
      InitialRender1.current = false;
      InitialRender2.current = false;
      InitialRender3.current = false;
    } else if (
      !state.Routed &&
      !InitialRender3.current &&
      state.won &&
      state.start
    ) {
      if (state.playerEnteredRoom) {
        updateDocState({ won: "" });
        console.log("line 296", "doc updated");
      } else {
        console.log("dispatching on line 299");
        dispatch({ type: "SetStates", payload: { won: "" } });
      }
    } else if (!state.Routed && !InitialRender3.current && state.won) {
      if (state.playerEnteredRoom) {
        timeOut = setTimeout(() => {
          const temp = async () => {
            await deleteDoc(
              doc(db, "users", state.roomId || state.enterRoomId)
            ).then(() => {
              console.log("line 229");
              dispatch({
                type: "SetStates",
                payload: {
                  won: "",
                  sel: "Select size here",
                  playerEnteredRoom: false,
                  player1Live: false,
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
            });
          };
          temp();
        }, [1000]);

        // dispatch({ type: "SetStates", payload: { won: "" } });
        // updateDocState({ won: "" });
        console.log("line 235", "doc updated");
      }
    }
    return () => {
      if (timeOut && !state.playerEnteredRoom) clearTimeout(timeOut);
    };
  }, [state.start, state.won]);

  return (
    <div className="Appe">
      {state.sel !== "Select size here" &&
      !state.won &&
      !state.roomId &&
      !state.player1Live &&
      !state.playerEnteredRoom ? (
        <GridComponent />
      ) : state.sel === "Select size here" && state.won ? (
        <div>
          <br />
          <h3 className="result">{state.won}</h3>
        </div>
      ) : state.sel !== "Select size here" && state.won ? (
        ""
      ) : state?.playerEnteredRoom &&
        state.player1Id &&
        state.player2Id &&
        state.player1Id !== state.player2Id ? (
        <GridComponent />
      ) : state.enterRoom ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("line 255 newnavbar", state.enterRoomId);
            updateDocState({
              playerEnteredRoom: true,
            }).then(() => {
              console.log("line 260", "dispatched");
              dispatch({
                type: "SetStates",
                payload: {
                  playerEnteredRoom: true,
                  playerFixed: "2",
                },
              });
              console.log("line 266", state.player1Id);
            });
          }}
        >
          <input
            placeholder="Enter id"
            value={state.enterRoomId}
            onChange={(e) => {
              dispatch({
                type: "SetStates",
                payload: { enterRoomId: e.target.value },
              });
              // setEnterRoomId(e.target.value)
            }}
          />
          <Button variant="contained" type="submit">
            Enter room
          </Button>
        </form>
      ) : state.roomId || state.enterRoomId ? (
        <MovingText
          type="blur"
          duration="1100ms"
          delay="500ms"
          direction="alternate-reverse"
          timing="ease"
          iteration="infinite"
          fillMode="both"
        >
          <div style={{ fontSize: "50px", fontWeight: "600px", color: "#fff" }}>
            Creating Room
          </div>
        </MovingText>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => {
              let obj = setStatesAfterSel(2, 3);
              console.log("line 214", obj);
              if (Object.keys(obj).length > 0) {
                dispatch({
                  type: "SetStates",
                  payload: {
                    Box: [],
                    start: false,
                    row: 2,
                    col: 3,
                    ...obj,
                    sel: "2*3",
                    gridWidth: 55*(3+1),
                    gridHeight: 55*(2+1)
                  },
                });
              }
              if (state.playerEnteredRoom)
                updateDocState({
                  row: 2,
                  col: 3,
                  ...obj,
                  sel: "2*3",
                  gridWidth: 55*(3+1),
                  gridHeight: 55*(2+1)
                });
            }}
            style={{
              backgroundColor: "inherit",
              fontSize: "large",
              color: "#354dc1",
              marginTop: "0.625rem",
            }}
            className="start-default"
          >
            Start 2 x 3 game
          </button>
          <br />
          {state?.playerSignedIn ? (
            <button
              style={{
                backgroundColor: "inherit",
                fontSize: "large",
                color: "#354dc1",
                marginTop: "0.625rem",
              }}
              onClick={() => {
                dispatch({
                  type: "SetStates",
                  payload: { playerSignedIn: "" },
                });
                alert("Signed Out!");
              }}
            >
              SignOut
            </button>
          ) : (
            <button
              style={{
                backgroundColor: "inherit",
                fontSize: "large",
                color: "#354dc1",
                marginTop: "0.625rem",
              }}
              onClick={() => {
                navigate("/signIn");
                dispatch({
                  type: "SetStates",
                  payload: {
                    Routed: true,
                  },
                });
              }}
            >
              SignIn
            </button>
          )}
        </div>
      )}
      {/* Idea for rendering square color on click of all neighbouring buttons: Create react components for four buttons surrounding innerbox or square which is to be colored and pass 'isClicked' prop to Button component i.e. <Button isClicked={}/> and from Button Component pass result of isClicked to a function in App.js whose result of allButtons clicked is passed as a prop to innerBox React component and then if allButtons clicked is true then change color of innerBox from innerBox react component there itself  */}
    </div>
  );
}
export default SquareGrid;
