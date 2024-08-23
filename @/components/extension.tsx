import { useExtension } from "contexts/extension-context";
import { Collapsible } from "./ui/collapsible";
import { useEffect } from "react";
import { getVideoData } from "utils/functions";

export default function Extension() {
  const {
    isOpen,
    theme,
    videoId,
    setContainer,
    setIsOpen,
    setTheme,
    setLoading,
    setVideoId,
    setData,
  } = useExtension();

  useEffect(() => {
    const getCssVariables = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const backgroundColor = getCssVariables("--yt-spec-base-background");
    if (backgroundColor === "#fff") setTheme("light");
    else setTheme("dark");
  }, [])

  useEffect(() => {
    const getVideoId = () => new URLSearchParams(location.search).get("v");
    const getData = async () => {
      const currentVideoId = getVideoId();
      if (currentVideoId && currentVideoId !== videoId) {
        setVideoId(currentVideoId);
        setLoading(true);
        const currentData = await getVideoData(currentVideoId);
        setData(currentData);
        setLoading(false);
      }
    };
    getData();
    const interval = setInterval(getData, 5000);
    return () => clearInterval(interval);
  }, [videoId])

  return (
    <main ref={setContainer} className={`antialiased w-full mb-3 z-10 ${theme}`}>
      <div className="w-full">
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-3">
          <h1>ReTube</h1>
        </Collapsible>
      </div>
    </main>
  )
}
