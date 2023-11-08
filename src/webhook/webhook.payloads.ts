const payloads = {
  LUNCH_REC: (data) => {
    return {
      "username": "Must-Go",
      "avatar_url": "https://i.imgur.com/35aRfZe.png",
      "content": "♫♫~신나는 점심시간입니다~♫♫",
      "embeds": [
        {
          "author": {
            "name": "Your Lunch Menu♫",
            "icon_url": "https://i.imgur.com/7BUDp3E.png"
          },
          "title": "오늘 뭐드실래요?",
          "description": "주변 500m 이내의 식당을 추천해드립니다.",
          "color": 15258703,
          "fields": data,
          "footer": {
            "text": "한국인은 밥심",
            "icon_url": "https://i.imgur.com/r20O6jJ.jpg"
          }
        }
      ]
    }
  }
}

export default payloads
