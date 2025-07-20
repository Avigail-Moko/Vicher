const mongoose = require("mongoose");
const MonthlyRoomUsage = require("../models/monthlyRoomUsage");

module.exports = {
 createRoom: async (req, res) => {
  const { roomName, endDate } = req.body;

  if (!roomName || !endDate) {
    return res.status(400).json({ error: "Missing roomName or endDate" });
  }

  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    let exp = Math.floor(new Date(endDate).getTime() / 1000);
    let durationSeconds = exp - Math.floor(Date.now() / 1000);

    // שליפת רשומת החודש או יצירה אם אין
    let usage = await MonthlyRoomUsage.findOne({ year, month });
    if (!usage) {
      usage = await MonthlyRoomUsage.create({ year, month, totalSeconds: 0 });
    }

    const maxMonthlySeconds = 500 * 60 * 60; // 500 שיעורים

    if (usage.totalSeconds + durationSeconds > maxMonthlySeconds) {
      return res.status(403).json({ error: "Monthly room time limit (500 hours) exceeded." });
    }

    // בדיקה אם החדר כבר קיים
    const checkResponse = await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${process.env.DAILY_API_KEY}` }
    });

    if (checkResponse.ok) {
      const existingRoom = await checkResponse.json();
      return res.status(200).json({ roomUrl: existingRoom.url, exp: existingRoom.config.exp });
    }

    // יצירת החדר ב-Daily
    
    // מחשבים מחדש כדי לקבל תוצאה מדויקת לרגע זה (ייתכן שחלפו שניות מאז הבדיקה הקודמת)
    exp = Math.floor(new Date(endDate).getTime() / 1000);
    durationSeconds = exp - Math.floor(Date.now() / 1000);

    const response = await fetch('https://api.daily.co/v1/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DAILY_API_KEY}`
      },
      body: JSON.stringify({
        name: roomName,
        properties: {
          exp,
          enable_chat: true,
          eject_at_room_exp: true,
          enable_knocking: false,
          owner_only_broadcast: false,
          max_participants: 2
        }
      })
    });

    const data = await response.json();
    if (data.error) {
      return res.status(400).json({ error: data.error });
    }

    // עדכון שימוש החודשי
    usage.totalSeconds += durationSeconds;
    await usage.save();

    return res.status(200).json({ roomUrl: data.url, exp });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
};
