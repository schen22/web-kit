export default function (eleventyConfig) {
  // Only assets are copied as-is; content lives in src/ as templates.
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  return { dir: { input: "src", includes: "_includes", data: "_data", output: "_site" } };
}
