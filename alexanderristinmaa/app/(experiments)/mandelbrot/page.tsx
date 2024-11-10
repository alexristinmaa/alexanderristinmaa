'use client';

import { MouseEvent, useEffect, useState } from "react";

// other

let wasm : WebAssembly.Instance;
let mandelbrot: any, allocateBuffer: any;

let bufferPointer: number;
let WIDTH : number, HEIGHT : number;

let xStart = -2;
let xEnd = 0.47;
let yStart = -1.12;
let yEnd = 1.12;

const ZOOMFACTOR = 8;

export default function Home() {    
    const [iterations, setIterations] = useState(255);

    // useEffect is to make sure it is only run client-side
    useEffect(() => {
        import("./mandelbrot/wasm_exec").then(() => {
            const go = new global.Go(); // Defined in wasm_exec.js
            const WASM_URL = '/mandelbrot/wasm.wasm';
    
            WebAssembly.instantiateStreaming(fetch(WASM_URL), go.importObject).then(function (obj) {
                wasm = obj.instance;
                go.run(wasm);
    
                ({allocateBuffer, mandelbrot} = wasm.exports);
    
                ({width: WIDTH, height: HEIGHT} = document.getElementById("mandelbrotCanvas")!.getBoundingClientRect());
    
                bufferPointer = allocateBuffer(WIDTH, HEIGHT);

                renderMandelbrot();
            })
        });
    }, [])

    

    function renderMandelbrot() {
        console.log(xStart, xEnd, yStart, yEnd)
        mandelbrot(xStart,xEnd,yStart,yEnd, iterations);

        // Get the buffer as a Uint8Array
        const bufferArray = new Uint8ClampedArray((wasm.exports.memory as WebAssembly.Memory).buffer.slice(bufferPointer, bufferPointer+WIDTH*HEIGHT*4));
        
        const ctx = (document.getElementById("mandelbrotCanvas")! as HTMLCanvasElement).getContext("2d");
        const imageData = new ImageData(bufferArray, WIDTH, HEIGHT, {colorSpace: "srgb"});
        ctx?.putImageData(imageData,0,0);
    }

    function zoomMandelbrot(e : MouseEvent) {
        // make new start-values
        // zoom in 2x at the clicked location
        let oldWidth = xEnd - xStart;
        let oldHeight = yEnd - yStart;
        let newXMiddle = (e.clientX / WIDTH) * oldWidth + xStart;
        let newYMiddle = (e.clientY / HEIGHT) * oldHeight + yStart;

        xStart = newXMiddle - (oldWidth/ZOOMFACTOR);
        xEnd = newXMiddle + (oldWidth/ZOOMFACTOR);
        yStart = newYMiddle - (oldHeight/ZOOMFACTOR); // Y:s are reversed
        yEnd = newYMiddle + (oldHeight/ZOOMFACTOR);  // see above

        renderMandelbrot();
    }


    return (
        <div>
            <canvas id="mandelbrotCanvas" width="700px" height="700px" onClick={zoomMandelbrot}></canvas>
            <button onClick={renderMandelbrot}>DISPLAY</button>
            <input type="number" value={iterations} onChange={(e) => setIterations(parseInt(e.target.value) || 0)} />
        </div>
    )
}