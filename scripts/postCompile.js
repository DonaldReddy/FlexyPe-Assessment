import fs from "fs";
import path from "path";

// Function to recursively go through files and modify imports
function updateImports(dir) {
	const files = fs.readdirSync(dir);

	files.forEach((file) => {
		const fullPath = path.join(dir, file);

		if (fs.statSync(fullPath).isDirectory()) {
			updateImports(fullPath); // Recurse into subdirectories
		} else if (file.endsWith(".js")) {
			// Read the contents of the file
			let content = fs.readFileSync(fullPath, "utf8");
			content = content.replace(/(\.\/[^'"]+)(?<!\.js)(?=['"])/g, "$1.js"); // Regex to match and replace imports

			// Write the modified content back to the file
			fs.writeFileSync(fullPath, content, "utf8");
		}
	});
}

updateImports("dist");
console.log("Imports updated successfully.");
