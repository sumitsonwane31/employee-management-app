const axios = require("axios");

(async () => {
  try {
    const res = await axios.post("http://localhost:5000/api/employees", {
      name: "sumit sonwane",
      position: "cloud engineer",
      salary: 50000,
    });
    console.log("✅ Data saved:", res.data);
  } catch (err) {
    console.error("❌ Full Error Object:", err);
    if (err.response) {
      console.error("🔴 Response Error Data:", err.response.data);
      console.error("🔴 Status Code:", err.response.status);
    } else if (err.request) {
      console.error("🔴 No Response Received:", err.request);
    } else {
      console.error("🔴 Request Setup Error:", err.message);
    }
  }
})();
