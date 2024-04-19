//go:build js && wasm

package main

import (
	"math/cmplx"
	"syscall/js"
)

func main() {
	js.Global().Set("greet", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) == 0 {
			return "Hello, World!"
		}

		return []interface{}{1, 2}
	}))

	select {}
}

//export mandelbrot
func mandelbrot(pixels [][]*int, xStart, xEnd, yStart, yEnd float64, resX, resY, iterations int) {
	deltaX := complex((xEnd-xStart)/float64(resX), 0)
	deltaY := complex(0, (yEnd-yStart)/float64(resY))

	coord := complex(xStart, yStart)

	for x := 0; x < resX; x++ {
		coord = complex(0, imag(coord))
		for y := 0; y < resY; y++ {
			*pixels[x][y] = testPoint(coord, iterations)
			coord += deltaY
		}

		coord += deltaX
	}
}

func testPoint(c complex128, iterations int) int {
	z := complex(0, 0)
	i := 0

	for ; i < iterations; i++ {
		z = z*z + c

		if cmplx.Abs(z) > 2 {
			break
		}
	}

	return i
}
