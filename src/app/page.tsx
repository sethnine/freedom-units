"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const freedomUnits = [
    { name: "Blue Whales", value: 22.0 }, // https://en.wikipedia.org/wiki/Blue_whale#:~:text=The%20average%20length,%5B53%5D
    { name: "Football Fields", value: 110 }, // https://en.wikipedia.org/wiki/American_football_field#:~:text=The%20entire%20field%20is%20a%20rectangle%20360%20feet
    { name: "School Busses", value: 13.7 }, // https://www.clrn.org/how-long-is-the-average-school-bus/
    { name: "Washing Machines", value: 0.6 }, // AI
    { name: "Aligators", value: 4.0 }, // https://en.wikipedia.org/wiki/Alligator#:~:text=An%20average%20adult%20American%20alligator%27s%20weight%20and%20length%20is%20360%C2%A0kg%20(790%C2%A0lb)%20and%204%C2%A0m
    { name: "Light nanoseconds", value: 0.3 }, // https://www.wolframalpha.com/input?i=1+light+nanosecondhttps://en.wikipedia.org/wiki/Nanosecond#:~:text=The%20nanosecond%20is%20often%20used%20in%20measuring%20the%20time%20it%20takes%20light%20to%20travel%20a%20specified%20distance
    { name: "Light picoseconds", value: 3e-4 }, // https://www.wolframalpha.com/input?i=1+light+picosecond
    // Olympic-Sized Swimming Pools
    { name: "Olympic-Sized Swimming Pools", value: 50 }, // https://en.wikipedia.org/wiki/Olympic-size_swimming_pool#:~:text=requires%20a%20course%20length%20of%2050%20metres
    // Stones throws
    { name: "Stones throws", value: 45.72 }, // https://www.reddit.com/r/theydidthemonstermath/comments/9ctu8s/if_an_average_human_throws_an_average_rock_as_far/
    // Hairs breadths
    { name: "Hairs breadths", value: 0.000075 }, // One nominal value often chosen is 75 micrometres
  ]
    .sort((a, b) => a.value - b.value)
    .reverse();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  useEffect(() => {
    if (input === "") {
      setOutput("");
      return;
    }

    enum unitType {
      metric,
      imperial,
    }

    const metricUnits = [
      { name: "km", value: 1000, type: unitType.metric }, // kilometre
      { name: "m", value: 1, type: unitType.metric }, // metre
      { name: "dm", value: 0.1, type: unitType.metric }, // decimetre
      { name: "cm", value: 0.01, type: unitType.metric }, // centimetre
      { name: "mm", value: 0.001, type: unitType.metric }, // millimetre
      { name: "μm", value: 0.000001, type: unitType.metric }, // micrometre
      { name: "nm", value: 0.000000001, type: unitType.metric }, // nanometre
      { name: "pm", value: 0.000000000001, type: unitType.metric }, // picometre
      { name: "in", value: 0.0254, type: unitType.imperial }, // inch
      { name: "ft", value: 0.3048, type: unitType.imperial }, // foot
      { name: "yd", value: 0.9144, type: unitType.imperial }, // yard
      { name: "mi", value: 1609.34, type: unitType.imperial }, // mile
      { name: "nmi", value: 1852, type: unitType.imperial }, // nautical mile
      { name: "ly", value: 9.461e15, type: unitType.metric }, // light-year
    ];

    const inputMatch = input.match(
      /([-+]?([0-9]*[.])?[0-9]+([eE][-+]?\d+)?)\s*([a-zA-Z]*)?/
    );

    if (inputMatch === null) {
      setOutput("Invalid input");
      return;
    }

    const value = parseFloat(inputMatch[1]);

    if (isNaN(value)) {
      setOutput("Invalid input");
      return;
    }

    const unit = inputMatch[4];
    console.log({ unit });

    const metricMultiplier =
      unit === undefined
        ? 1
        : metricUnits.find(({ name }) => name === unit)?.value;

    if (metricMultiplier === undefined) {
      setOutput("Invalid unit");
      return;
    }
    const metres = value * metricMultiplier;

    if (metres === undefined) {
      setOutput("Invalid input");
      return;
    }

    parseFloat(input);
    if (isNaN(metres)) {
      setOutput("Invalid input");
      return;
    }
    const freedoms = freedomUnits.reduce(
      (acc, unit) => {
        const unitsOfThisType = Math.floor(acc.remainingMetres / unit.value);
        const freedomUnitsNew =
          unitsOfThisType === 0
            ? acc.freedomUnits
            : acc.freedomUnits +
              unit.name +
              ": " +
              Math.floor(acc.remainingMetres / unit.value) +
              "\n";
        let remainingMetres = metres % unit.value;
        if (isNaN(remainingMetres)) {
          // Infinity or NaN
          remainingMetres = 0;
        }

        return {
          freedomUnits: freedomUnitsNew,
          remainingMetres: remainingMetres,
        };
      },
      { remainingMetres: metres, freedomUnits: "" }
    );
    setOutput(freedoms.freedomUnits);
  }, [input, freedomUnits]);

  return (
    <div className="flex flex-col justify-center items-center w-full md:pl-20 duration-300 transition-transform">
      <div className="prose dark:prose-invert p-4 w-full overflow-clip text-xl">
        <h1 className="text-wrap text-center overflow-clip w-full">
          Freedom Units Calculator
        </h1>
        <div className="flex md:flex-row flex-col gap-2 items-center justify-center">
          <label htmlFor="inputbox" typeof="number">
            Communist units:
          </label>
          <input
            className="bg-inherit text-inherit ring-black dark:ring-white ring rounded focus:outline-none p-2"
            type="text"
            id="inputbox"
            name="inputbox"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        {output.length > 0 && <pre>{output}</pre>}
      </div>
    </div>
  );
}
