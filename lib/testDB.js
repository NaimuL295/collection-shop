
import { dbConnect } from "./dbConnect";


app.get("/check", async (req, res) => {
  try {
    await dbConnect();
    res.send("✅ MongoDB connected successfully!");
  } catch (error) {
    res.status(500).send("❌ Connection failed: " + error.message);
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
