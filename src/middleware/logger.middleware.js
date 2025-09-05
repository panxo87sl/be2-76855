function logger(request, response, next) {
  const start = Date.now();

  response.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`[ACTION] ${request.method} ${request.originalUrl} | Status: ${response.statusCode} | Time: ${ms}ms | Date: ${Date.now()}`);
  });

  next();
}

export default logger;
