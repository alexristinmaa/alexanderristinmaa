// styles
import './markdown.css';

// other
import * as fs from 'fs';
import {marked} from 'marked';
import parseMD from 'parse-md';

export function generateStaticParams() {
    const experiments = 
      fs.readdirSync('./app/experiments', {withFileTypes: true})
      .filter(pathname => pathname.isDirectory() && fs.existsSync(`./app/experiments/${pathname.name}/page.md`))
      .map(foldername => ({experiment: foldername.name}));
   
    // Should return a list of objects with the parameter experiment (because the dynamic path is [experiment])
    // with the value of the path [experiment]/info where experiment is the different paths
    // ex return [{experiment: 'donut/info'}]

    console.log(experiments)

    return experiments;
  }

// Multiple versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
export default async function Page({ params } : { params: Promise<{experiment: string}> }) {
    const { experiment } = await params;
    const markdownString = fs.readFileSync(`./app/experiments/${experiment}/page.md`, 'utf8');

    // Funny way to add home button but it works :)
    const htmlFromMarkdown = "<a href='/'>Homepage</a>" + await marked.parse(parseMD(markdownString).content);

    return <div style={{minHeight: '100vh'}} dangerouslySetInnerHTML={{__html: htmlFromMarkdown}}></div>
  }