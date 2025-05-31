# services/frontend/dashboard/BUILD
# js_binary runs the Vite CLI
load("@aspect_rules_js//js:defs.bzl", "js_binary", "js_test")
# npm_link_all_packages creates a Bazel - managed node_modules
# folder in your bin tree.
# This rule is exposed from the * generated * npm repository
load("@npm_dashboard//:defs.bzl", "npm_link_all_packages")

# You only need npm_link_all_packages if other tools outside of Bazel's direct
# execution need a physical node_modules directory
npm_link_all_packages(name = "node_modules")

# With Bazel and aspect_rules_js(or rules_js),
# Node dependencies are NOT installed in project’s node_modules
# Bazel creates an external repository(like @npm) containing
# all npm packages where we must reference files
js_binary(
    name = "dashboard",
    # Use a wrapper script as the entry_point to execute the vite binary
    # Path to your new wrapper script - services / frontend / hello - app / vite_wrapper.js
    entry_point = "vite_wrapper.js",
    # The 'data' attribute is crucial for your application's source files
    # that Vite needs to serve, the wrapper script, AND node_modules.
    data = [
        ":node_modules",
        "components.json",
        "index.html",
        "package.json",
        "postcss.config.js",
        "tailwind.config.js",
        "tsconfig.json",
        "tsconfig.build.json",
        "vercel.json",
        "vite.config.ts",
        "vite_wrapper.js",
    ] + glob([
        "src/**",
        "public/**",
    ]),
    args = ["--host", "0.0.0.0", "--port", "3000"],
    chdir = package_name(),  # Crucial for Vite's file resolution
)

js_test(
    name = "dashboard_tests",
    entry_point = "jest_wrapper.mjs",
    args = ["--config=jest.config.cjs"],
    data = [
        ":node_modules",
        "jest.config.cjs",
        "babel.config.cjs",
        "tsconfig.json",
        "tsconfig.build.json",
        "package.json",
        "jest.setup.mjs",
        "jest_wrapper.mjs",
        # Include all your source files
    ] + glob([
        "src/**",
        "__tests__/**",
        "__mocks__/**"
    ], allow_empty = True),
    # Add the timeout attribute here
    timeout = "short",
)

