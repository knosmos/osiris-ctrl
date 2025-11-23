'use client';
import Image from "next/image";
import { useRef, useState } from "react";

export default function Home() {
  const pidRef = useRef<HTMLElement>(null);

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

  const pos = [
    {id: "PT7", x: 630, y: 272, value: "100 PSI", color: "emerald-500"},
    {id: "LC1", x: 630, y: 292, value: "380 N", color: "white"},
    {id: "TC3", x: 630, y: 312, value: "100 C", color: "emerald-500"},
    {id: "PT6", x: 650, y: 340, value: "100 PSI", color: "emerald-500"},

    {id: "PT5", x: 865, y: 360, value: "100 PSI", color: "emerald-500"},
    {id: "TC1", x: 865, y: 380, value: "100 C", color: "emerald-500"},
    {id: "TC2", x: 825, y: 250, value: "100 C", color: "emerald-500"},

    {id: "DPT", x: 650, y: 150, value: "0 PSI", color: "emerald-500"},

    {id: "PT3", x: 360, y: 190, value: "100 PSI", color: "orange-400"},
    {id: "PT4", x: 360, y: 390, value: "100 PSI", color: "emerald-500"},

    {id: "PT9", x: 690, y: 455, value: "100 PSI", color: "emerald-500"},

    {id: "PT2", x: 675, y: 380, value: "100", color: "red-400"},
    {id: "PT1", x: 580, y: 380, value: "100", color: "red-400"},

    {id: "LC2", x: 490, y: 339, value: "100 N", color: "white"},

    {id: "PT8", x: 360, y: 290, value: "100 PSI", color: "emerald-500"},
  ]

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
          〉HOTFIRE 1
        </div>
        {/* <div className="text-sm text-gray-500 font-mono">
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
      <div className="border-t h-0.5 border-gray-500 mx-4"></div>
    </header>
    <div className="grid grid-cols-[3fr_1fr] h-[80vh]">

      {/* P & ID */}
      <div className="px-4 pt-10 relative">
        <svg className="max-w-full h-auto" viewBox="0 0 1000 700" xmlns="http://www.w3.org/2000/svg" ref={pidRef}>
          <foreignObject width="1000" height="700" x="0" y="0">
            <object className="max-w-full h-auto invert pointer-events-none" type="image/svg+xml" data="pid.svg"></object>
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
      <div className="p-4 m-4 border border-gray-500 rounded-lg">
        <div className="space-y-2">
          <div className="text-lg uppercase tracking-widest text-gray-500">SYSTEM ///</div>
          <div className="grid grid-cols-[3fr_1fr] gap-2 text-sm">
            <div className="text-gray-300 tracking-widest uppercase">ARMING</div>
            <div className="text-emerald-600 tracking-widest uppercase">ACTIVE</div>
            <div className="text-gray-300 tracking-widest uppercase">PROGRAM</div>
            <div className="text-emerald-600 tracking-widest uppercase">FIRE</div>
          </div>
        </div>
        <div className="w-full border-t border-gray-500 rounded-full h-0.5 my-4"></div>
        <div className="space-y-2">
          <p className="text-lg uppercase tracking-widest text-gray-500 mb-2">THROTTLE ///</p>
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
        <div className="w-full border-t border-gray-500 rounded-full h-0.5 my-4"></div>
        <div className="space-y-2">
          <div className="text-lg uppercase tracking-widest text-gray-500">SUBSYSTEMS ///</div>
          <div className="grid grid-cols-[3fr_1fr] gap-2 text-sm">
            <div className="text-gray-300 tracking-widest uppercase">PRESSURE</div>
            <div className="text-emerald-600 tracking-widest uppercase">NOMINAL</div>
            <div className="text-gray-300 tracking-widest uppercase">TEMPERATURE</div>
            <div className="text-emerald-600 tracking-widest uppercase">NOMINAL</div>
            <div className="text-gray-300 tracking-widest uppercase">VOLTAGE</div>
            <div className="text-emerald-600 tracking-widest uppercase">NOMINAL</div>
            <div className="text-gray-300 tracking-widest uppercase">CURRENT</div>
            <div className="text-orange-400 tracking-widest uppercase">Over</div>
            <div className="text-gray-300 tracking-widest uppercase">COMMUNICATIONS</div>
            <div className="text-emerald-600 tracking-widest uppercase">NOMINAL</div>
            <div className="text-gray-300 tracking-widest uppercase">ACTUATORS</div>
            <div className="text-emerald-600 tracking-widest uppercase">NOMINAL</div>
            <div className="text-gray-300 tracking-widest uppercase">SWITCHBOARD</div>
            <div className="text-red-400 tracking-widest uppercase">Error</div>
          </div>
          <div className="w-full border-t border-gray-500 rounded-full h-0.5 my-4"></div>
          <div className="space-y-2 text-sm">
            <div className="text-lg uppercase tracking-widest text-gray-500">PROGRAM ///</div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-emerald-600"></div>
              <div className="text-gray-300 tracking-widest uppercase">Fueling</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gray-700 border border-gray-500"></div>
              <div className="text-gray-500 tracking-widest uppercase">Ignition</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gray-700 border border-gray-500"></div>
              <div className="text-gray-500 tracking-widest uppercase">Await Pressure Spike</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gray-700 border border-gray-500"></div>
              <div className="text-gray-500 tracking-widest uppercase">Throttling Profile</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gray-700 border border-gray-500"></div>
              <div className="text-gray-500 tracking-widest uppercase">Detank</div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-6 uppercase tracking-widest">
            Osiris Visualizer Build 0.0.1<br/>Jieruei Chang | MIT Rocket Team
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
