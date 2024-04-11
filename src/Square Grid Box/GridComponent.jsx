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
      const width =
        state.gridWidth > ele.getBoundingClientRect().width
          ? "var(--width)"
          : `calc(${state.col + 1} * var(--square_width))`;

      const height =
        state.gridHeight > ele.getBoundingClientRect().height ||
        state.gridWidth > ele.getBoundingClientRect().width
          ? "var(--height)"
          : `calc(${state.row + 1} * var(--square_height))`;

      const gridColumnsWidth =
        state.gridWidth > ele.getBoundingClientRect().width
          ? `repeat(${state.col + 1},calc(var(--width) / ${state.col + 1}))`
          : `repeat(${state.col + 1},1fr)`;

      const gridRowsWidth =
        state.gridWidth > ele.getBoundingClientRect().width ||
        state.gridHeight > ele.getBoundingClientRect().height
          ? `repeat(${state.row + 1},calc(var(--height) / ${state.row + 1}))`
          : `repeat(${state.row + 1},1fr)`;

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
        id="grid-box"
        style={{
          height: mainProps.height || "var(--height)",
          width: mainProps.width || "var(--width)",
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
