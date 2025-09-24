import app from "./app.js";

const PORT = process.env.PORT || 5002; // Different port than company-service

app.listen(PORT, () => {
  console.log(`User service running on ${PORT}`);
});
