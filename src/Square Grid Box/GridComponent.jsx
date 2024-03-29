import React, { useContext, useEffect, useState } from "react";
import { GridContext } from "../Contexts";
import ButtonSound2 from "../NewNavbar/ButtonSound/button1.mp3";

function GridComponent() {
  const { state, areAllClicked, setClick } = useContext(GridContext);
  const audio2 = new Audio(ButtonSound2);
  const [mainProps, setMainProps] = useState({});

  // useEffect(() => {
  //   function handleSize() {
  //     const ele = document.getElementsByClassName("main-section")[0];
  //     const width =
  //       state?.gridWidth > ele.getBoundingClientRect().width
  //         ? "var(--width)"
  //         : `calc(${state?.col + 1} * var(--square_width))`;

  //     const height =
  //       state?.gridHeight > ele.getBoundingClientRect().height ||
  //       state?.gridWidth > ele.getBoundingClientRect().width
  //         ? "var(--height)"
  //         : `calc(${state?.row + 1} * var(--square_height))`;

  //     const gridColumnsWidth =
  //       state?.gridWidth > ele.getBoundingClientRect()?.width
  //         ? `repeat(${state?.col + 1},calc(var(--width) / ${state?.col + 1}))`
  //         : `repeat(${state?.col + 1},1fr)`;

  //     const gridRowsWidth =
  //       state?.gridWidth > ele.getBoundingClientRect()?.width ||
  //       state?.gridHeight > ele.getBoundingClientRect().height
  //         ? `repeat(${state?.row + 1},calc(var(--width) / ${state?.col + 1}))`
  //         : `repeat(${state?.row + 1},1fr)`;
  //     setMainProps({ width, height, gridColumnsWidth, gridRowsWidth });
  //   }

  //   // Add event listener
  //   window.addEventListener("resize", handleSize);

  //   // Call handler right away so state gets updated with initial window size
  //   handleSize();

  //   // Remove event listener on cleanup
  //   return () => window?.removeEventListener("resize", handleSize);
  // }, []);

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
          //for fixing grid size-->
          //calc(${state?.row+1} * var(--square_height)=(state?.row+1)*80, where var(--square_height)=55px
          height: 
          // mainProps?.height,
          state?.gridWidth >
            document
              .getElementsByClassName("main-section")[0]
              ?.getBoundingClientRect()?.width ||
          state?.gridHeight >
            document
              .getElementsByClassName("main-section")[0]
              ?.getBoundingClientRect()?.height
            ? "var(--height)"
            : `calc(${state?.row + 1} * var(--square_height))`,

          width: 
          // mainProps?.width,
          state?.gridWidth >
          document
            .getElementsByClassName("main-section")[0]
            ?.getBoundingClientRect()?.width
            ? "var(--width)"
            : `calc(${state?.col + 1} * var(--square_width))`,

          gridTemplateColumns: 
          // mainProps?.gridColumnsWidth,
          state?.gridWidth >
          document
            .getElementsByClassName("main-section")[0]
            ?.getBoundingClientRect()?.width
            ? `repeat(${state?.col + 1},calc(var(--width) / ${
                state?.col + 1
              }))`
            : `repeat(${state?.col + 1},1fr)`,

          gridTemplateRows: 
          // mainProps?.gridRowsWidth,
          state?.gridWidth >
            document
              .getElementsByClassName("main-section")[0]
              ?.getBoundingClientRect()?.width ||
          state?.gridHeight >
            document
              .getElementsByClassName("main-section")[0]
              ?.getBoundingClientRect()?.height
            ? `repeat(${state?.row + 1},calc(var(--width) / ${
                state?.col + 1
              }))`
            : `repeat(${state?.row + 1},1fr)`,

          //for fixing square(onebox, twobox) in grid size-->
          // height:`calc(${state?.row+1}*var(--height))`,
          // width:`calc(${state?.col+1}*var(--width))`,
          // gridTemplateColumns:`repeat(${state?.col+1},1fr)`,
          // gridTemplateRows:`repeat(${state?.row+1},1fr)`

          // transform: `translateX(-calc(var(--width)/${state?.col+1}))`
          // transform: `translateX(-calc(var(--width) / 2))`
        }}
        onFocus={() => {
          const elem = document.getElementById("#grid-box");
          console.log(
            "calculation width:",
            (state?.col + 1) * 55,
            " client width ",
            document
              .getElementsByClassName("main-section")[0]
              ?.getBoundingClientRect()?.width
          );
        }}
      >
        {state?.Box?.map((item) =>
          item >= state?.row * (state?.col + 1) ? (
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
                      ]?.active
                        ? "2px solid black"
                        : "none"
                    }`,
                  }}
                  disabled={
                    (state?.player1Live &&
                      state?.playerEnteredRoom &&
                      state?.playerFixed != state?.player) ||
                    state?.horizontalButtons[
                      item - Math.floor(item / (state?.col + 1))
                    ]?.isClicked
                  }
                  onClick={() => {
                    setClick(
                      item - Math.floor(item / (state?.col + 1)),
                      "horizontal"
                    );
                    areAllClicked(
                      item - Math.floor(item / (state?.col + 1)),
                      "horizontal"
                    );
                    audio2.play();
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
                    state?.playerFixed != state?.player) ||
                  state?.verticalButtons[item]?.isClicked
                }
                onClick={() => {
                  setClick(item, "vertical");
                  areAllClicked(item, "vertical");
                  audio2.play();
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
                    ]?.active
                      ? "2px solid black"
                      : "none"
                  }`,
                }}
                disabled={
                  (state?.player1Live &&
                    state?.playerEnteredRoom &&
                    state?.playerFixed != state?.player) ||
                  state?.horizontalButtons[
                    item - Math.floor(item / (state?.col + 1))
                  ]?.isClicked
                }
                onClick={() => {
                  setClick(
                    item - Math.floor(item / (state?.col + 1)),
                    "horizontal"
                  );
                  areAllClicked(
                    item - Math.floor(item / (state?.col + 1)),
                    "horizontal"
                  );
                  audio2.play();
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
                    state?.playerFixed != state?.player) ||
                  state?.verticalButtons[item]?.isClicked
                }
                onClick={() => {
                  setClick(item, "vertical");
                  areAllClicked(item, "vertical");
                  audio2.play();
                }}
              ></button>
              <div
                className="innerBox"
                style={{
                  backgroundColor:
                    state?.squaresColors[
                      item - Math.floor(item / (state?.col + 1))
                    ]?.squarecolor,
                  border: state?.squaresColors[
                    item - Math.floor(item / (state?.col + 1))
                  ]?.active
                    ? "2px solid black"
                    : "none",
                }}
              >
                {/* {(state?.squaresColors[item-Math.floor(item/(state?.col+1))].squarecolor==="#eb5d5d"?state?.player1Name:null)||
                    (state?.squaresColors[item-Math.floor(item/(state?.col+1))].squarecolor==="#42c442"?state?.player2Name:null)} */}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default GridComponent;
