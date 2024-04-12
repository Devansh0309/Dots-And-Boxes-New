import React, { useContext, useEffect, useState } from "react";
import { GridContext } from "../Contexts";
import ButtonSound2 from "../NewNavbar/ButtonSound/button1.mp3";

function GridComponent() {
  const { state, areAllClicked, setClick } = useContext(GridContext);
  const audio2 = new Audio(ButtonSound2);
  const [mainProps, setMainProps] = useState({});

  useEffect(() => {
    function handleSize() {
      const ele = document.getElementsByClassName("main-section")[0];
      console.log("inside handleSize","grid width set: ",state.gridWidth,"current viewportWidth: ",
       ele.getBoundingClientRect().width)  
       const squareWidth = getComputedStyle(document.getElementsByClassName("gridBox")[0])?.getPropertyValue('--square_width').split("px")[0];
       const squareHeight = getComputedStyle(document.getElementsByClassName("gridBox")[0])?.getPropertyValue('--square_height').split("px")[0];
       
       console.log(squareHeight, squareWidth)

       const gridW = getComputedStyle(document.getElementsByClassName("gridBox")[0])?.getPropertyValue('--width').split("px")[0];
       const gridH = getComputedStyle(document.getElementsByClassName("gridBox")[0])?.getPropertyValue('--height').split("px")[0];
       const gridWidth = (state.col+1)*squareWidth
       const gridHeight = (state.row+1)*squareHeight
      const width =
        gridWidth > ele.getBoundingClientRect().width
          ?`${0.85*gridW}`
          : gridWidth;

      const height =
        gridHeight > ele.getBoundingClientRect().height ||
        gridWidth > ele.getBoundingClientRect().width
          ? `${0.85*gridH}`
          : gridHeight;

      const gridColumnsWidth =
        gridWidth > ele.getBoundingClientRect().width
          ? `repeat(${state.col + 1},${`${0.85*gridW}`/(state.col + 1)}px)`
          : `repeat(${state.col + 1},1fr)`;

      const gridRowsWidth =
        gridWidth > ele.getBoundingClientRect().width ||
        gridHeight > ele.getBoundingClientRect().height
          ? `repeat(${state.row + 1},${`${0.85*gridH}`/(state.row + 1)}px)`
          : `repeat(${state.row + 1},1fr)`;
      
      
          console.log("inside handleSize below","grid width set: ",gridWidth,"current viewportWidth: ",
          ele.getBoundingClientRect().width,"width set", width,"height set", height, gridColumnsWidth, gridRowsWidth) 
      setMainProps({ width, height, gridColumnsWidth, gridRowsWidth });
    }

    // Add event listener
    window.addEventListener("resize", handleSize);

    // Call handler right away so state gets updated with initial window size
    handleSize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleSize);

  }, [state.col, state.row, state.gridWidth, state.gridHeight]);

  const handleClick = (item, type) => {
    setClick(item, type);
    areAllClicked(item, type);
    audio2.play();
  };

  return (
    <div className="main-section">
      <div className="player-scores">
        <div className="player-1-score">
          {state?.player1Name}: {state?.player1Score}
        </div>
        <div className="player-2-score">
          {state?.player2Name}: {state?.player2Score}
        </div>
      </div>
      <div
        className="chance"
        style={{
          backgroundColor: state?.player === "1" ? "#eb5d5d" : "#42c442",
        }}
      >
        {state?.player === "1" ? state?.player1Name : state?.player2Name} chance
      </div>
      <div
        className="gridBox"
        style={{
          height: `${mainProps.height}px` || 'var(--height)',
          width: `${mainProps.width}px` || 'var(--width)',
          gridTemplateColumns: mainProps.gridColumnsWidth || "1fr",
          gridTemplateRows: mainProps.gridRowsWidth || "1fr",
        }}
      >
        {state?.Box?.map((item) => {
         
            return item >= state?.row * (state?.col + 1) ? (
              item < state?.row * state?.col + state?.row + state?.col ? (
                //dot + lower btns : horizontal btns
                <div className="twobox" key={item}>
                  <div className="dot"></div>
                  <button
                    className="lowerbtn"
                    style={{
                      backgroundColor: `${
                        state?.horizontalButtons[
                          item - Math.floor(item / (state?.col + 1))
                        ]?.btncolor
                      }`,
                      border: `${
                        state?.horizontalButtons[
                          item - Math.floor(item / (state?.col + 1))
                        ]?.active ? "2px solid black" : "none"
                      }`,
                    }}
                    disabled={
                      (state?.player1Live &&
                        state?.playerEnteredRoom &&
                        state?.playerFixed !== state?.player) ||
                      state?.horizontalButtons[
                        item - Math.floor(item / (state?.col + 1))
                      ]?.isClicked
                    }
                    onClick={() => {
                      handleClick(
                        item - Math.floor(item / (state?.col + 1)),
                        "horizontal"
                      );
                    }}
                  ></button>
                </div>
              ) : (
                //last component of grid containing one dot only
                <div className="dot" key={item}></div>
              )
            ) : item % (state?.col + 1) === state?.col ? (
               //side last vertical btns - right vertical btns + dot
              <div
                className="twobox"
                style={{ flexDirection: "column" }}
                key={item}
              >
                <div className="dot"></div>
                <button
                  className="sidelastbtn"
                  style={{
                    backgroundColor: `${state?.verticalButtons[item]?.btncolor}`,
                    border: `${
                      state?.verticalButtons[item]?.active
                        ? "2px solid black"
                        : "none"
                    }`,
                  }}
                  disabled={
                    (state?.player1Live &&
                      state?.playerEnteredRoom &&
                      state?.playerFixed !== state?.player) ||
                    state?.verticalButtons[item]?.isClicked
                  }
                  onClick={() => {
                    handleClick(item, "vertical");
                  }}
                ></button>
              </div>
            ) : (
              //dot + upper btn + left vertical btn + inner box
              <div className="onebox" key={item}>
                <div className="dot"></div>
                <button
                  className="upperbtn"
                  style={{
                    backgroundColor: `${
                      state?.horizontalButtons[
                        item - Math.floor(item / (state?.col + 1))
                      ]?.btncolor
                    }`,
                    border: `${
                      state?.horizontalButtons[
                        item - Math.floor(item / (state?.col + 1))
                      ]?.active ? "2px solid black" : "none"
                    }`,
                  }}
                  disabled={
                    (state?.player1Live &&
                      state?.playerEnteredRoom &&
                      state?.playerFixed !== state?.player) ||
                    state?.horizontalButtons[
                      item - Math.floor(item / (state?.col + 1))
                    ]?.isClicked
                  }
                  onClick={() => {
                    handleClick(
                      item - Math.floor(item / (state?.col + 1)),
                      "horizontal"
                    );
                  }}
                ></button>
                <button
                  className="sidebtn"
                  style={{
                    backgroundColor: `${state?.verticalButtons[item]?.btncolor}`,
                    border: `${
                      state?.verticalButtons[item]?.active
                        ? "2px solid black"
                        : "none"
                    }`,
                  }}
                  disabled={
                    (state?.player1Live &&
                      state?.playerEnteredRoom &&
                      state?.playerFixed !== state?.player) ||
                    state?.verticalButtons[item]?.isClicked
                  }
                  onClick={() => {
                    handleClick(item, "vertical");
                  }}
                ></button>
                <div
                  className="innerBox"
                  style={{
                    backgroundColor:
                      state?.squaresColors[
                        item - Math.floor(item / (state?.col + 1))
                      ]?.squarecolor,
                    border:
                      state?.squaresColors[
                        item - Math.floor(item / (state?.col + 1))
                      ]?.active ? "2px solid black" : "none",
                  }}
                ></div>
              </div>
            )
          }
         
        )}
      </div>
    </div>
  );
}

export default GridComponent;
