import fs from "fs";
import path from "path";

const input = path.resolve("../frontend/src/assets/assets.js");
const output = path.resolve("./seed/productsSeed.js");

let content = fs.readFileSync(input, "utf8");

// Remove import statements
content = content.replace(/^import .*$/gm, "");

// Keep only products array
const start = content.indexOf("export const products =");
content = content.substring(start);
content = content.replace("export const products =", "const products =");

// Convert image variables to filenames
content = content.replace(/image:\s*\[([^\]]+)\]/g, (_, imgs) => {
  const arr = imgs
    .split(",")
    .map(x => `"${x.trim()}.png"`)
    .join(", ");
  return `images: [${arr}]`;
});

// Remove _id because MongoDB will create it
content = content.replace(/_id:\s*"[^"]+",?\n/g, "");

content += `

export default products;
`;

fs.mkdirSync("./seed", { recursive: true });
fs.writeFileSync(output, content);

console.log("✅ productsSeed.js generated successfully");