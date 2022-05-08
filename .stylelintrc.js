/**
 * @description stylelint
 */
module.exports = {
  extends: [
    "stylelint-config-recess-order",
    "stylelint-config-prettier",
    "stylelint-config-recommended-vue",
  ],
  overrides: [
    {
      files: ["*.html", "**/*.html"],
      customSyntax: "postcss-html",
      extends: ["stylelint-config-prettier"],
      rules: {
        "at-rule-no-unknown": null
        // ..
      }
    }
  ]
};
