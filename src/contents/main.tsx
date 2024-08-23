import Extension from "@/components/extension"
import styleText from "data-text:~style.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor, PlasmoGetShadowHostId, PlasmoGetStyle } from "plasmo"

const INJECTED_ELEMENT_ID = "#secondary.style-scope.ytd-watch-flexy"

export const getStyle = () => {
  const baseFontSize = 12
  let updatedCssText = styleText.replaceAll(":root", ":host(plasmo-csui)")
  const remRegex = /([\d.]+)rem/g
  updatedCssText = updatedCssText.replace(remRegex, (_, remValue) => `${parseFloat(remValue) * baseFontSize}px`)
  const style = document.createElement("style")
  style.textContent = updatedCssText
  return style
}

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => ({
      element: document.querySelector(INJECTED_ELEMENT_ID),
      insertPosition: "afterbegin",
})
 
export const getShadowHostId: PlasmoGetShadowHostId = () => "plasmo-inline"

export default function Main() {
  return <Extension />
}
