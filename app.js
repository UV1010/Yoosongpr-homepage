const rootElement = document.getElementById('liquid-ether-root');

if (rootElement && window.createLiquidEther) {
  let liquidInstance = null;
  let currentTheme = '';

  const baseOptions = {
    mouseForce: 20,
    cursorSize: 100,
    isViscous: true,
    viscous: 30,
    iterationsViscous: 32,
    iterationsPoisson: 32,
    resolution: 0.5,
    isBounce: false,
    autoDemo: true,
    autoSpeed: 0.5,
    autoIntensity: 2.2,
    takeoverDuration: 0.25,
    autoResumeDelay: 3000,
    autoRampDuration: 0.6
  };

  const palettes = {
    dark: {
      colors: ['#5227FF', '#FF9FFC', '#B497CF'],
      color0: '#001fff',
      color1: '#217af2',
      color2: '#b4dcff'
    },
    light: {
      colors: ['#74c7ff', '#1597ff', '#eef9ff'],
      color0: '#9cddff',
      color1: '#2aa8ff',
      color2: '#eef9ff',
      mouseForce: 26,
      cursorSize: 150,
      autoSpeed: 0.62,
      autoIntensity: 3
    }
  };

  function renderLiquid() {
    const theme = document.body.dataset.theme === 'light' ? 'light' : 'dark';
    if (theme === currentTheme && liquidInstance) return;
    currentTheme = theme;
    if (liquidInstance) liquidInstance.destroy();
    liquidInstance = window.createLiquidEther(rootElement, {
      ...baseOptions,
      ...palettes[theme]
    });
  }

  renderLiquid();

  new MutationObserver(renderLiquid).observe(document.body, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
}
