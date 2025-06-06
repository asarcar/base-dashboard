# services/frontend/dashboard/BUILD
# js_binary runs the Vite CLI
load("@aspect_rules_js//js:defs.bzl", "js_run_binary", "js_binary", "js_test")
# npm_link_all_packages creates a Bazel - managed node_modules
# folder in your bin tree.
# This rule is exposed from the * generated * npm repository
load("@npm_dashboard//:defs.bzl", "npm_link_all_packages")
load("@rules_pkg//pkg:tar.bzl", "pkg_tar")
load("@rules_oci//oci:defs.bzl", "oci_image", "oci_push", "oci_load")

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
    args = ["--host", "0.0.0.0", "--port", "3080"],
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

# Run 'vite build' to produce a dist/ directory as part of Bazel build graph
js_run_binary(
    name = "build",
    tool = ":dashboard",
    args = ["build"],
    out_dirs = ["dist"],
    srcs = [
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
        "nginx.conf",
    ] + glob([
        "src/**",
        "public/**",
    ]),
)

# Package dist/ into a tarball
pkg_tar(
    name = "dist_tar",
    srcs = [":build"],
    package_dir = "/usr/share/nginx/html",
    strip_prefix = "dist",
)

# Package nginx.conf to the correct location in the container
pkg_tar(
    name = "nginx_conf_tar",
    srcs = ["default.conf"],
    package_dir = "/etc/nginx/conf.d",
)

# OCI image for production
oci_image(
    name = "dashboard_image",
    base = "@nginx_base//:nginx_base",  # Use a base image with Nginx
    tars = [":dist_tar", ":nginx_conf_tar"],
    labels = {
        "org.opencontainers.image.title": "Dashboard",
        "org.opencontainers.image.source": "https://github.com/asarcar/ITSecOps",
        "org.opencontainers.image.exposed_ports": "3080/tcp",
    },
)

# Push image to GHCR, depends on tests
# oci_push does not support deps attribute,
# so we ensure tests are run before pushing by calling
# >_ bazel test //services/frontend/dashboard:dashboard_tests && \
#    bazel run //services/frontend/dashboard:push_dashboard
oci_push(
    name = "push_dashboard",
    image = ":dashboard_image",
    repository = "ghcr.io/asarcar/itsecops/dashboard",
    remote_tags = ["latest"],
)

# Produces docker loadable tarball
# Validate the image by loading it into the local Docker daemon
# bazel run //services/frontend/dashboard:dashboard_image_tar
# docker run -d -p 3080:3080 ghcr.io/asarcar/itsecops/dashboard:latest
# docker run -it --rm -p 3080:3080 ghcr.io/asarcar/itsecops/dashboard:latest
# //services/frontend/dashboard:dashboard_image_tar
# docker load -i bazel-bin/services/frontend/dashboard/dashboard_image_tar.tar
# docker images | grep dashboard_image
# docker run -it --rm -p 3080:3080 dashboard_image:latest
oci_load(
    name = "dashboard_image_tar",
    image = ":dashboard_image",
    repo_tags = ["ghcr.io/asarcar/itsecops/dashboard:latest"],
)