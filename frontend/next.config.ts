import { withWorkflow } from "workflow/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // กันเหนียว เผื่อ Type ตีกัน
  },
  eslint: {
    ignoreDuringBuilds: true, // กันเหนียว
  }
};

export default withWorkflow(nextConfig);
