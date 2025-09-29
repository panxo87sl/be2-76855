//Autorizacion por Roles
export function requireRole(role) {
  return (request, response, next) => {
    const user = request.session?.user || request.user; //?session o passport
    if (!user) return response.status(401).json({ error: "No hay Autorizacion" });
    if (user.role !== role) return response.status(403).json({ error: "Prohibido" });
    next();
  };
}
