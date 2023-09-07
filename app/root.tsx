import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import styles from "./styles/app.css";
import crystallizeStyles from "@crystallize/design-system/styles.css";
export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: crystallizeStyles },
  ];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "SEO content validator",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <script
          defer
          src="https://pim.crystallize.com/static/frontend-preview-listener.js"
        />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration/>
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
