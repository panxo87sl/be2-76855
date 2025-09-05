import { request, response } from "express";

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

//Autorizacion por Roles
export function requireRole(role) {
  return (request, response, next) => {
    const user = request.session?.user || request.user; //?session o passport
    if (!user) return response.status(401).json({ error: "No hay Autorizacion" });
    if (user.role !== role) return response.status(403).json({ error: "Prohibido" });
    next();
  };
}

export function requireJWT(request, response, next) {
  const header = request.header.authorization || "";
  const token = header.startWith("Bearer ") ? header.slice(7) : null;
  if (!token) return response.status(401).json({ error: "No existe el token" });
  try {
    request.jwt = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return response.session(401).json({ error: "Token invalido/expirado" });
  }
}
