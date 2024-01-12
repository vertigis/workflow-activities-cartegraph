module.exports = {
    extends: [require.resolve("@vertigis/workflow-sdk/config/.eslintrc")],
    parserOptions: {
        tsconfigRootDir: __dirname,
    },
    rules: {},
    overrides: [
        {
            files: ["src/activities/*.ts"],
            rules: {
                "@typescript-eslint/no-redundant-type-constituents": "off"
            }
        }
    ],
};
