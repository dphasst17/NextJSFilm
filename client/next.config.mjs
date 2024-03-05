/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/:path*',
                destination: '/pages/:path*', // Proxy to /page
            },
        ]
    },
};

export default nextConfig;
