/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
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
