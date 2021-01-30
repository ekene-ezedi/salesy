const { pool } = require("./config");

//get current data
const currentDate = () => {
  let today = new Date();
  let date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  let time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return date + " " + time;
};

//post sales info to database
const addSalesInfo = (req, res) => {
  let { username, amount, date } = req.body;
  date = currentDate();
  pool.query(
    "INSERT INTO sales (username,amount,date) VALUES ($1,$2,$3)",
    [username, amount, date],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json(error);
      }
      res.status(200).send("Sales info added successfully");
    }
  );
};

//get dales info
const salesStats = (req, res) => {
  const param = req.params.param;
  //daily stats
  if (param == "daily") {
    pool.query(
      "SELECT extract(hour from date) AS hour, COUNT(*) AS number_of_sales, SUM(amount) FROM sales where date(date) = current_date GROUP BY extract(hour from date)",
      (error, results) => {
        if (error) {
          return res.status(500).json(error);
        }
        res.status(200).json(results.rows);
      }
    );
  }
  if (param == "weekly") {
    pool.query(
      `select date_trunc('day',date) as day, count(*) as no_of_sales, sum(amount) from sales where date between date_trunc('week',current_date) and current_date + 1 group by date_trunc('day',date) order by date_trunc('day',date) desc`,

      (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).json(error);
        }
        res.status(200).json(results.rows);
      }
    );
  }

  if (param == "monthly") {
    pool.query(
      "select date_trunc('day',date) as day, count(*) as no_of_sales, sum(amount) from sales where date >= date_trunc('month',current_date) group by date_trunc('day',date) order by date_trunc('day',date) desc",

      (error, results) => {
        if (error) {
          return res.status(500).json(error);
        }
        res.status(200).json(results.rows);
      }
    );
  }

  if (param !== "daily" && param !== "weekly" && param !== "monthly") {
    return res.status(500).send("Invalid params");
  }
};
module.exports = { addSalesInfo, salesStats };
