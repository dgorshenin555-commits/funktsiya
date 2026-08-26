/* side_rays.jsx — лучи из угла как фон hero.
   Порт SideRays (React Bits): тот же фрагментный шейдер, но на чистом
   WebGL — ogl в проекте нет, а он только обёртка над GL. */
(function () {
  const { useRef, useEffect } = React;

  const hexToRgb = h => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
    return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
  };
  const flipOf = o => o === "top-left" ? [1, 0] : o === "bottom-right" ? [0, 1] : o === "bottom-left" ? [1, 1] : [0, 0];

  const VERT = `attribute vec2 position;void main(){gl_Position=vec4(position,0.0,1.0);}`;
  const FRAG = `precision highp float;
uniform float iTime;uniform vec2 iResolution;uniform float iSpeed;
uniform vec3 iRayColor1;uniform vec3 iRayColor2;uniform float iIntensity;
uniform float iSpread;uniform float iFlipX;uniform float iFlipY;uniform float iTilt;
uniform float iSaturation;uniform float iBlend;uniform float iFalloff;uniform float iOpacity;
float rayStrength(vec2 raySource,vec2 rayRefDirection,vec2 coord,float seedA,float seedB,float speed){
  vec2 sourceToCoord=coord-raySource;
  float cosAngle=dot(normalize(sourceToCoord),rayRefDirection);
  return clamp((0.45+0.15*sin(cosAngle*seedA+iTime*speed))+(0.3+0.2*cos(-cosAngle*seedB+iTime*speed)),0.0,1.0)
    *clamp((iResolution.x-length(sourceToCoord))/iResolution.x,0.5,1.0);
}
void main(){
  vec2 fragCoord=gl_FragCoord.xy;
  if(iFlipX>0.5)fragCoord.x=iResolution.x-fragCoord.x;
  if(iFlipY>0.5)fragCoord.y=iResolution.y-fragCoord.y;
  vec2 coord=vec2(fragCoord.x,iResolution.y-fragCoord.y);
  vec2 rayPos=vec2(iResolution.x*1.1,-0.5*iResolution.y);
  float tiltRad=iTilt*3.14159265/180.0;
  float cs=cos(tiltRad),sn=sin(tiltRad);
  vec2 rel=coord-rayPos;
  vec2 tiltedCoord=vec2(rel.x*cs-rel.y*sn,rel.x*sn+rel.y*cs)+rayPos;
  float halfSpread=iSpread*0.275;
  vec2 d1=normalize(vec2(cos(0.785398+halfSpread),sin(0.785398+halfSpread)));
  vec2 d2=normalize(vec2(cos(0.785398-halfSpread),sin(0.785398-halfSpread)));
  vec4 rays1=vec4(iRayColor1,1.0)*rayStrength(rayPos,d1,tiltedCoord,36.2214,21.11349,iSpeed);
  vec4 rays2=vec4(iRayColor2,1.0)*rayStrength(rayPos,d2,tiltedCoord,22.3991,18.0234,iSpeed*0.2);
  vec4 color=rays1*(1.0-iBlend)*0.9+rays2*iBlend*0.9;
  float dl=length(fragCoord.xy-vec2(rayPos.x,iResolution.y-rayPos.y))/iResolution.y;
  color.rgb*=iIntensity*0.4/pow(max(dl,0.001),iFalloff);
  float gray=dot(color.rgb,vec3(0.299,0.587,0.114));
  color.rgb=mix(vec3(gray),color.rgb,iSaturation);
  color.a=max(color.r,max(color.g,color.b))*iOpacity;
  gl_FragColor=color;
}`;

  function SideRays({
    speed = 1.1, rayColor1 = "#C9F24A", rayColor2 = "#9BB8CE", intensity = 1.15,
    spread = 1.7, origin = "top-right", tilt = -6, saturation = 1.05,
    blend = 0.62, falloff = 1.9, opacity = 0.42, className = "",
  }) {
    const box = useRef(null);
    const P = useRef({});
    P.current = { speed, rayColor1, rayColor2, intensity, spread, origin, tilt, saturation, blend, falloff, opacity };

    useEffect(() => {
      const el = box.current;
      if (!el) return;
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const cv = document.createElement("canvas");
      cv.style.cssText = "display:block;width:100%;height:100%";
      el.appendChild(cv);
      const gl = cv.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: true });
      if (!gl) { el.removeChild(cv); return; }

      const sh = (t, src) => { const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); return s; };
      const pr = gl.createProgram();
      gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT));
      gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(pr);
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { el.removeChild(cv); return; }
      gl.useProgram(pr);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(pr, "position");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      const U = n => gl.getUniformLocation(pr, n);
      const u = {
        t: U("iTime"), res: U("iResolution"), sp: U("iSpeed"), c1: U("iRayColor1"), c2: U("iRayColor2"),
        int: U("iIntensity"), spr: U("iSpread"), fx: U("iFlipX"), fy: U("iFlipY"), tilt: U("iTilt"),
        sat: U("iSaturation"), bl: U("iBlend"), fo: U("iFalloff"), op: U("iOpacity"),
      };

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const resize = () => {
        const w = el.clientWidth, h = el.clientHeight;
        cv.width = Math.max(1, Math.round(w * dpr));
        cv.height = Math.max(1, Math.round(h * dpr));
        gl.viewport(0, 0, cv.width, cv.height);
        gl.uniform2f(u.res, cv.width, cv.height);
      };
      const ro = new ResizeObserver(resize); ro.observe(el); resize();

      let vis = true, raf = 0;
      const io = new IntersectionObserver(e => { vis = e[0].isIntersecting; }, { threshold: 0.02 });
      io.observe(el);

      const loop = t => {
        raf = requestAnimationFrame(loop);
        if (!vis) return;
        const p = P.current, f = flipOf(p.origin);
        gl.uniform1f(u.t, t * 0.001);
        gl.uniform1f(u.sp, p.speed);
        gl.uniform3fv(u.c1, hexToRgb(p.rayColor1));
        gl.uniform3fv(u.c2, hexToRgb(p.rayColor2));
        gl.uniform1f(u.int, p.intensity);
        gl.uniform1f(u.spr, p.spread);
        gl.uniform1f(u.fx, f[0]); gl.uniform1f(u.fy, f[1]);
        gl.uniform1f(u.tilt, p.tilt);
        gl.uniform1f(u.sat, p.saturation);
        gl.uniform1f(u.bl, p.blend);
        gl.uniform1f(u.fo, p.falloff);
        gl.uniform1f(u.op, p.opacity);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };
      raf = requestAnimationFrame(loop);

      return () => {
        cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
        const lose = gl.getExtension("WEBGL_lose_context");
        if (lose) lose.loseContext();
        if (cv.parentNode === el) el.removeChild(cv);
      };
    }, []);

    return <div ref={box} className={("rays " + className).trim()} aria-hidden="true" />;
  }

  Object.assign(window, { SideRays });
})();
