"use client";

import { useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useVoiceAgent } from "./VoiceAgentProvider";

/**
 * Invisible client component that registers Next.js router navigation
 * with the voice agent provider so the agent can navigate between pages.
 * Mount once inside VoiceAgentProvider (e.g. in root layout).
 */
export default function VoiceNavigatorBridge() {
  const router = useRouter();
  const pathname = usePathname();
  const { registerNavigator, unregisterNavigator } = useVoiceAgent();

  const navigate = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router],
  );

  const getCurrentPath = useCallback(() => pathname, [pathname]);

  useEffect(() => {
    registerNavigator({ navigate, getCurrentPath });
    return () => unregisterNavigator();
  }, [navigate, getCurrentPath, registerNavigator, unregisterNavigator]);

  return null;
}
