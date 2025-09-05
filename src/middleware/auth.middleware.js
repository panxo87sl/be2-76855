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
