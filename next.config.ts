/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    distDir: "dist",
    cleanDistDir: true,
    //@ts-expect-error unknown type
    webpack: (config, { dev }) => {
        if (dev) {
            config.watchOptions = {
                ...config.watchOptions,
                ignored: ["**/dist/**", "**/export/**"],
            };
        }
        return config;
    },
    images: {
        unoptimized: true,
        domains: [], // Add specific domains for remote images, if any.
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "3000", // Specify port explicitly if using localhost.
                pathname: "**", // Allow all paths.
            },
        ],
    },
};

module.exports = nextConfig;
