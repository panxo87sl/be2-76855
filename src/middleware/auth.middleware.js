import { request, response } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";

//? Esta linea protege las rutas leyendo la cookie "acces_token"
// export const requireJwtCookie = passport.authenticate("jwt-cookie", { session: false });
export function requireJwtCookie(request, response, next) {
  passport.authenticate("jwt-cookie", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return response
        .status(401)
        .json({
          error: "Token inválido o expirado",
          message: info?.message || "No se pudo autenticar al usuario",
        });
    }
    request.user = user; // Asigna el user para que lo uses en la ruta
    next();
  })(request, response, next);
}

export function requireLogin(request, response, next) {
  if (!request.session.user) {
    return response.status(401).json({ error: "Usuario no autorizado" });
  }
  next();
}

export function alreadyLoggedIn(request, response, next) {
  if (request.session.user) {
    return response.status(403).json({ error: "Usuario ya está logueado" });
  }
  next();
}

export function requireJWT(request, response, next) {
  const header = request.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return response.status(401).json({ error: "No existe el token" });

  try {
    request.jwt = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return response.status(401).json({ error: "Token invalido/expirado" });
  }
}
