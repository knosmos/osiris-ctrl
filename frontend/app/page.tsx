'use client';
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { fetch_data } from "./api";

export default function Home() {
  const pidRef = useRef<SVGSVGElement>(null);
  const pidObjRef = useRef<HTMLObjectElement>(null);

  // for dev purpose: show x and y coordinates of mouse over PID
  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);
  function handleMouseMove(event: React.MouseEvent) {
    if (pidRef.current) {
      const rect = pidRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width * 100;
      const y = (event.clientY - rect.top) / rect.width * 100;
      setMx(x);
      setMy(y);
    }
  }

  // const pos = [
  //   {id: "PT7", x: 630, y: 272, value: "100 PSI", color: "emerald-500"},
  //   {id: "LC1", x: 630, y: 292, value: "380 N", color: "white"},
  //   {id: "TC3", x: 630, y: 312, value: "100 C", color: "emerald-500"},
  //   {id: "PT6", x: 650, y: 340, value: "100 PSI", color: "emerald-500"},

  //   {id: "PT5", x: 865, y: 360, value: "100 PSI", color: "emerald-500"},
  //   {id: "TC1", x: 865, y: 380, value: "100 C", color: "emerald-500"},
  //   {id: "TC2", x: 825, y: 250, value: "100 C", color: "emerald-500"},

  //   {id: "DPT", x: 650, y: 150, value: "0 PSI", color: "emerald-500"},

  //   {id: "PT3", x: 360, y: 190, value: "100 PSI", color: "orange-400"},
  //   {id: "PT4", x: 360, y: 390, value: "100 PSI", color: "emerald-500"},

  //   {id: "PT9", x: 690, y: 455, value: "100 PSI", color: "emerald-500"},

  //   {id: "PT2", x: 665, y: 380, value: "100 PSI", color: "red-400"},
  //   {id: "PT1", x: 580, y: 380, value: "100 PSI", color: "red-400"},

  //   {id: "LC2", x: 490, y: 339, value: "100 N", color: "white"},

  //   {id: "PT8", x: 360, y: 290, value: "100 PSI", color: "emerald-500"},
  // ];
  const [pos, setPos] = useState([
    {id: "FPT1", x: 450, y: 215, value: "0 PSI", color: "emerald-500"},
    {id: "FPT2", x: 770, y: 220, value: "100 PSI", color: "emerald-500"},
    {id: "FPT3", x: 890, y: 220, value: "100 PSI", color: "emerald-500"},
    {id: "CPT1", x: 700, y: 285, value: "100 PSI", color: "emerald-500"},
    {id: "NPT1", x: 415, y: 354, value: "100 PSI", color: "emerald-500"},
    {id: "LC3", x: 690, y: 373, value: "380 N", color: "white"},
    {id: "LC2", x: 690, y: 393, value: "380 N", color: "white"},
    {id: "TC2", x: 670, y: 413, value: "100 C", color: "emerald-500"},
    {id: "FPT4", x: 695, y: 440, value: "100 PSI", color: "emerald-500"},
    {id: "CPT2", x: 790, y: 455, value: "100 PSI", color: "emerald-500"},
    {id: "TC1", x: 872, y: 428, value: "100 C", color: "emerald-500"},
    {id: "OPT1", x: 450, y: 478, value: "0 PSI", color: "emerald-500"},
    {id: "LC1", x: 555, y: 440, value: "380 N", color: "white"},
    {id: "OPT4", x: 790, y: 487, value: "100 PSI", color: "emerald-500"},
    {id: "FPT5", x: 890, y: 487, value: "100 PSI", color: "emerald-500"},
    {id: "OPT2", x: 650, y: 520, value: "0 PSI", color: "emerald-500"},
    {id: "OPT3", x: 750, y: 520, value: "100 PSI", color: "emerald-500"},
    {id: "OPT0", x: 700, y: 552, value: "100 PSI", color: "emerald-500"},
  ])

  const inactiveColorBase = "#009b9e";
  const activeColorBase = "#ff4382";

  // const valveMapping = {
  //   1: "OKVA-1",
  //   2: "OVV-2",
  //   3: "OFV-1",
  //   4: "OTV-1",
  //   5: "NFV-1",
  //   6: "OPV-1",
  //   7: "OVV-1",
  //   8: "ODV-1",
  //   9: "NVV-1",
  //   10: "OIV-2",
  //   11: "NIV-1",
  //   12: "FIV-1",
  //   13: "OIV-1",
  //   14: "FDV-1",
  //   15: "FVV-1",
  //   16: "FPV-1"
  // }
  const valveMapping = {
    1: "FVV-1",
    2: "FDV-1",
    3: "FPV-1",
    4: "FTV-1",
    5: "NFV-1",
    6: "FFV-1",
    7: "OFV-2",
    8: "NVV-1",
    9: "OPV-1",
    10: "OTV-1",
    11: "OVV-1",
    12: "ODV-1",
    13: "OIV-2",
    14: "OFV-1",
    15: "OKVA-1",
    16: "OIV-1",
    17: "NIV-1",
    18: "FIV-1",
    19: "OVV-2",
    20: "SP-1",
  }

  useEffect(() => {
    if (pidObjRef.current) {
      setTimeout(() => {
        const svg = pidObjRef.current;
        if (svg && svg.contentDocument) {
          for (const [valve, valveId] of Object.entries(valveMapping)) {
            const suffix = valve.padStart(2, '0');
            const elems_fill = svg.contentDocument?.querySelectorAll(`[fill$='ff00${suffix}']`);
            const elems_stroke = svg.contentDocument?.querySelectorAll(`[stroke$='ff00${suffix}']`);
            elems_fill?.forEach((el) => {
              el.setAttribute("valve", valveId);
              el.setAttribute("fill", inactiveColorBase);
            });
            elems_stroke?.forEach((el) => {
              el.setAttribute("valve", valveId);
              el.setAttribute("stroke", inactiveColorBase);
            });
          }
        }
      }, 100);
    }
  }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     let svg = document.getElementById("pid_obj") as HTMLObjectElement;
  //     if (svg && svg.contentDocument) {
  //       let doc = svg.contentDocument;
  //       for (const valveId of Object.values(valveMapping)) {
  //         let elements = doc.querySelectorAll(`[valve='${valveId}']`);
  //         let isActive = Math.random() < 0.5;
  //         elements.forEach((el) => {
  //           if (el.hasAttribute("fill")) {
  //             el.setAttribute("fill", isActive ? activeColorBase : inactiveColorBase);
  //           }
  //           if (el.hasAttribute("stroke")) {
  //             el.setAttribute("stroke", isActive ? activeColorBase : inactiveColorBase);
  //           }
  //         });
  //       }
  //     }
  //   }, 200);
  //   return () => clearInterval(interval);
  // }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      let svg = document.getElementById("pid_obj") as HTMLObjectElement;
      if (svg && svg.contentDocument) {
        fetch_data().then((data) => {
          for (const valveId of Object.values(valveMapping)) {
            let elements = svg.contentDocument?.querySelectorAll(`[valve='${valveId}']`);
            let isActive = data["valves"][valveId];
            elements?.forEach((el) => {
              if (el.hasAttribute("fill")) {
                el.setAttribute("fill", isActive ? activeColorBase : inactiveColorBase);
              }
              if (el.hasAttribute("stroke")) {
                el.setAttribute("stroke", isActive ? activeColorBase : inactiveColorBase);
              }
            });
          }
          setPos(prevPos => prevPos.map(sensor => ({
            ...sensor,
            value: data["sensors"][sensor.id] || sensor.value
          })));
        }).catch((error) => {
          console.error("Error fetching data:", error);
        });
      }
    }, 200);
    return () => clearInterval(interval);
  });

  return (
    <div className="bg-black h-screen text-white font-sans overflow-hidden"  onMouseMove={handleMouseMove}>
    {/* HEADER */}
    <header>
      <div className="flex items-center p-4 space-x-4">
        <div className="logo">
          <Image
            src="/rocketteam.png"
            alt="MIT Rocket Team"
            width={100}
            height={50}
            className="inline-block"
          />
        </div>
        <div className="text-2xl tracking-widest">
          OSIRIS
        </div>
        <div className="text-2xl tracking-widest text-gray-400">
          〉DRYRUN 1
        </div>
        {/* <div className="text-sm text-gray-400 font-mono">
          MX: {mx.toFixed(0)} | MY: {my.toFixed(0)}
        </div> */}
        <div className="flex-1"></div>
        <div className="text-2xl tracking-widest text-gray-400">
          T-00:12.40
        </div>
        <Image
          src="/mit.png"
          alt="MIT Logo"
          width={60}
          height={20}
          className="inline-block"
        />
      </div>
      <div className="border-t h-0.5 border-gray-400 mx-4"></div>
    </header>
    <div className="grid grid-cols-[3fr_1fr] h-[80vh]">

      {/* P & ID */}
      <div className="px-4 pt-10 relative">
        <svg className="max-w-full h-auto" viewBox="0 0 1000 700" xmlns="http://www.w3.org/2000/svg" ref={pidRef}>
          <foreignObject width="1000" height="700" x="0" y="0">
            <object className="max-w-full h-auto invert pointer-events-none" type="image/svg+xml" data="pid.svg" id="pid_obj" ref={pidObjRef}></object>
          </foreignObject>
          {pos.map((p) => (
            <foreignObject key={p.id} width="1000" height="700" x={p.x} y={p.y}>
              <div className={`absolute font-bold text-xs border border-${p.color} rounded box-border bg-black`}>
                <span className={`text-black bg-${p.color} px-1 inline-block rounded-l-xs`}>{p.id}</span>
                <span className={`text-${p.color} px-1`}>{p.value}</span>
              </div>
            </foreignObject>
          ))}
        </svg>
        {/* We need to create a bunch of dummy elements for Tailwind to compile the colors */}
        <div className="hidden">
          <div className="text-emerald-500 bg-emerald-500 border-emerald-500"></div>
          <div className="text-red-400 bg-red-400 border-red-400"></div>
          <div className="text-orange-400 bg-orange-400 border-orange-400"></div>
          <div className="text-white bg-white border-white"></div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="p-4 m-4 border border-gray-400 rounded-lg">
        <div className="space-y-2">
          <div className="text-lg uppercase tracking-widest text-gray-400">SYSTEM ///</div>
          <div className="grid grid-cols-[3fr_1fr] gap-2 text-sm">
            <div className="text-gray-300 tracking-widest uppercase">ARMING</div>
            <div className="text-emerald-600 tracking-widest uppercase">ACTIVE</div>
            <div className="text-gray-300 tracking-widest uppercase">PROGRAM</div>
            <div className="text-emerald-600 tracking-widest uppercase">FIRE</div>
          </div>
        </div>
        <div className="w-full border-t border-gray-400 rounded-full h-0.5 my-4"></div>
        <div className="space-y-2">
          <p className="text-lg uppercase tracking-widest text-gray-400 mb-2">THROTTLE ///</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-300 uppercase tracking-widest">Oxidizer</div>
              <div className="text-3xl">75%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-300 uppercase tracking-widest">Fuel</div>
              <div className="text-3xl">80%</div>
            </div>
          </div>
        </div>
        <div className="w-full border-t border-gray-400 rounded-full h-0.5 my-4"></div>
        <div className="space-y-2">
          <div className="text-lg uppercase tracking-widest text-gray-400">SUBSYSTEMS ///</div>
          <div className="grid grid-cols-[3fr_1fr] gap-2 text-sm">
            <div className="text-gray-300 tracking-widest uppercase">PRESSURE</div>
            <div className="text-emerald-600 tracking-widest uppercase">NOMINAL</div>
            <div className="text-gray-300 tracking-widest uppercase">TEMPERATURE</div>
            <div className="text-emerald-600 tracking-widest uppercase">NOMINAL</div>
            {/* <div className="text-gray-300 tracking-widest uppercase">VOLTAGE</div>
            <div className="text-emerald-600 tracking-widest uppercase">NOMINAL</div>
            <div className="text-gray-300 tracking-widest uppercase">CURRENT</div>
            <div className="text-orange-400 tracking-widest uppercase">Over</div> */}
            <div className="text-gray-300 tracking-widest uppercase">COMMUNICATIONS</div>
            <div className="text-emerald-600 tracking-widest uppercase">NOMINAL</div>
            {/* <div className="text-gray-300 tracking-widest uppercase">ACTUATORS</div>
            <div className="text-emerald-600 tracking-widest uppercase">NOMINAL</div>
            <div className="text-gray-300 tracking-widest uppercase">SWITCHBOARD</div>
            <div className="text-red-400 tracking-widest uppercase">Error</div> */}
          </div>
          <div className="w-full border-t border-gray-400 rounded-full h-0.5 my-4"></div>
          <div className="space-y-2 text-sm">
            <div className="text-lg uppercase tracking-widest text-gray-400">PROGRAM ///</div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-emerald-600"></div>
              <div className="text-gray-300 tracking-widest uppercase">Fueling</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gray-700 border border-gray-400"></div>
              <div className="text-gray-400 tracking-widest uppercase">Ignition</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gray-700 border border-gray-400"></div>
              <div className="text-gray-400 tracking-widest uppercase">Await Pressure Spike</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gray-700 border border-gray-400"></div>
              <div className="text-gray-400 tracking-widest uppercase">Throttling Profile</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gray-700 border border-gray-400"></div>
              <div className="text-gray-400 tracking-widest uppercase">Detank</div>
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-6 uppercase tracking-widest">
            Osiris Visualizer Rev 2<br/>Jieruei Chang | MIT Rocket Team
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
