//go:build js && wasm

package main

import (
	"fmt"
)

var pixels []byte
var WIDTH, HEIGHT int

func main() {}

//go:export allocateBuffer
func allocateBuffer(w, h int) *byte {
	if w <= 0 || h <= 0 {
		fmt.Println("Cannot initialize 0-height or 0-width buffer, h > 0, w > 0")
		return nil
	}
	WIDTH = w
	HEIGHT = h

	pixels = make([]byte, WIDTH*HEIGHT*4)

	return &pixels[0]
}

//export mandelbrot
func mandelbrot(xStart, xEnd, yStart, yEnd float64, iterations int) {
	if len(pixels) == 0 {
		fmt.Println("Cannot create mandelbrot without initializing pixels (allocateBuffer)")
		return
	}

	deltaX := complex((xEnd-xStart)/float64(WIDTH), 0)
	deltaY := complex(0, (yEnd-yStart)/float64(HEIGHT))

	coord := complex(xStart, yStart)

	scaleIterations := 255.0 / float64(iterations)

	fmt.Println(HEIGHT, WIDTH)

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
