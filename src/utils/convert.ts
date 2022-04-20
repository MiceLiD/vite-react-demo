export function mercator2gcj(lat: number, lng: number): [number, number] {
  const PI = 3.141592653589
  const EARTH_RADIUS = 6378137
  const METERS_PER_DEGREE = (EARTH_RADIUS * PI / 180.0)
  const CONV_RATIO = 100000.0
  const MIN_POINT_DIST = 10

  lng = lng / METERS_PER_DEGREE;
  lat = 180.0 / PI * (2 * Math.atan(Math.exp(lat / EARTH_RADIUS)) - PI / 2.0);
  return [lng, lat]
}