'use client'

// nextjs
import { useState, useEffect } from 'react';

// style
import styles from './page.module.css';

// misc
import fcontent from './catimation';
import Link from 'next/link';

export default function Home() {
  const [catimationState, setCatimation] = useState(fcontent[0]);

  let animator = (frame : number) => {
    setCatimation(fcontent[frame]);
    setTimeout(animator, 100, frame < fcontent.length-1 ? frame + 1 : 0);
  }

  useEffect(() => {
    animator(0);
  }, []);

  return (
    <div>
      <p>Detta skulle ju vara hemligt vad fan?</p>
      <br /><br /><br /><br /><br />
      <p style={{whiteSpace: 'pre-wrap'}}>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.,,uod8B8bou,,.<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;..,uod8BBBBBBBBBBBBBBBBRPFT?l!i:.<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,=m8BBBBBBBBBBBBBBBRPFT?!||||||||||||||<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;!...:!TVBBBRPFT||||||||||!!^^""'   ||||<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;!.......:!?|||||!!^^""'            ||||<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;!.........||||                     ||||<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;!.........||||  ##                 ||||<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;!.........||||                     ||||<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;!.........||||                     ||||<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;!.........||||                     ||||<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;!.........||||                     ||||<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`.........||||                    ,||||<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.;.......||||               _.-!!|||||<br/>
&nbsp;&nbsp;&nbsp;.,uodWBBBBb.....||||       _.-!!|||||||||!:'<br/>
!YBBBBBBBBBBBBBBb..!|||:..-!!|||||||!iof68BBBBBb....<br/>
!..YBBBBBBBBBBBBBBb!!||||||||!iof68BBBBBBRPFT?!::   `.<br/>
!....YBBBBBBBBBBBBBBbaaitf68BBBBBBRPFT?!:::::::::     `.<br/>
!......YBBBBBBBBBBBBBBBBBBBRPFT?!::::::;:!^"`;:::       `.<br/>
!........YBBBBBBBBBBRPFT?!::::::::::^''...::::::;         iBBbo.<br/>
`..........YBRPFT?!::::::::::::::::::::::::;iof68bo.      WBBBBbo.<br/>
&nbsp;&nbsp;`..........:::::::::::::::::::::::;iof688888888888b.     `YBBBP^'<br/>
&nbsp;&nbsp;&nbsp;&nbsp;`........::::::::::::::::;iof688888888888888888888b.     `<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`......:::::::::;iof688888888888888888888888888888b.<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`....:::;iof688888888888888888888888888888888899fT!<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`..::!8888888888888888888888888888888899fT|!^"'<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`' !!988888888888888888888888899fT|!^"'<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`!!8888888888888888899fT|!^"'<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`!988888888899fT|!^"'<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`!9899fT|!^"'<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`!^"'
      </p>
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <p>Okej, det var allt <Link href="/"><u>gå tillbaka nu</u></Link></p>
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <p>Varför snokar du?</p>
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      Okej, bajs
      <pre id={styles.catimator} dangerouslySetInnerHTML={{__html: catimationState }}></pre>
      <br /><br /><br /><br /><br />
      <p>Detta är Linneas del av hemsidan: </p><br />
      <p>jag älskar alexander ristinmaa</p>
    </div>
  );
}
