export const formatDuration = (seconds) => {
    // Round the seconds to nearest whole number
    const roundedSeconds = Math.round(seconds);
    
    // If less than 60 seconds, return just seconds
    if (roundedSeconds < 60) {
      return `${roundedSeconds}s`;
    }
    
    // Calculate minutes and remaining seconds
    const minutes = Math.floor(roundedSeconds / 60);
    const remainingSeconds = roundedSeconds % 60;
    
    // If there are remaining seconds, include them
    if (remainingSeconds > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    // If no remaining seconds, return just minutes
    return `${minutes}m`;
  };