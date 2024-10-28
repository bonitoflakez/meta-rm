const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { promisify } = require("util");
const readdir = promisify(fs.readdir);

const SUPPORTED_FORMATS = [".jpg", ".jpeg", ".png", ".webp", ".tiff", ".gif"];
const INPUT_DIR = "./images";
const OUTPUT_DIR = "./outputs";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function removeMetadata() {
  try {
    if (!fs.existsSync(INPUT_DIR)) {
      console.error(`Error: Input directory "${INPUT_DIR}" does not exist`);
      return;
    }

    const files = await readdir(INPUT_DIR);

    const imageFiles = files.filter((file) =>
      SUPPORTED_FORMATS.includes(path.extname(file).toLowerCase())
    );

    if (imageFiles.length === 0) {
      console.log(`No supported image files found in ${INPUT_DIR}`);
      return;
    }

    console.log(`Found ${imageFiles.length} image files. Processing...`);

    for (const file of imageFiles) {
      try {
        const inputPath = path.join(INPUT_DIR, file);
        const outputPath = path.join(OUTPUT_DIR, file);

        await sharp(inputPath).withMetadata(false).toFile(outputPath);

        console.log(`✓ Processed: ${file}`);
      } catch (err) {
        console.error(`✗ Error processing ${file}:`, err.message);
      }
    }

    console.log(`\nCompleted! Processed files are saved in "${OUTPUT_DIR}"`);
  } catch (err) {
    console.error("Error reading directory:", err.message);
  }
}

removeMetadata();
