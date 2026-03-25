import { useState, useEffect } from "react";

interface UseVideoFallbackResult {
  shouldUseVideo: boolean;
  isSlowConnection: boolean;
}

export function useVideoFallback(): UseVideoFallbackResult {
  const [shouldUseVideo, setShouldUseVideo] = useState(false);
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & {
      connection?: {
        effectiveType?: string;
        saveData?: boolean;
      };
    };

    const connection = nav.connection;

    if (connection) {
      const slowTypes = ["slow-2g", "2g"];
      const isSlow =
        slowTypes.includes(connection.effectiveType || "") ||
        connection.saveData === true;
      setIsSlowConnection(isSlow);
      setShouldUseVideo(!isSlow);
    } else {
      setShouldUseVideo(true);
    }
  }, []);

  return { shouldUseVideo, isSlowConnection };
}
