import fs from "fs";


fixCjsExport();
createPackageJsonFiles();


function fixCjsExport() {
	let cjsContent = fs.readFileSync("./dist/cjs/index.js", "utf8");

	// Make sure the CommonJS build can be imported without using .default
	cjsContent = cjsContent.replace("exports.default = ", "module.exports = ");
	cjsContent = cjsContent.replace('Object.defineProperty(exports, "__esModule", { value: true });', "");

	fs.writeFileSync("./dist/cjs/index.js", cjsContent);
}

function createPackageJsonFiles() {
	// Create package.json for CommonJS
	const cjsPackageJson = {
		type: "commonjs"
	};
	fs.writeFileSync("./dist/cjs/package.json", JSON.stringify(cjsPackageJson, null, 2));

	// Create package.json for ES modules
	const mjsPackageJson = {
		type: "module"
	};
	fs.writeFileSync("./dist/esm/package.json", JSON.stringify(mjsPackageJson, null, 2));
}