import { auth } from "@/auth"

export default auth((req) => {
    if (req.auth !== null && req.nextUrl.pathname === '/login') {
        return Response.redirect(new URL('/', req.nextUrl.origin));
    }

    if (!req.auth && req.nextUrl.pathname !== "/login") {
        const originPath = req.nextUrl.pathname.substring(1);
        const newUrl = new URL("/login", req.nextUrl.origin)

        if (originPath) {
            newUrl.searchParams.set('redirect', originPath)
        }
        return Response.redirect(newUrl)
    }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}