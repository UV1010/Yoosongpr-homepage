(function () {
  const vertexShader = `
    attribute vec2 aPosition;
    varying vec2 vUv;
    void main() {
      vUv = aPosition * 0.5 + 0.5;
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;

  const fragmentShader = `
    precision highp float;
    uniform vec2 uResolution;
    uniform vec2 uPointer;
    uniform vec2 uVelocity;
    uniform float uTime;
    uniform float uCursorSize;
    uniform float uMouseForce;
    uniform float uViscous;
    uniform float uIsViscous;
    uniform float uIsBounce;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;
    varying vec2 vUv;

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 345.45));
      p += dot(p, p + 34.345);
      return fract(p.x * p.y);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
        u.y
      );
    }

    float fbm(vec2 p) {
      float value = 0.0;
      float amp = 0.5;
      for (int i = 0; i < 5; i++) {
        value += amp * noise(p);
        p *= 2.04;
        amp *= 0.5;
      }
      return value;
    }

    void main() {
      vec2 uv = vUv;
      vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
      vec2 p = (uv - 0.5) * aspect;
      vec2 pointer = uPointer;
      pointer.y *= -1.0;
      vec2 pp = pointer * 0.5 * aspect;

      float viscousMode = clamp(uIsViscous, 0.0, 1.0);
      float speed = min(length(uVelocity) * uMouseForce, mix(6.0, 2.35, viscousMode));
      float brush = max(uCursorSize / max(uResolution.x, uResolution.y), 0.045) * mix(1.0, 1.7, viscousMode);
      float d = distance(p, pp);
      float pulse = exp(-(d * d) / (brush * brush)) * mix(0.36 + speed, 0.09 + speed * 0.36, viscousMode);
      float viscosity = mix(1.0, 0.56, viscousMode);

      vec2 flow = vec2(
        fbm(p * 2.25 + vec2(uTime * 0.08, -uTime * 0.05)),
        fbm(p * 2.25 + vec2(-uTime * 0.06, uTime * 0.09))
      );
      vec2 swirl = normalize(vec2(-(p.y - pp.y), p.x - pp.x) + 0.0001) * pulse * mix(0.09, 0.032, viscousMode);
      vec2 q = p + (flow - 0.5) * 0.36 * viscosity + swirl;

      float bands = fbm(q * 3.1 + uTime * 0.12);
      float ribbon = sin((q.x + bands * 0.44) * 8.4 + uTime * 0.72) * 0.5 + 0.5;
      float edge = smoothstep(-0.08, 0.92, 1.08 - length(p) * 0.52);
      float boundary = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
      float bounce = mix(1.0, smoothstep(0.04, 0.16, boundary), uIsBounce);
      float alpha = clamp((0.16 + bands * 0.42 + ribbon * 0.48 + pulse * mix(0.28, 0.08, viscousMode)) * edge * bounce, 0.0, 0.9);

      vec3 color = mix(uColorA, uColorB, smoothstep(0.18, 0.88, bands));
      color = mix(color, uColorC, smoothstep(0.35, 1.0, ribbon + pulse * mix(0.2, 0.06, viscousMode)));
      color += pulse * vec3(0.18, 0.14, 0.08) * mix(1.0, 0.42, viscousMode);
      gl_FragColor = vec4(color, alpha);
    }
  `;

  const defaults = {
    colors: ['#5227FF', '#FF9FFC', '#B497CF'],
    color0: '',
    color1: '',
    color2: '',
    mouseForce: 20,
    cursorSize: 100,
    resolution: 0.5,
    dt: 0.014,
    BFECC: true,
    isViscous: false,
    viscous: 30,
    iterationsViscous: 32,
    iterationsPoisson: 32,
    isBounce: false,
    autoDemo: true,
    autoSpeed: 0.5,
    autoIntensity: 2.2,
    takeoverDuration: 0.25,
    autoResumeDelay: 1000,
    autoRampDuration: 0.6,
    className: '',
    style: {}
  };

  function hexToRgb(hex) {
    const fallback = [1, 1, 1];
    if (typeof hex !== 'string') return fallback;
    const clean = hex.replace('#', '').trim();
    if (!/^[0-9a-fA-F]{6}$/.test(clean)) return fallback;
    const value = parseInt(clean, 16);
    return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
  }

  function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) || 'Shader compile failed');
    }
    return shader;
  }

  function createProgram(gl) {
    const program = gl.createProgram();
    gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, vertexShader));
    gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || 'Program link failed');
    }
    return program;
  }

  function createLiquidEther(target, options = {}) {
    if (!target) return null;
    const props = { ...defaults, ...options };
    const container = document.createElement('div');
    container.className = `liquid-ether-container ${props.className || ''}`.trim();
    Object.assign(container.style, props.style || {});
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    target.appendChild(container);

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false
    });
    if (!gl) {
      container.classList.add('is-webgl-unavailable');
      return { destroy: () => container.remove() };
    }

    const program = createProgram(gl);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'aPosition');
    const uniforms = {
      resolution: gl.getUniformLocation(program, 'uResolution'),
      pointer: gl.getUniformLocation(program, 'uPointer'),
      velocity: gl.getUniformLocation(program, 'uVelocity'),
      time: gl.getUniformLocation(program, 'uTime'),
      cursorSize: gl.getUniformLocation(program, 'uCursorSize'),
      mouseForce: gl.getUniformLocation(program, 'uMouseForce'),
      viscous: gl.getUniformLocation(program, 'uViscous'),
      isViscous: gl.getUniformLocation(program, 'uIsViscous'),
      isBounce: gl.getUniformLocation(program, 'uIsBounce'),
      colorA: gl.getUniformLocation(program, 'uColorA'),
      colorB: gl.getUniformLocation(program, 'uColorB'),
      colorC: gl.getUniformLocation(program, 'uColorC')
    };

    const pointer = { x: 0, y: 0 };
    const displayPointer = { x: 0, y: 0 };
    const previous = { x: 0, y: 0 };
    const autoPointer = { x: 0, y: 0 };
    const autoTarget = { x: 0.4, y: -0.2 };
    let width = 1;
    let height = 1;
    let raf = 0;
    let lastFrame = performance.now();
    let lastInteraction = performance.now();
    let autoActive = Boolean(props.autoDemo);
    let autoStarted = performance.now();
    let isVisible = true;

    function resize() {
      const rect = target.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      const pixelRatio = Math.min((window.devicePixelRatio || 1) * Math.max(0.25, props.resolution), 2);
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function setPointer(clientX, clientY) {
      const rect = target.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((clientY - rect.top) / rect.height) * 2 - 1);
      if (x < -1 || x > 1 || y < -1 || y > 1) return;
      pointer.x = x;
      pointer.y = y;
      lastInteraction = performance.now();
      autoActive = false;
    }

    function pickTarget() {
      const margin = 0.72;
      autoTarget.x = (Math.random() * 2 - 1) * margin;
      autoTarget.y = (Math.random() * 2 - 1) * margin;
    }

    function moveAuto(now, delta) {
      if (!props.autoDemo) return;
      if (now - lastInteraction <= props.autoResumeDelay) return;
      if (!autoActive) {
        autoActive = true;
        autoStarted = now;
        autoPointer.x = pointer.x;
        autoPointer.y = pointer.y;
        pickTarget();
      }
      const ramp = Math.min(1, (now - autoStarted) / Math.max(1, props.autoRampDuration * 1000));
      const dx = autoTarget.x - autoPointer.x;
      const dy = autoTarget.y - autoPointer.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 0.03) pickTarget();
      const step = props.autoSpeed * delta * ramp;
      autoPointer.x += (dx / Math.max(distance, 0.0001)) * step;
      autoPointer.y += (dy / Math.max(distance, 0.0001)) * step;
      const takeover = Math.min(1, props.takeoverDuration + 0.02);
      pointer.x += (autoPointer.x - pointer.x) * takeover;
      pointer.y += (autoPointer.y - pointer.y) * takeover;
    }

    function render(now) {
      if (isVisible) {
        const delta = Math.min((now - lastFrame) / 1000, 0.05);
        moveAuto(now, delta);
        const follow = props.isViscous ? 0.055 : 0.18;
        displayPointer.x += (pointer.x - displayPointer.x) * follow;
        displayPointer.y += (pointer.y - displayPointer.y) * follow;
        const vx = (displayPointer.x - previous.x) * (autoActive ? props.autoIntensity : 1);
        const vy = (displayPointer.y - previous.y) * (autoActive ? props.autoIntensity : 1);
        previous.x += (displayPointer.x - previous.x) * Math.min(1, props.dt * 72);
        previous.y += (displayPointer.y - previous.y) * Math.min(1, props.dt * 72);

        const colors = props.colors && props.colors.length ? props.colors : defaults.colors;
        const palette = [
          props.color0 || colors[0],
          props.color1 || colors[1] || colors[0],
          props.color2 || colors[2] || colors[1] || colors[0]
        ];
        const colorA = hexToRgb(palette[0] || defaults.colors[0]);
        const colorB = hexToRgb(palette[1] || defaults.colors[1]);
        const colorC = hexToRgb(palette[2] || defaults.colors[2]);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);
        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
        gl.uniform2f(uniforms.pointer, displayPointer.x, displayPointer.y);
        gl.uniform2f(uniforms.velocity, vx, vy);
        gl.uniform1f(uniforms.time, now * 0.001 * (props.BFECC ? 1 : 0.82));
        gl.uniform1f(uniforms.cursorSize, props.cursorSize);
        gl.uniform1f(uniforms.mouseForce, props.mouseForce);
        gl.uniform1f(uniforms.viscous, props.viscous);
        gl.uniform1f(uniforms.isViscous, props.isViscous ? 1 : 0);
        gl.uniform1f(uniforms.isBounce, props.isBounce ? 1 : 0);
        gl.uniform3fv(uniforms.colorA, colorA);
        gl.uniform3fv(uniforms.colorB, colorB);
        gl.uniform3fv(uniforms.colorC, colorC);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      lastFrame = now;
      raf = requestAnimationFrame(render);
    }

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(entries => {
      isVisible = Boolean(entries[0] && entries[0].isIntersecting);
    });
    const pointerMove = event => setPointer(event.clientX, event.clientY);
    const touchMove = event => {
      if (event.touches.length === 1) setPointer(event.touches[0].clientX, event.touches[0].clientY);
    };

    window.addEventListener('pointermove', pointerMove);
    window.addEventListener('touchmove', touchMove, { passive: true });
    resizeObserver.observe(target);
    intersectionObserver.observe(target);
    resize();
    raf = requestAnimationFrame(render);

    return {
      container,
      canvas,
      destroy() {
        cancelAnimationFrame(raf);
        window.removeEventListener('pointermove', pointerMove);
        window.removeEventListener('touchmove', touchMove);
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        container.remove();
      }
    };
  }

  window.createLiquidEther = createLiquidEther;
})();
