import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    route("/", "routes/layout.tsx", [
        index("routes/home.tsx"),
        route("overview", "routes/overview.tsx"),
        route("transaction", "routes/transaction.tsx"),
        route("transaction-records", "routes/transaction-records.tsx"),
        route("notification", "routes/notification.tsx"),
        route("demo", "routes/demo.tsx"),
    ]),
    route("login", "routes/login.tsx"),
] satisfies RouteConfig;
