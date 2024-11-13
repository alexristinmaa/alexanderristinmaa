---
name: Mandelbrot in WASM!
description: The beautiful mandelbrot fractal computed and rendered with compiled WebAssembly!
tags: 
    - WebAssembly
    - Go
---
# Mandelbrot with Webassembly

This is my first experience using webassembly! It turned out to be very interesting. 

![mandelbrot](/mandelbrot/mandelbrot.png "Mandelbrot")

## Go "backend"
The idea was to create a go-mandelbrot kind of backend. This function is a standard mandelbrot
computation function ([wikipedia: mandelbrot](https://en.wikipedia.org/wiki/Mandelbrot_set#Computer_drawings)). It looks something like this:

```go
func mandelbrot(xStart, xEnd, yStart, yEnd float64, iterations int) {
	deltaX := complex((xEnd-xStart)/float64(WIDTH), 0)
	deltaY := complex(0, (yEnd-yStart)/float64(HEIGHT))

	coord := complex(xStart, yStart)

	scaleIterations := 255.0 / float64(iterations)

	for y := 0; y < HEIGHT; y++ {
		coord = complex(xStart, imag(coord))

		for x := 0; x < WIDTH*4; x += 4 {
			clr := testPoint(coord, iterations, scaleIterations)
			index := y*WIDTH*4 + x

			pixels[index] = clr
			pixels[index+1] = clr
			pixels[index+2] = clr
			pixels[index+3] = 255

			coord += deltaX
		}

		coord += deltaY
	}
}

func testPoint(c complex128, iterations int, scale float64) byte {
	z := c
	var zold complex128
	i := 0
	period := 0

	for ; i < iterations; i++ {
		if real(z)*real(z)+imag(z)*imag(z) > 4 {
			break
		}

		z = z*z + c

		if z == zold {
			return byte(float64(iterations) * scale)
		}

		period++
		if period == 20 {
			zold = z
			period = 0
		}
	}

	return byte(float64(i) * scale)
}
```

The keen eye will have noticed the use of the `pixels` varaible which is not seen anywhere in the code. This is because the `pixels` variable is actually a buffer which is accessible from the javascript iterface. It is initalized by calling this function:

```go
func allocateBuffer(w, h int) *byte {
    WIDTH  = w
    HEIGHT = h
	pixels = make([]byte, w*h*4)

	return &pixels[0]
}
```

The `mandelbrot` and `allocateBuffer` functions are exposed to the javascript client.

## Compiling and connecting
The code can then be compiled like this: (more info at [Go Wiki Webassembly](https://go.dev/wiki/WebAssembly))

```bash
GOOS=js GOARCH=wasm go build -o main.wasm
```

Using the `wasm_exec.js` file provided by golang (see wiki link) the exposed go functions are loaded and called in the javascript like this:

```typescript
await import("./mandelbrot/wasm_exec") // Node.js import

const go = new global.Go(); // Defined in wasm_exec.js
const WASM_URL = '/mandelbrot/wasm.wasm';

wasm = (await WebAssembly.instantiateStreaming(fetch(WASM_URL), go.importObject)).instance;
go.run(wasm);

({allocateBuffer, mandelbrot} = wasm.exports);
({width: WIDTH, height: HEIGHT} = document.getElementById("mandelbrotCanvas")!.getBoundingClientRect());
bufferPointer = allocateBuffer(WIDTH, HEIGHT);

renderMandelbrot();
```

where this is the `renderMandelbrot` function which calls the `mandelbrot` function to populate a buffer with new pixel-values and then renders them on the canvas.

```typescript
function renderMandelbrot() {
    mandelbrot(xStart,xEnd,yStart,yEnd, iterations); // go function

    // Get the buffer (pixels in the go function) as a Uint8Array
    const bufferArray =
        new Uint8ClampedArray(
            (wasm.exports.memory as WebAssembly.Memory)
            .buffer
            .slice(bufferPointer, bufferPointer+WIDTH*HEIGHT*4)
        );
    
    const ctx = (document.getElementById("mandelbrotCanvas")! as HTMLCanvasElement).getContext("2d");
    const imageData = new ImageData(bufferArray, WIDTH, HEIGHT, {colorSpace: "srgb"});

    ctx?.putImageData(imageData,0,0);
}
```