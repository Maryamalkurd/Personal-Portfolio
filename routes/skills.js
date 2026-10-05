const express = require("express");
const router = express.Router();
const pool = require("../db");
const verifyToken = require("../middleware/auth");

router.get("/skills", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM skills ORDER BY sort_order, id");
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/skills", verifyToken, async (req, res) => {
  const { name, percentage, sort_order } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO skills (name, percentage, sort_order) VALUES ($1,$2,$3) RETURNING *",
      [name, percentage, sort_order || 0]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/skills/:id", verifyToken, async (req, res) => {
  const { name, percentage, sort_order } = req.body;
  try {
    const result = await pool.query(
      "UPDATE skills SET name=$1, percentage=$2, sort_order=$3 WHERE id=$4 RETURNING *",
      [name, percentage, sort_order || 0, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/skills/:id", verifyToken, async (req, res) => {
  try {
    await pool.query("DELETE FROM skills WHERE id=$1", [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;