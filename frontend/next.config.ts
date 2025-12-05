import { withWorkflow } from "workflow/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // กันเหนียว
  },
  eslint: {
    ignoreDuringBuilds: true, // กันเหนียว
  }
};

export default withWorkflow(nextConfig);