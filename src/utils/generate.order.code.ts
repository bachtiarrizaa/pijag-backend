import dayjs from "dayjs";

export function generateOrderCode(source: "customer" | "cashier"){
  let prefix;

  if (source === "customer") {
    prefix = "C";
  }  else {
    prefix = "K";
  }

  const random = Math.floor(1000 + Math.random() * 9000);
  const date = dayjs().format("YYYYMMDD");

  return prefix + "-" + date + "-" + random;
}