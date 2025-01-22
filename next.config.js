// @ts-check

/** @type {import('next').NextConfig} */
module.exports = {
  logging: {
    fetches: { fullUrl: process.env.NODE_ENV === "development" },
  },
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx"],
};
