import { useEffect } from "react";

export function useDebouncedEffect(
  effect: () => void,
  deps: readonly unknown[],
  delay: number
) {
  useEffect(() => {
    const handler = setTimeout(effect, delay);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effect, ...deps, delay]); // effect, deps, and delay as dependencies
}
