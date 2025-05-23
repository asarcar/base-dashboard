# js_binary runs the Vite CLI
load("@aspect_rules_js//js:defs.bzl", "js_binary")
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
    name = "dev-dashboard",
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
        "tsconfig.node.json",
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