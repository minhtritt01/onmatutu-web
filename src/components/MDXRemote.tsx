import { MDXRemote as MDXRemoteBase } from "next-mdx-remote/rsc";

function InlineMDXImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt ?? ""} className="mx-auto block w-52 rounded-xl" />
  );
}

export function MDXRemote({ source }: { source: string }) {
  return <MDXRemoteBase source={source} components={{ img: InlineMDXImage }} />;
}
