// 入口（Work.register 容器合同）：DOM 注入 + 尺寸自适应 + 启动
Work.register({
  name: 'underrun',
  mount: function (ctx) {
    // 兼容不同 harness：stage 可能挂在 stage/element/root，或 ctx 本身就是容器
    var st = ctx.stage || ctx.element || ctx.root || ctx;
    if (!st || typeof st.appendChild !== 'function') {
      st = document.createElement('div');
      document.body.appendChild(st);
    }
    var bounds = ctx.bounds || st.getBoundingClientRect() || { w: 320, h: 180 };
    st.style.background = '#000';
    var style = document.createElement('style');
    style.textContent = "body{margin:0;background:#000}div:last-child{color:#e90;}b{animation:r 1s infinite;}@keyframes r{50%{opacity:0;}}#c{width:100%;height:100%;image-rendering:optimizeSpeed;image-rendering:pixelated;cursor:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHAQMAAAD+nMWQAAAABGdBTUEAALGPC/xhBQAAAAZQTFRFAAAA////pdmf3QAAAAF0Uk5TAEDm2GYAAAATSURBVAjXYxBgEGBgYDgGxEAWAAc4AQebSvKuAAAAAElFTkSuQmCC),auto;}#a{font-weight:bold;color:#c80;position:absolute;top:4vw;left:2vw;font-size:1.6vw;overflow:hidden;white-space:nowrap;width:94%;text-shadow: 0 0 7px #f70;transition:opacity 1s;}";
    document.head.appendChild(style);
    var c = document.createElement('canvas');
    c.id = 'c';
    c.width = bounds.w || 320;
    c.height = bounds.h || 180;
    if (typeof ctx.onBounds === 'function') {
      ctx.onBounds(function (b) { c.width = b.w; c.height = b.h; });
    }
    var a = document.createElement('code');
    a.id = 'a';
    st.appendChild(c); st.appendChild(a);
    var tag = document.createElement('div');
    tag.textContent = 'UNDERRUN 汉化版（WASD/方向键移动，鼠标/触屏射击）';
    tag.style.position = 'absolute';
    tag.style.top = '4px';
    tag.style.left = '6px';
    tag.style.color = 'rgba(255,255,255,0.55)';
    tag.style.fontSize = '10px';
    tag.style.lineHeight = '12px';
    tag.style.fontFamily = 'monospace';
    tag.style.pointerEvents = 'none';
    tag.style.zIndex = '10';
    st.appendChild(tag);
    // 触屏支持：pointerdown 持续射击，pointermove 映射为瞄准坐标
    var r10 = window.__underrun_input || (window.__underrun_input = { fire: 0, mx: 0, my: 0 });
    function pd(e) { r10.fire = 1; pm(e); }
    function pu() { r10.fire = 0; }
    function pm(e) {
      var rect = c.getBoundingClientRect();
      r10.mx = (e.clientX - rect.left) / rect.width * c.width;
      r10.my = (e.clientY - rect.top) / rect.height * c.height;
    }
    c.addEventListener('pointerdown', pd);
    c.addEventListener('pointermove', pm);
    window.addEventListener('pointerup', pu);
    c.style.touchAction = 'none';
    this._onWinUp = pu;
    this._nodes = [style, c, a, tag];
    // 让游戏读取触屏输入：把合成输入并入 Proxy 键值（在 boot 前注入）
    if (!window.__underrun_tap) {
      window.__underrun_tap = r10;
    }
    underrun_boot(c, a);
  },
  destroy: function () {
    if (window.__underrun_stop) window.__underrun_stop();
    var self = this;
    if (self._onWinUp) {
      window.removeEventListener('pointerup', self._onWinUp);
      self._onWinUp = null;
    }
    delete window.__underrun_input;
    (self._nodes || []).forEach(function (n) {
      if (n.parentNode) n.parentNode.removeChild(n);
    });
    self._nodes = [];
  },
});
