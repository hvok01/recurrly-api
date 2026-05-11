import express from "express";

export function httpResponse(
  status: number,
  message: string,
  data: any,
  res: express.Response
): express.Response {
  return res.status(status).json({
    message,
    data,
  });
}
