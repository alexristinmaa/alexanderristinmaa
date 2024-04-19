// nextjs
import Script from 'next/script';

export default function Home() {
    return (
        <div>
            <Script src='/mandelbrot/wasm_exec.js' strategy='beforeInteractive'></Script>
            <Script strategy='beforeInteractive'>
                {`
                const go = new Go();
                WebAssembly.instantiateStreaming(fetch("/mandelbrot/wasm.wasm"), go.importObject).then((result) => {
                    go.run(result.instance);
                });
                `}
            </Script>
        </div>
    )
}