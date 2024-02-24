const jwt = require("jsonwebtoken")

import dotenv from 'dotenv';
dotenv.config();

function sign(payload:any, isAccessToken:boolean){

    const ACCESS_TOKEN_SECRET="c64618df-8db7-4f9f-b093-c1e14f64b4bc"
    const REFRESH_TOKEN_SECRET="4b877713-a187-426e-8792-194ed90f84e6"
    //return jwt.sign(payload, isAccessToken? process.env.ACCESS_TOKE_SECRET: process.env.REFRESH_TOKEN_SECRET, {
    //    algorithm: "HS256",
    //    experiesIn: 7200,
    //})
    return jwt.sign(payload, isAccessToken ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: 180, 
    });
    
}

export function generateAccessToken(user:any){
    return sign({user}, true);
}

export function generateRefreshToken(user:any){
    return sign({user}, false);
}

