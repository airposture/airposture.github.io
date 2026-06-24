import { useState, useEffect } from "react";
import { APP_STORE_LINK } from "../utils/links";
import styles from "../styles/Home.module.css";

const TESTFLIGHT_LINK = "https://testflight.apple.com/join/ATvtBUZH";
const GITHUB_LINK = "https://github.com/allenv0/AirPosture";
const GITHUB_API = "https://api.github.com/repos/allenv0/AirPosture";
const STARS_CACHE_KEY = "airposture-stars";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

interface DownloadButtonProps {
  onClick?: () => void;
  href?: string;
  showSubtitle?: boolean;
}

interface StarsCache {
  count: number;
  timestamp: number;
}

function getCachedStars(): number | null {
  try {
    const cached = localStorage.getItem(STARS_CACHE_KEY);
    if (cached) {
      const data: StarsCache = JSON.parse(cached);
      if (Date.now() - data.timestamp < CACHE_DURATION) {
        return data.count;
      }
    }
  } catch {}
  return null;
}

function setCachedStars(count: number) {
  try {
    localStorage.setItem(
      STARS_CACHE_KEY,
      JSON.stringify({ count, timestamp: Date.now() }),
    );
  } catch {}
}

function formatStars(count: number): string {
  if (count >= 1000) {
    return (
      (count / 1000).toFixed(count >= 10000 ? 0 : 1).replace(/\.0$/, "") + "k"
    );
  }
  return count.toString();
}

const githubIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

function DownloadButton({ onClick, href, showSubtitle }: DownloadButtonProps) {
  const [stars, setStars] = useState<number | null>(getCachedStars);
  const link = href || TESTFLIGHT_LINK;

  useEffect(() => {
    const cached = getCachedStars();
    if (cached !== null) {
      setStars(cached);
      return;
    }

    let cancelled = false;

    fetch(GITHUB_API)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (!cancelled && data.stargazers_count != null) {
          setCachedStars(data.stargazers_count);
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {
        // Silently fail — stars remain null and the badge won't show
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
      }}
    >
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.downloadIcon}
      >
         Download iOS Beta
      </a>
      <a
        href={GITHUB_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.githubLink}
      >
        {githubIcon}
        <span>Open Source</span>
        {stars !== null && (
          <span className={styles.starBadge}>
            <span className={styles.starIcon}>★</span>
            {formatStars(stars)}
          </span>
        )}
      </a>
    </div>
  );
}

export default DownloadButton;
