/** GitHub Pages 정적 배포용 설정 */
const nextConfig = {
  output: 'export',
  trailingSlash: false,
  images: { unoptimized: true },
  outputFileTracingRoot: import.meta.dirname,
};
export default nextConfig;
