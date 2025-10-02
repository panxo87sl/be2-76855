//Autorizacion por Roles
export function requireRole(role) {
  return (request, response, next) => {
    const user = request.session?.user || request.user; //?session o passport
    if (!user)
      return response.status(401).json({
        error: "No autorizado",
        message: "Debes iniciar sesión para acceder",
      });
    if (user.role !== role)
      return response.status(403).json({
        error: "Prohibido",
        message: `Requiere rol: ${role}, pero tú eres: ${user.role}`,
      });
    next();
  };
}
