const jwt = require("jsonwebtoken")
const ACCESS_TOKEN_SECRET = "c64618df-8db7-4f9f-b093-c1e14f64b4bc"
const REFRESH_TOKEN_SECRET = "4b877713-a187-426e-8792-194ed90f84e6"
export function verifyAccessToken(token: string) {
    return jwt.verify(token, ACCESS_TOKEN_SECRET)
}
export function verifyRefreshToken(token: string) {
    return jwt.verify(token, REFRESH_TOKEN_SECRET)
}