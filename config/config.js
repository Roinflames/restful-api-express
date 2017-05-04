export const express = {
  port: process.env.PORT || 7000,
  ssl: process.env.HTTPS_PORT || 9999
};

export const mongo = {
  uri: "mongodb://localhost/apineo",
  secret: "secret"
}
