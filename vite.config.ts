import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		forceRerunTriggers: [...configDefaults.forceRerunTriggers, "test/**"],
	},
});
