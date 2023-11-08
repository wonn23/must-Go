const calculator = {
  getDistanceByRadius: (point1, point2) => {
    const lat1 = point1[1];
    const lon1 = point1[0];
    const lat2 = point2[1];
    const lon2 = point2[0];

    const R = 6371; // 지구 반지름(km)
    const dLat = calculator.toRadians(lat2 - lat1);
    const dLon = calculator.toRadians(lon2 - lon1);

    const radLat1 = calculator.toRadians(lat1);
    const radLat2 = calculator.toRadians(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radLat1) * Math.cos(radLat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  },

  toRadians: (degrees) => {
    return degrees * (Math.PI / 180);
  },

  getMinMaxPointByRectangle: (lat, lon, range) => {
    // 위도와 경도에 범위를 더하거나 뺀 값으로 사각형의 네 꼭짓점 구하기
    const latRange = range / 111 // 대략적으로 1도는 111km
    const lonRange = range / 88 // 대략적으로 1도는 88km

    const minLat = lat - latRange
    const maxLat = lat + latRange
    const minLon = lon - lonRange
    const maxLon = lon + lonRange

    return {
      lat: { minLat, maxLat },
      lon: { minLon, maxLon }
    }    
  }
  
}

export default calculator