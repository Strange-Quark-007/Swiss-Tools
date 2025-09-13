import { useEffect } from 'react';

/**
 *  Runs a callback when the component unmounts.
 * @param callback  - The function to execute on unmount
 */
export const useUnmountEffect = (callback: () => void) => {
  useEffect(() => {
    return () => {
      callback();
    };
  }, [callback]);
};
