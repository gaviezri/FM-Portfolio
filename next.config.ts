/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    distDir: "dist",
    cleanDistDir: true,
    basePath: process.env.NODE_ENV === "production" ? "/FM-Portfolio" : "", // Replace 'FM-Portfolio' with your repo name
    assetPrefix: process.env.NODE_ENV === "production" ? "/FM-Portfolio/" : "",
    images: {
        unoptimized: true,
    },
    //@ts-expect-error unknown
    webpack: (config, { dev }) => {
        if (dev) {
            config.watchOptions = {
                ...config.watchOptions,
                ignored: ["**/dist/**", "**/export/**"],
            };
        }
        return config;
    },
};

module.exports = nextConfig;
