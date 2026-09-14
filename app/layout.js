export const metadata = {
  title: "Zayra APIs - Social Media API Hub",
  description: "Sri Lanka's social media API reseller hub - coins system, LKR prices, admin panel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
