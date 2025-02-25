const mongoose = require("mongoose");

module.exports = {
  createRoom: async  (req, res) => {
    const { roomName, length } = req.body;
  
    if (!roomName || !length) {
      return res.status(400).json({ error: "Missing roomName or length in request body" });
    }
  
    // חישוב זמן תפוגה = length + 30 דקות
    const exp = Math.floor(Date.now() / 1000) + (length * 60) + 1800;
  
    try {
      // בדיקה אם החדר כבר קיים
      const checkResponse = await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.DAILY_API_KEY}`
        }
      });

      if (checkResponse.ok) {
        const existingRoom = await checkResponse.json();
        console.log('Room already exists:', existingRoom.url);
        return res.status(200).json({ roomUrl: existingRoom.url });
      }
      //  אם החדר לא קיים, יוצרים אותו
      const response = await fetch('https://api.daily.co/v1/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DAILY_API_KEY}`
        },
        body: JSON.stringify({
          name: roomName,
          properties: {
            exp: exp,
            enable_chat: true,
            enable_knocking: false,
            owner_only_broadcast: false
          }
        })
      });
  
      const data = await response.json();
      if (data.error) {
        console.error('Error creating room:', data.error);
        return res.status(400).json({ error: data.error });
      }
  
      console.log('Room created successfully:', data.url);
      return res.status(200).json({ roomUrl: data.url });
    } catch (error) {
      console.error('Server error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
}
};
