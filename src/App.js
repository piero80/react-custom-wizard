import React, { useMemo, useState } from "react";
import "./App.css";
import classnames from "classnames";

function range(a, b) {
  return new Array(Math.abs(a - b) + 1).fill(a).map((v, i) => v + i);
}

function Stepper({ steps, activeStep, children, setCurrentPage }) {
  const count = steps.length;
  const listOfNum = useMemo(() => range(1, count), [count]);

  const tracker = useMemo(() => {
    let highestStep = 0;

    function hasVisited(step) {
      return highestStep >= step;
    }

    function addToBackLog(step) {
      if (step > highestStep) highestStep = step;
    }

    return {
      hasVisited,
      addToBackLog,
      getHighestStep() {
        return highestStep;
      },
    };
  }, []);

  tracker.addToBackLog(activeStep);

  const noop = () => {};

  const prevStep = steps[activeStep - 2];
  const currentStep = steps[activeStep - 1];
  const nextStep = steps[activeStep];

  return (
    <div className="container">
      <div className={classnames("stepper-navigation-rounded")}>
        {listOfNum.map((num, i) => {
          const isActive = activeStep === num;
          const isVisited = tracker.hasVisited(num);
          const isClickable = num <= tracker.getHighestStep() + 1 || isVisited;

          return (
            <div className={classnames("single-stepper")} key={num}>
              <span
                className={classnames("circle", {
                  active: isActive,
                  visited: isVisited,
                  clickable: isClickable,
                })}
                onClick={isClickable ? () => setCurrentPage(num) : noop}
              >
                {num}
              </span>
              {listOfNum.length - 1 !== i && (
                <span className={classnames("border")}></span>
              )}
            </div>
          );
        })}
      </div>
      <h2>{currentStep && currentStep.title}</h2>
      <div>{children}</div>
      <div className="footer">
        {prevStep ? (
          <button
            className={classnames("btn btn-primary")}
            onClick={() => setCurrentPage(activeStep - 1)}
          >
            prev
          </button>
        ) : null}
        {nextStep ? (
          <button
            className={classnames("btn btn-primary")}
            onClick={() => setCurrentPage(activeStep + 1)}
          >
            next
          </button>
        ) : null}
      </div>
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const sections = [
    { title: "One" },
    { title: "Two" },
    { title: "Three" },
    { title: "Four" },
    { title: "Five" },
  ];
  return (
    <Stepper
      steps={sections}
      activeStep={currentPage}
      setCurrentPage={setCurrentPage}
    >
      I'm page {currentPage}
    </Stepper>
  );
}

export default App;
