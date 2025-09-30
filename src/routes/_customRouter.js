import { Router } from "express";

export default class CustomRouter {
  constructor({ mergeParams = true, base = "" } = {}) {
    this.base = base;
    this.router = Router({ mergeParams });

    this.params = this.router.param.bind(this.router);
  }

  _warp(fn) {
    if (typeof fn != "function") return fn;

    return function wrapped(request, response, next) {
      try {
        const r = fn(request, response, next);
        if (r && typeof r.then === "function") r.catch(next);
      } catch (error) {
        next(error);
      }
    };
  }

  use(...arg) {
    this.router.use(...args);
  }

  get(path, ...handlers) {
    this.router.get(path, ...handlers.map((h) => this._warp(h)));
  }
  post(path, ...handlers) {
    this.router.get(path, ...handlers.map((h) => this._warp(h)));
  }
  put(path, ...handlers) {
    this.router.get(path, ...handlers.map((h) => this._warp(h)));
  }
  delete(path, ...handlers) {
    this.router.get(path, ...handlers.map((h) => this._warp(h)));
  }

  //helper para agrupar rutas con prefijo (subrouter)
  group(prefix, buildfn) {
    const sub = new CustomRouter();
    buildfn(sub);
    this.router.use(prefix, sub.router);
  }
}
