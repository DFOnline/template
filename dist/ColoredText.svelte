<script>export let text;
export let defaultStyle = {};
const MATCH_REGEX = /§(([0-9a-kfmnolr])|x(§[0-9a-f]){6})|[^§]+/g;
const ColorMap = new Map(Object.entries({
  "0": "#000000",
  // Black
  "1": "#0000AA",
  // Dark Blue
  "2": "#00AA00",
  // Dark Green
  "3": "#00AAAA",
  // Dark Aqua
  "4": "#AA0000",
  // Dark Red
  "5": "#AA00AA",
  // Dark Purple
  "6": "#FFAA00",
  // Gold
  "7": "#AAAAAA",
  // Gray
  "8": "#555555",
  // Dark Gray
  "9": "#5555FF",
  // Blue
  "a": "#55FF55",
  // Green
  "b": "#55FFFF",
  // Aqua
  "c": "#FF5555",
  // Red
  "d": "#FF55FF",
  // Light Purple
  "e": "#FFFF55",
  // Yellow
  "f": "#FFFFFF"
  // White
}));
const STYLES_MAP = new Map(Object.entries({
  "l": "bold",
  "o": "italic",
  "n": "underlined",
  "m": "strikethrough",
  "k": "obfuscated"
}));
function parse(text2) {
  const out = [];
  let component = { text: "", ...defaultStyle };
  text2.match(MATCH_REGEX)?.forEach((part) => {
    if (part.startsWith("\xA7")) {
      const color = part.replaceAll("\xA7", "");
      if (color == "r")
        component = { text: "", ...defaultStyle };
      else if (ColorMap.has(color))
        component = { text: "", color: ColorMap.get(color) };
      else if (STYLES_MAP.has(color))
        component[STYLES_MAP.get(color) ?? "italic"] = true;
      else if (color.startsWith("x"))
        component = { text: "", color: color.replace("x", "#") };
    } else {
      component.text = part;
      out.push(component);
    }
  });
  return out;
}
function orEmpty(names, ...active) {
  return names.filter((_, i) => active[i]).join(" ");
}
</script>

<span>
    {#each parse(text) as part}
        <span class={orEmpty`bold${part.bold}italic${part.italic}underlined${part.underlined}strikethrough${part.strikethrough}obfuscated${part.obfuscated}`} style={`${part.color != null ? `color: ${part.color};` : ''}`}>{part.text}</span>
    {/each}
</span>

<style>
    .bold {
        font-weight: bolder;
    }

    .italic {
        font-style: italic;
    }

    .underline {
        text-decoration: underline;
    }

    .strikethrough {
        text-decoration: line-through;
    }

    .underlined.strikethrough {
        text-decoration: underline line-through;
    }
</style>