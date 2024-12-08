'use client';

import { MouseEvent, useEffect, useState } from "react";

// other

let wasm : WebAssembly.Instance;
let mandelbrot: any, allocateBuffer: any;

let bufferPointer: number;
let WIDTH : number, HEIGHT : number;

const initialBBox = [-2, -1.12, 0.47, 1.12];

let [xStart, yStart, xEnd, yEnd] = initialBBox;

const ZOOMFACTOR = 8;

function scaleMandelbrot(canvasWidth: number, canvasHeight: number, initialBBox: number[]): number[] {
    let ratio = canvasWidth / canvasHeight;

    if(ratio > 1) {
        let diff2 = (initialBBox[2] - initialBBox[0]) * (ratio - 1) / 2;
        return [initialBBox[0] - diff2, initialBBox[1], initialBBox[2] + diff2, initialBBox[3]];
    }
    ratio = 1 / ratio;
    let diff2 = (initialBBox[3] - initialBBox[1]) * (ratio - 1) / 2;

    return [initialBBox[0], initialBBox[1] - diff2, initialBBox[2], initialBBox[3] + diff2];
    
}

export default function Home() {    
    const [iterations, setIterations] = useState(255);

    // useEffect is to make sure it is only run client-side
    useEffect(() => {
        const ctx = (document.getElementById("mandelbrotCanvas") as HTMLCanvasElement).getContext("2d");

        ctx!.canvas.width = Math.floor(ctx!.canvas.clientWidth);
        ctx!.canvas.height = Math.floor(ctx!.canvas.clientHeight);

        (async () => {
            await import("./mandelbrot/wasm_exec")

            const go = new global.Go(); // Defined in wasm_exec.js
            const WASM_URL = '/mandelbrot/wasm.wasm';
    
            wasm = (await WebAssembly.instantiateStreaming(fetch(WASM_URL), go.importObject)).instance;
            go.run(wasm);

            ({allocateBuffer, mandelbrot} = wasm.exports);

            [WIDTH, HEIGHT] = [ctx!.canvas.width, ctx!.canvas.height];
            [xStart, yStart, xEnd, yEnd] = scaleMandelbrot(WIDTH, HEIGHT, initialBBox);
            
            bufferPointer = allocateBuffer(WIDTH, HEIGHT);

            renderMandelbrot();
        })()
    }, [])

    function renderMandelbrot() {
        console.log(xStart, yStart, xEnd, yEnd);
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

    function resetMandelbrot() {
        [xStart, yStart, xEnd, yEnd] = scaleMandelbrot(WIDTH, HEIGHT, initialBBox);

        renderMandelbrot();
    }


    return (
        <div>
            <canvas id="mandelbrotCanvas" style={{width: "100vw", height: "90vh"}} onClick={zoomMandelbrot}></canvas>
            <p>Click to zoom</p>
            <span>Amount of iterations (better resolution, less performant): </span>
            <input type="number" value={iterations} onChange={(e) => setIterations(parseInt(e.target.value) || 0)} />
            <br />
            <button onClick={renderMandelbrot}>DISPLAY</button>
            <button onClick={resetMandelbrot}>RESET</button>
        </div>
    )
}