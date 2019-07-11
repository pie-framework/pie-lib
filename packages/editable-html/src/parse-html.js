export const parseDegrees = html =>
  html
    // removes \(   use case: 50°
    .replace(/\\[(]/g, '')
    // removes \)   use case: 50°+m<1
    .replace(/\\[)]/g, '')
    // removes \degree  use case: 50°
    .replace(/\\degree/g, '&deg;');
